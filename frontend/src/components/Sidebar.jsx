import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/dp.webp"
import { FaSearch } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RxCrossCircled } from "react-icons/rx";
import { RiLogoutCircleLine } from "react-icons/ri";
import axios from 'axios';
import { serverURL } from '../main';
import { setOtherUsers, setSelectedUser, setUserData, clearUnread } from '../redux/user.slice';
import { setMessages } from '../redux/messages.slice';

const Sidebar = () => {
    let { userData, otherUsers, selectedUser, onlineUsers, unreadMessages } = useSelector(state => state.user);
    let [search, setSearch] = useState(false);
    let [input, setInput] = useState("");
    let [searchResults, setSearchResults] = useState([]);

    let navigate = useNavigate();
    let dispatch = useDispatch();

    const handlelogout = async () => {
        try {
            await axios.get(`${serverURL}/api/auth/logout`, { withCredentials: true });
            dispatch(setUserData(null));
            dispatch(setOtherUsers(null));
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    }

    const handlesearch = async () => {
        try {
            let result = await axios.get(`${serverURL}/api/user/search?query=${input}`, { withCredentials: true });
            setSearchResults(result.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (input) handlesearch();
    }, [input]);

    return (
        <div className={`lg:w-[30%] w-full h-full bg-slate-300 lg:block ${!selectedUser ? "block" : "hidden"} overflow-hidden`}>
            <div onClick={handlelogout} className='w-[45px] h-[45px] overflow-hidden rounded-full bg-[#20c7ff] flex justify-center mt-3 items-center shadow-gray-500 shadow-lg cursor-pointer fixed bottom-[10px] left-[10px] z-50 hover:scale-105 transition-transform'>
                <RiLogoutCircleLine className='h-[25px] w-[25px]' />
            </div>

            <div className='w-full h-[300px] bg-blue-400 rounded-b-[30%] shadow-gray-400 shadow-lg flex flex-col justify-center px-[20px]'>
                <div>
                    <h1 className='text-white font-bold text-[30px]'>Chat <span className='text-[40px] font-mono'>ON</span></h1>
                </div>
                <div className='w-full flex justify-between items-center'>
                    <h1 className='font-semibold text-[25px] text-gray-800'>Hii , <span className='font-serif'>{userData.name || "user"}</span></h1>
                    <div onClick={() => navigate("/profile")} className='w-[60px] h-[60px] overflow-hidden rounded-full bg-white flex justify-center items-center shadow-gray-500 shadow-lg cursor-pointer hover:scale-105 transition-transform'>
                        <img src={userData.image || dp} alt="" className='h-[100%]' />
                    </div>
                </div>
                <div className='w-full flex items-center gap-[20px]'>
                    {!search && <div onClick={() => setSearch(true)} className='w-[45px] h-[45px] overflow-hidden rounded-full bg-white flex justify-center mt-3 items-center shadow-gray-500 shadow-lg cursor-pointer hover:scale-105 transition-transform'>
                        <FaSearch className='h-[25px] w-[25px]' />
                    </div>}
                    {search && (
                        <form className='w-full h-[45px] bg-white rounded-full overflow-hidden shadow-gray-400 shadow-lg flex items-center mt-3 gap-[10px] px-[15px] justify-between'>
                            <FaSearch className='h-[25px] w-[25px]' />
                            <input
                                type="text"
                                placeholder='search users...'
                                className='w-full h-full border-0 outline-none'
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    if (e.target.value.trim() === "") {
                                        setSearchResults([]);
                                    }
                                }}
                            />
                            <RxCrossCircled className='cursor-pointer text-xl h-[25px] w-[25px]' onClick={() => {
                                setSearch(false);
                                setInput("");
                                setSearchResults([]);
                            }} />
                        </form>
                    )}

                    <div className='flex flex-wrap gap-[10px] mt-3'>
                        {!search && otherUsers
                            ?.filter((user) => onlineUsers?.includes(user._id))
                            .slice(0, 4)
                            .map((user) => (
                                <div className='relative rounded-full shadow-gray-500 shadow-lg mt-3 cursor-pointer hover:scale-105 transition-transform' onClick={() => {
                                    dispatch(setMessages([]));
                                    dispatch(setSelectedUser(user));
                                    dispatch(clearUnread(user._id));
                                }}>
                                    <div key={user._id} className='w-[50px] h-[50px] overflow-hidden rounded-full bg-white flex justify-center items-center flex-shrink-0'>
                                        <img src={user.image || dp} alt="" className='h-[100%] w-[100%]' />
                                    </div>
                                    <span className='w-[13px] h-[13px] rounded-full bg-[#3aff20] absolute bottom-[6px] right-[-1px]'></span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {search && (
                <div className="w-full px-4 mt-3 flex flex-col gap-3">
                    {searchResults.length > 0 ? (
                        searchResults.map((user) => (
                            <div
                                key={user._id}
                                className="w-full h-[70px] bg-[#e5e4e4] rounded-2xl shadow-lg p-3 flex items-center gap-4 cursor-pointer hover:bg-blue-100 transition-all"
                                onClick={() => {
                                    dispatch(setSelectedUser(user));
                                    dispatch(setMessages([]));
                                    dispatch(clearUnread(user._id));
                                    setSearch(false);
                                    setInput("");
                                    setSearchResults([]);
                                }}
                            >
                                <img
                                    src={user.image || dp}
                                    alt=""
                                    className="w-[50px] h-[50px] rounded-full object-cover"
                                />
                                <div className="flex flex-col">
                                    <h1 className="font-semibold text-[18px] text-gray-800">
                                        {user.name || user.username}
                                    </h1>
                                    {/* <p className="text-sm text-gray-500">Tap to start chat</p> */}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-sm">No users found.</p>
                    )}
                </div>
            )}

            {!search && (
                <div className='w-full h-[55%] overflow-auto flex flex-col gap-[20px] mt-[20px] items-center'>
                    {otherUsers?.map((user) => (
                        <div
                            key={user._id}
                            className={`w-[95%] h-[50px] flex justify-start items-center gap-[12px] ${selectedUser?._id === user._id ? 'bg-blue-300' : 'bg-zinc-200'} shadow-gray-400 shadow-lg rounded-full hover:bg-blue-400 cursor-pointer hover:scale-105 transition-transform`}
                            onClick={() => {
                                dispatch(setMessages([]));
                                dispatch(setSelectedUser(user));
                                dispatch(clearUnread(user._id));
                            }}
                        >
                            <div className='relative w-[50px] h-[50px]'>
                                <div className='w-full h-full overflow-hidden rounded-full bg-white flex justify-center items-center shadow-gray-500 shadow-lg'>
                                    <img src={user.image || dp} alt="" className='h-[100%] w-[100%]' />
                                </div>
                                {onlineUsers?.includes(user._id) && (
                                    <span className='w-[13px] h-[13px] rounded-full bg-[#3aff20] absolute bottom-[4px] right-[2px] border-[2px] border-white'></span>
                                )}
                                
                            </div>
                            <h1 className='font-semibold text-[18px] text-gray-800'>{user.name || user.username}</h1>
                            {unreadMessages?.[user._id] > 0 && (
                                    <span className='ml-auto mr-4 bg-red-500 text-white text-xs px-2 py-[1px] rounded-full'>
                                        {unreadMessages[user._id]}
                                    </span>
                                )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Sidebar;
