import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bs4 import BeautifulSoup
from langchain.prompts import ChatPromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import RecursiveUrlLoader
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_huggingface import HuggingFacePipeline
from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
from langchain_chroma import Chroma  

from bs4 import XMLParsedAsHTMLWarning
import warnings

warnings.filterwarnings("ignore", category=XMLParsedAsHTMLWarning)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_name = "sentence-transformers/all-mpnet-base-v2"
model_kwargs = {'device': 'cpu'}
encode_kwargs = {'normalize_embeddings': False}
embeddings = HuggingFaceEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs
)

model_id = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)

pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)
llm = HuggingFacePipeline(pipeline=pipe)

persist_directory = "./chroma_db"

def extract_text_from_html(html_content):
    soup = BeautifulSoup(html_content, "lxml")  
    return soup.get_text()

urls = [
    "https://segment.com/docs/",
    "https://docs.mparticle.com/",
    "https://docs.lytics.com/",
    "https://docs.zeotap.com/home/en-us/"
]

docs = []  
for url in urls:
    try:
        loader = RecursiveUrlLoader(url=url, max_depth=2, extractor=extract_text_from_html)
        loaded_docs = loader.load()  
        docs.extend(loaded_docs)  
        print(f"Loaded {len(loaded_docs)} documents from {url}")
    except Exception as e:
        print(f"Error loading documents from {url}: {e}")

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
splits = text_splitter.split_documents(docs)
print(f"Total splits: {len(splits)}")

if os.path.exists(persist_directory):
    vectorstore = Chroma(persist_directory=persist_directory, embedding_function=embeddings)
else:
    vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings, persist_directory=persist_directory)

retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

template = """You are an assistant. Answer the question based only on the following context. Do not add the context and question in your response:

{context}

Question: {question}
"""
prompt = ChatPromptTemplate.from_template(template)

class QueryRequest(BaseModel):
    question: str

@app.post("/chat")
def chat(request: QueryRequest):
    try:
        retrieved_docs = retriever.invoke(request.question)
        context_text = format_docs(retrieved_docs)
        
        rag_chain = (
            RunnablePassthrough()
            | prompt.invoke
            | llm
            | StrOutputParser()
        )
        
        input_data = {"context": context_text, "question": request.question}
        response = rag_chain.invoke(input_data)

        # Extract the answer from the response
        answer = response.split("Answer:")[-1].strip()  # Get the part after "Answer:"
        
        return {"response": answer}  # Return only the answer
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error Occurred: {e}")
