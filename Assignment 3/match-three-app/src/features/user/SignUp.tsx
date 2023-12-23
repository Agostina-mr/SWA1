import React, { useState } from 'react'
import store from '../../app/store'
import { signUpThunk } from '../../middleware/thunks';   


export const SignUp = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [statusLabel, setStatusLabel] = useState('')
    store.subscribe(() => {
        const state = store.getState()
        setStatusLabel(state.user.statusLabel)
    })

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
                <label>Status: {statusLabel}</label>
            </div>
        </div>
    )
}