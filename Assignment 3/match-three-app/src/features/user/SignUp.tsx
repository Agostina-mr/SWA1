import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import store, { State } from '../../app/store'
import { loginThunk, logoutThunk, signUpThunk } from '../../middleware/thunks';

export const SignUp = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const status = useSelector((state : State) => state.userState.status)
    const token = useSelector((state : State) => state.userState.user?.token)


    return (       
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Email"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            
            <div>
                <button onClick={() => store.dispatch(signUpThunk({username, password}))}>Sign Up</button>
            </div>
            <div>
                <button onClick={() => store.dispatch(loginThunk({username, password}))}>Login</button>
            </div>
            <div>
                <button onClick={() => store.dispatch(logoutThunk(token))}>Logout</button>
            </div>
            <div>
            <label> Status: {status}</label>
        </div>
        </div>
    )
}

