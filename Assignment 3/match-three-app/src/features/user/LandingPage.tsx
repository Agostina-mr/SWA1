import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import store, { State } from '../../app/store'
import { loginThunk, logoutThunk, signUpThunk } from '../../middleware/thunks';
import { Signin } from './Signin';

export const LandingPage = () => {
    const [username, setUsername] = useState('')
    const status = useSelector((state : State) => state.userState.status)   
    const token = useSelector((state : State) => state.userState.user?.token)
    const isAdmin = useSelector((state : State) => state.userState.user?.admin)
    
    if (token) {
        return <div>
            <div>
                <button onClick={() => store.dispatch(logoutThunk(token))}>Logout</button>
            </div>
            <div>
                <label> Username: {username}</label>  
                <label> Admin: {isAdmin ? "Yes" : "No"}</label>  
                <label> Status: {status}</label>
            </div>
        </div>
    } else {
        return <Signin/>
    }
}

