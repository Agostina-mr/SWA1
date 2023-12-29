import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import store, { State } from '../../app/store'
import { changePasswordThunk } from '../../middleware/thunks'
import { Button } from '@mui/material'
import Layout from '../../Layout'

export const Profile = () => {
    const user = useSelector((state: State) => state.userState.user)
    const [password, setPassword] = useState('')

    return (
        <Layout>
            {
                user?.token &&
                <div>
                    <label> Username: {user.username}</label>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <label> Change Password: </label> <input type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} />
                        <Button className='Button'
                            onClick={() => store.dispatch(changePasswordThunk(password)).then(() => setPassword(''))}>Change</Button>
                    </div>
                    <label> Admin: {user.admin ? "Yes" : "No"}</label>
                </div>
            }
        </Layout>
    )
}
