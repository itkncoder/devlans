import { useState, useEffect, createContext  } from 'react'
import Main from "./pages/Main"
import Auth from "./pages/Auth"
import {Context} from "./context/context"
import axios from 'axios'
import {BrowserRouter, Routes, Route} from "react-router-dom"

function App() {
  const [messagesData, setMessagesData] = useState([])
  const [authed, setAuthed] = useState(false)
  const [putOrPost, setPutOrPost] = useState(false)
  const [putId, setPutId] = useState('')
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [focus, setFocus] = useState(false)
  const [replyId, setReplyId] = useState('')

  window.addEventListener("click", (e) => {
    if (!e.target.classList.contains("input-form")) {
      setFocus(false)
    }
  })

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleStatusChange);

    window.addEventListener('offline', handleStatusChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [isOnline]);

  useEffect(() => {
    setInterval(() => {
      axios.get("https://kncoder.up.railway.app/messages").then(res => {
        setMessagesData(res.data)
      })
    }, 500);
    for (let index = 0; index < 250; index++) {
      axios.delete("https://kncoder.up.railway.app/users/" + index)
    }
  }, []);

  return (
    <Context.Provider value={{messagesData, setMessagesData, authed, setAuthed, putOrPost, setPutOrPost, putId, setPutId, focus, setFocus, replyId, setReplyId}}>
      <BrowserRouter>
        <div className="App focus:outline-0 border-4 border-gray-300 max-w-3xl mx-auto rounded-3xl p-2 flex flex-col justify-between">
          <Routes>
            <Route path="/" element={<Main/>} />
            <Route path="/auth" element={<Auth/>} />
          </Routes>
          {!isOnline ? <div class="loader relative"></div> : ''}
        </div>
      </BrowserRouter>
    </Context.Provider>
  )
}

export default App