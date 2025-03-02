import React, { useState } from 'react'
import { SunIcon, MoonIcon, UserIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`p-4 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-cyan-600'} text-white flex justify-between items-center`}>
        <h1 className="text-2xl font-bold">Support Agent ChatBot</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`ml-4 p-2 rounded-lg ${darkMode ? 'bg-cyan-500' : 'bg-cyan-700'} hover:bg-cyan-800 flex items-center`}
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 text-white" />
          ) : (
            <MoonIcon className="h-6 w-6 text-white" />
          )}
        </button>
      </header>

      {/* Chat Container */}
      <main className="flex-grow p-4 overflow-auto">
        <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="h-96 overflow-y-auto mb-4">
            {/* Chat Messages */}
            <div className="flex flex-col space-y-4">
              <div className={`flex items-start p-3 rounded-lg self-start ${darkMode ? 'bg-cyan-700' : 'bg-cyan-100'}`}>
                <div className="mr-2">
                  <ChatBubbleLeftIcon className="h-6 w-6 text-white" />
                </div>
                <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>Hello! How can I assist you today?</p>
              </div>
              <div className={`flex items-start p-3 rounded-lg self-end ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="mr-2">
                  <UserIcon className="h-6 w-6 text-gray-800" />
                </div>
                <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>I need help with integrating data.</p>
              </div>
              {/* Add more messages as needed */}
            </div>
          </div>

          {/* Input Area */}
          <div className="flex">
            <input
              type="text"
              placeholder="Type your message..."
              className={`flex-grow border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600 focus:ring-cyan-500' : 'bg-white text-gray-800 focus:ring-cyan-500'}`}
            />
            <button className={`ml-2 rounded-lg px-4 py-2 ${darkMode ? 'bg-cyan-500' : 'bg-cyan-600'} text-white hover:bg-cyan-700`}>
              Send
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`text-center p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>© 2023 Chatbot Assistant. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
