import React from 'react'
import { useSelector } from 'react-redux'
import store, { State } from '../../app/store'
import { logoutThunk } from '../../middleware/thunks'
import { Signin } from './Signin'
import { Board } from '../game/Board'
import { UnfinishedGames } from '../game/UnfinishedGames'
import { HighScores } from '../game/HighScores'

export const LandingPage = () => {
    const username = useSelector((state : State) => state.userState.user?.username)
    const status = useSelector((state : State) => state.userState.status)   
    const user = useSelector((state : State) => state.userState.user)
    
    if (user?.token) {
        return <div>
            <div style={{display:'flex', justifyContent:'flex-end', marginBottom:40}}>
                <button onClick={() => store.dispatch(logoutThunk())} className='Button'>Logout</button>
            </div>
            <div>
                <label> Username: {username}</label>  
                <label> Admin: {user.admin ? "Yes" : "No"}</label>  
                <label> Status: {status}</label>
            </div>
            <div>
            <Board/>
            <UnfinishedGames/>
            <HighScores/>
            </div>
        </div>
    } else {
        return <Signin/>
    }
}

