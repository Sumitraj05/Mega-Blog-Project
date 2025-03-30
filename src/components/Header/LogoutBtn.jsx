import React from 'react'
import {useDispatch} from 'react-redux'
import authService from '../../appwrite/auth'
import {logout} from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }
  return (
    <button
    className='inline-bock px-6 py-2 text-white text-lg font-semibold uppercase rounded-full transition-all duration-300 ease-in-out hover:text-yellow-400 hover:scale-105 cursor-pointer'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn