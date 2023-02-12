import {useForm} from "react-hook-form"
import axios from 'axios'
import { useState, useEffect, useContext  } from 'react'
import {Link, useNavigate} from "react-router-dom"
import {Context} from "../context/context"

const Auth = () => {
    const navigate = useNavigate()

    const [value, setValue] = useState('')
    const {register, handleSubmit} = useForm()
    const {authed, setAuthed} = useContext(Context)
    const [error, setError] = useState(false)

    const onSubmit = async (data) => {
        if(value) {

            const unique = new Date().valueOf()

            const obj = {
                name: data.name,
                who: unique,
                bgcolor: data.bgcolor,
            }
            localStorage.setItem("auth", JSON.stringify([value, unique, data.bgcolor]))
            await axios.post("https://kncoder.up.railway.app/users", obj, setValue('')).then(() => {
                setAuthed(true)
                navigate("/")
            })
        } else {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 3000);
        }
    };

    return (  
        <div>
            {error ? <div className=" flex justify-center items-center">
                <p className="text-2xl mt-6 absolute">Write a name or another name</p>
            </div> : ''}
            <div className="flex items-center justify-start gap-1">
                <Link to="/">
                    <i className="text-2xl cursor-pointer p-3 text-slate-700 fa-solid fa-arrow-left"></i>
                </Link>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-10/12 m-auto flex flex-col gap-3 items-start">
                <h1 className="text-4xl font-semibold my-2">SING IN</h1>
                <div className="w-full h-0.5 rounded-md bg-gray-400"></div>
                <div className="flex flex-col items-start gap-3 w-full">
                    <div>
                        <h1 className="text-gray-700 text-lg">Enter name</h1>
                        <input value={value} 
                            onInput={e => setValue(e.target.value)}
                            {...register('name')} 
                            className="bg-gray-100 px-6 py-3 w-full w-72 text-sm rounded-lg border" 
                            type="text" 
                            placeholder="Enter name..." />
                    </div>

                    <div>
                        <h1 className="text-gray-700 w-full flex justify-between items-end text-lg">Enter URL <span className="text-xs text-rose-700">NO REQUIRED</span></h1>
                        <input type="text" 
                            {...register('bgcolor')}
                            placeholder="Enter URL for your profile picture"
                            className="bg-gray-100 px-6 py-3 w-72 text-sm rounded-lg border"  />
                    </div>
                </div>
                <input className="hover:-translate-y-0.5 transition-all bg-gradient-to-r from-cyan-500 to-blue-500 py-2 px-10 mt-4 text-slate-200 rounded-md cursor-pointer" type="submit" value="Join" />
            </form>
        </div>
    );
}
 
export default Auth;