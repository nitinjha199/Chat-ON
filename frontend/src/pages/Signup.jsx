import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverURL } from '../main.jsx';
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/user.slice.js';

const Signup = () => {
  let navigat = useNavigate();
  let [show, setShow] = useState(false);
  let [username, setUsername] = useState("")
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setLoading] = useState(false)
  let [err, setErr] = useState("");
  //redux 
  let dispatch=useDispatch()  // useDispatch() hook ki madad se reducers ko access karte hai aur slice ke andar state me change karte hai
  // let {userData}=useSelector(state=>state.user) //useSelector() hook ki help se state ko access karte hai aur data get karte hai
  // console.log(userData)   //humare store me bahot sara state hoga usme se ab kya karna hai mujhe user wala state chhahiye to state.user lkar deneg
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      let result = await axios.post(`${serverURL}/api/auth/signup`, {
        username, email, password
      }, { withCredentials: true })
      // console.log(result)
      dispatch(setUserData(result.data)) // ab is dispatch ki madad se hum data ko jo hai set krenge
      setUsername("")
      setEmail("")
      setPassword("")
      setLoading(false)
      setErr("")
    } catch (error) {
      console.log(error)
      setLoading(false)
      setErr(error?.response?.data?.message)
    }
  }
  useEffect(() => {
    if (err) {
      const timer = setTimeout(() => {
        setErr("");
      }, 4000);

      return () => clearTimeout(timer); // clean up if error changes
    }
  }, [err]);


  return (
    <div className='w-full h-[100vh] bg-slate-300 flex items-center justify-center'>
      <div className='w-full max-w-[500px] h-[600px] bg-white/50 rounded-lg  shadow-gray-400 shadow-lg flex flex-col gap-[10px] items-center'>
        <div className='w-full h-[200px] bg-blue-400 rounded-b-[30%] shadow-gray-400 shadow-lg flex items-center justify-center'>
          <h1 className='text-gray-600 font-bold text-2xl'>Welcome to <span className='text-white text-2.5xl'>Chat <span className='text-3xl font-mono'>ON</span></span></h1>

        </div>
        <form onSubmit={handleSignup} className='w-full flex flex-col gap-[20px] justify-center items-center'>
          <input type="text" placeholder='username' className='w-[90%] h-[50px] outline-none border-2 border-blue-400 px-[20px] py-[10px] bg-[white]/50 rounded-lg shadow-gray-400 shadow-lg' onChange={(e) => setUsername(e.target.value)} value={username} />
          <input type="email" placeholder='email' className='w-[90%] h-[50px] outline-none border-2 border-blue-400 px-[20px] py-[10px] bg-[white]/50 rounded-lg shadow-gray-400 shadow-lg' onChange={(e) => setEmail(e.target.value)} value={email} />
          <div className='w-[90%] h-[50px] border-2 border-blue-400 rounded-lg shadow-gray-400 shadow-lg overflow-hidden  relative'>
            <input type={`${show ? "text" : "password"}`} placeholder='password' className=' bg-[white]/50 h-full w-full outline-none  px-[20px] py-[10px] ' onChange={(e) => setPassword(e.target.value)} value={password} />
            <span onClick={() => { `${show ? setShow(false) : setShow(true)}` }} className='absolute top-[10px] right-[20px] text-[19px] text-blue-500 font-semibold cursor-pointer'>{`${show ? "hide" : "show"}`}</span>
          </div>
          {err && <p className='text-red-600'>*{err}</p>}
          <button type='submit' className='px-[20px] py-[10px] bg-blue-400 shadow-gray-400 shadow-lg rounded-2xl mt-5 text-[20px] font-serif hover:shadow-inner' disabled={loading || !username || !email}>{loading ? "loading..." : "Sign up"}</button>
        </form>
        <p className='mt-2'>Already have an Account ? <span className='text-blue-600 text-[bold] cursor-pointer ' onClick={() => navigat("/login")}>Login</span></p>
      </div>


    </div>
  )
}

export default Signup