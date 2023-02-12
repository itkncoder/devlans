import {Context} from "../../context/context"
import {useState, useEffect, useContext} from "react"
import axios from 'axios'
import {useForm} from "react-hook-form"
import {Link} from "react-router-dom"
import logo from "../../assets/logo.png"

const AppHeader = () => {
    const [users, setUsers] = useState([])
    const {authed, setAuthed} = useContext(Context)

    useEffect(() => {
        axios.get("https://kncoder.up.railway.app/users").then((res) => {
            setUsers(res.data)
        })
        setInterval(() => {
            axios.get("https://kncoder.up.railway.app/users").then((res) => {
                setUsers(res.data)
            })
        }, 5000)
        localStorage.getItem("auth") && setAuthed(true)
    }, []);

    return (  
        <header className="rounded-t-3xl px-4 h-28 flex justify-between items-center">
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center justify-center gap-2">
                    <img className="w-12" src={logo} alt="logo" />
                    <h1 className="text-2xl font-semibold text-gray-800">DEVLANS</h1>
                </div>
                <p className="ml-1 text-sm text-gray-600">{users.length} users</p>
            </div>
            <div className="flex tools justify-center items-center gap-3">
                <div className="w-12 h-12 hover:shadow bg-gray-100 cursor-pointer transition-all flex justify-center items-center bg-white shadow-lg rounded-full">
                    {authed && localStorage.getItem('auth') ? 
                        <i onClick={() => {
                            setAuthed(false)
                            localStorage.removeItem('auth')
                        }} className="text-gray-600 text-lg scale-120 fa-solid fa-right-from-bracket"></i> : 
                        <div onClick={() => localStorage.removeItem('auth')}>
                            <Link to="/auth">
                                <i className="text-gray-600 text-lg scale-120 fa-solid fa-user-plus"></i>
                            </Link>
                        </div>}
                </div>
            </div>
        </header>
    );
}


export default AppHeader;