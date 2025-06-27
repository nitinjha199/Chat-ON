import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { serverURL } from '../main';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser, setUserData } from '../redux/user.slice';


const Login = () => {
  let navigat = useNavigate();
  let [show, setShow] = useState(false);
  let [email, setEmail] = useState("")
  let [loading, setLoading] = useState(false)
  let [password, setPassword] = useState("")
  let [err, setErr] = useState("");
  let dispatch=useDispatch()
  // let {userData}=useSelector(state=>state.user)
  // console.log("userData :" ,userData )
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      let result = await axios.post(`${serverURL}/api/auth/login`, {
        email, password
      }, { withCredentials: true })
      // console.log(result)
      dispatch(setUserData(result.data))
      dispatch(setSelectedUser(null))
      setEmail("")
      setPassword("")
      setLoading(false)
      setErr("")
      navigat("/")
    } catch (error) {
      console.log(error)
      setLoading(false)
      setErr(error.response.data.message)
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
        <form onSubmit={handleLogin} className='w-full flex flex-col gap-[20px] justify-center items-center mt-6'>
          {/* <input type="text" placeholder='username' className='w-[90%] h-[50px] outline-none border-2 border-blue-400 px-[20px] py-[10px] bg-[white]/50 rounded-lg shadow-gray-400 shadow-lg'/> */}
          <input type="email" placeholder='email' className='w-[90%] h-[50px] outline-none border-2 border-blue-400 px-[20px] py-[10px] bg-[white]/50 rounded-lg shadow-gray-400 shadow-lg' onChange={(e) => setEmail(e.target.value)} value={email} />
          <div className='w-[90%] h-[50px] border-2 border-blue-400 rounded-lg shadow-gray-400 shadow-lg overflow-hidden  relative'>
            <input type={`${show ? "text" : "password"}`} placeholder='password' className=' bg-[white]/50 h-full w-full outline-none  px-[20px] py-[10px] ' onChange={(e) => setPassword(e.target.value)} value={password} />
            <span onClick={() => { `${show ? setShow(false) : setShow(true)}` }} className='absolute top-[10px] right-[20px] text-[19px] text-blue-500 font-semibold cursor-pointer'>{`${show ? "hide" : "show"}`}</span>
          </div>
          {err && <p className='text-red-600'>*{err}</p>}

          <button className='px-[20px] py-[10px] bg-blue-400 shadow-gray-400 shadow-lg rounded-2xl mt-5 text-[20px] font-serif hover:shadow-inner' disabled={loading || !email}>{loading ? "loading..." : "Login"}</button>
        </form>
        <p className='mt-2'>Create an Account ? <span className='text-blue-600 text-[bold] cursor-pointer ' onClick={() => navigat("/signup")}>Sign up</span></p>
      </div>


    </div>
  )
}

export default Login 