import { useState, useEffect, useContext, useRef  } from 'react'
import InputForm from "../components/InputForm"
import AppHeader from "../components/header"
import {Context} from "../context/context"
import {Link} from "react-router-dom"
import axios from "axios"

const Main = () => {
    const box = useRef(null)
    const [context, setContext] = useState('')
    const [modal, setModal] = useState(false)
    const {messagesData, setMessagesData, authed, putOrPost, setPutOrPost, putId, setPutId, focus, setFocus, replyId, setReplyId} = useContext(Context)

    window.addEventListener("click", (e) => {
        if (!e.target.classList.contains("fa-ellipsis-vertical")) {
            setContext('')
            setModal(false)
        }
    })

    const deleteMessage = (id) => {
        axios.delete(`https://kncoder.up.railway.app/messages/${id}`, setModal(false), setContext('')).then(() => {
            axios.get("https://kncoder.up.railway.app/messages").then(res => {
                setMessagesData(res.data)
            })
        })
    }

    const changeMessage = (id) => {
        setPutOrPost(true)
        setPutId(id)
        setFocus(true)
    }

    const messages = messagesData.map((i) => {
        const parsed = JSON.parse(localStorage.getItem('auth')) ?? ''
        const whose = i.isMine === parsed[1]

        return <div key={i.id} className={whose ? "flex justify-end items-end gap-1" : "gap-1 items-end flex justify-start"}>

            {/* avatarka */}
            {whose ? '' : i.bgcolor.includes('http') ? <img className="hover:shadow transition-all shadow-xl cursor-pointer text-slate-200 w-10 h-10 m-1 flex justify-center items-center rounded-full" src={i.bgcolor} alt="profile" /> : <div className={[
                'bg-green-700', 
                'bg-blue-700', 
                'bg-red-700', 
                'bg-pink-700', 
                'bg-gray-700',
                'bg-orange-700',
                'bg-yellow-700',
                'bg-slate-700'
            ][Math.floor(Math.random() * 8)] + " hover:shadow transition-all shadow-xl cursor-pointer text-slate-200 w-10 h-10 m-1 flex justify-center items-center rounded-full"}>{i.author[0]}</div> }

            {/* message div */}
            <div className={whose ? 
            "msg bg-gradient-to-r from-cyan-500 to-blue-500 w-fit py-2.5 px-4 rounded-xl rounded-br-sm shadow-lg" : 
            "msg bg-gray-50 border w-fit py-2 px-4 rounded-xl rounded-bl-sm shadow-lg"}>

                {/* replyed title */}
                {i.replyMsg ?
                <p className={whose ? 
                    "flex items-center text-gray-100 text-xs truncate message-reply border-gray-100 border-l-2 h-6 pl-2" : 
                    "flex items-center text-gray-800 text-xs truncate message-reply border-gray-600 border-l-2 h-6 pl-2"}>{i.replyMsg}
                </p> : ''}

                {/* author name */}
                <p className={whose ? 
                    "hidden" : 
                    "text-gray-800 text-xs truncate message-author"}>{i.author}
                </p>

                {/* message text */}
                {i.title.includes("https://") || i.title.includes("http://") ?
                <a target="_blank" href={i.title} className={whose ? "underline text-gray-100" : "underline text-gray-800"}>{i.title}</a> :
                <p className={whose ? "text-gray-100" : "text-gray-800"}>{i.title}</p>}

                {/* date */}
                <p className={whose ?
                    "absolute bottom-0.5 right-2 cursor-default text-gray-100 text-xs" : 
                    "absolute bottom-0.5 right-2 cursor-default text-gray-800 text-xs"}>{i.date}
                </p>

                {/* settings */}
                <i onClick={() => {
                        setModal(true)
                        setContext([i.id, i.isMine])
                        setFocus(true)
                    }} className={whose ?
                    "cursor-pointer text-gray-200 text-sm fa-solid absolute top-0.5 right-2.5 pt-0.5 pl-2 fa-ellipsis-vertical" : 
                    ""}>
                </i>

            </div>
            <div onClick={() => {
                setFocus(true)
                setReplyId(i.title)
            }}>
                <i className="reply cursor-pointer fa-solid fa-reply"></i>
            </div>
        </div>
    })

    return (  
        <>
            <AppHeader/>
            <main ref={box} className="relative my-4 h-full overflow-y-auto py-1">
                <div className="flex flex-col gap-2 gap-messages px-1">
                    {messages}
                    {modal ? <div className="modal flex flex-col gap-2 items-center fixed bg-gradient-to-r from-cyan-500 to-blue-500 px-4 pt-10 pb-4 rounded-xl">
                        <i className="absolute top-2 left-3 text-gray-200 p-2 cursor-pointer fa-solid fa-xmark"></i>
                        <p className="context-item text-gray-100 py-3 px-16 cursor-pointer transition-all rounded-md" onClick={() => deleteMessage(context[0])}>Delete</p>
                        <p className="context-item text-gray-100 py-3 px-16 cursor-pointer transition-all rounded-md" onClick={() => changeMessage(context[0])}>Change</p>
                    </div> : ''}
                </div>
            </main>
            {authed ? <InputForm box={box}/> : <footer className="flex p-2 gap-5 justify-center items-center">
                <p>PLEASE AUTH FOR CONTINUE...</p>
                <Link className="hover:-translate-y-0.5 transition-all bg-gradient-to-r from-cyan-500 to-blue-500 py-2 px-6 text-slate-200 rounded-md" to="/auth">Auth</Link>
            </footer>} 
        </>
    );
}
 
export default Main;