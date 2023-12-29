import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import store, { State } from '../../app/store'
import { loginThunk, logoutThunk, signUpThunk } from '../../middleware/thunks';

export const Signin = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const status = useSelector((state : State) => state.userState.status)

    return (       
        <div className='App' style={{marginTop:200}}>
            <div className='Row'>
                <label> Username: </label>
                <input
                    type="text"
                    placeholder="Email"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>
            <div className='Row'>
                <label> Password: </label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <div className='Row'>
            <div>
                <button onClick={() => store.dispatch(signUpThunk({username, password}))} className='Button'>Sign Up</button>
            </div>
            <div>
                <button onClick={() => store.dispatch(loginThunk({username, password}))} className='Button'>Login</button>
            </div>
            <div>
                <button onClick={() => store.dispatch(logoutThunk())} className='Button'>Logout</button>
            </div>
        </div>
            <div>
            <label> Status: {status}</label>
        </div>
        </div>
    )
}
