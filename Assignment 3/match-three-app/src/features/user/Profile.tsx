import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import store, { State } from '../../app/store'
import { changePasswordThunk } from '../../middleware/thunks'

export const Profile = () => {
    const user = useSelector((state: State) => state.userState.user)
    const [password, setPassword] = useState('')

    return (
        <div>
            <label> Username: {user.username}</label>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <label> Change Password: </label> <input type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)}/>
                <button className='Button'
                onClick={() => store.dispatch(changePasswordThunk(password)).then(() => setPassword(''))}>Change</button>
            </div>
            <label> Admin: {user.admin ? "Yes" : "No"}</label>
        </div>
    )
}
