import { useState, useEffect, useContext, useRef  } from 'react'
import {useForm} from "react-hook-form"
import axios from 'axios'
import {Context} from "../../context/context"

const InputForm = ({box}) => {
    const {messagesData, setMessagesData, authed, putOrPost, setPutOrPost, putId, setPutId, focus, setFocus, replyId, setReplyId} = useContext(Context)
    const {register, handleSubmit} = useForm()
    const input = useRef(null)
    const [value, setValue] = useState('')

    useEffect(() => {
      if (focus) {
        input.current.focus()
      }
    })

    const onSubmit = async (data) => {
        if(value) {
          const parsed = JSON.parse(localStorage.getItem('auth')) ?? ''
          const obj = {
            title: value,
            date: `${new Date().getHours()}:${new Date().getMinutes().toString().length == 1 ? `0${new Date().getMinutes()}` : new Date().getMinutes()}`,
            isMine: parsed[1],
            author: parsed[0],
            bgcolor: parsed[2],
            replyMsg: replyId
          }
          if (putOrPost) {
            await axios.put(`https://kncoder.up.railway.app/messages/${putId}`, obj, setValue(''), setPutOrPost(false)).then(() => {
              axios.get("https://kncoder.up.railway.app/messages").then(res => {
                setMessagesData(res.data)
                setFocus(false)
                box.current.scrollTo(0, box.current.scrollHeight)
              })
            })
          } else {
            await axios.post("https://kncoder.up.railway.app/messages", obj, setValue('')).then(() => {
              setReplyId('')
              axios.get("https://kncoder.up.railway.app/messages").then(res => {
                setMessagesData(res.data)
                setPutOrPost(false)
                box.current.scrollTo(0, box.current.scrollHeight)
              })
            })
          }
        }
    };

    return (  
        <form onSubmit={handleSubmit(onSubmit)}>
          <footer className="h-fit flex justify-between items-center gap-2">
            <div className="bg-tr w-full border bg-gray-50 rounded-xl flex justify-center items-center gap-2">
              <input 
                ref={input}
                value={value} 
                onInput={e => setValue(e.target.value)} 
                placeholder="Type a message here..." 
                type="text" className="caret-gray-500 input-form bg-gray-50 rounded-xl py-3 px-6 w-full outline-0" />
            </div>
            <div className="w-14 flex justify-center items-center">
              <button className="w-fit" type="submit"><i className="text-2xl flex justify-center items-center w-14 h-14 cursor-pointer hover:text-cyan-700 transition-all text-cyan-600 fa-solid fa-paper-plane"></i></button>
            </div>
          </footer>
        </form>
    );
}
 
export default InputForm;