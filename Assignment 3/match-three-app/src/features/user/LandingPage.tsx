import React from 'react'
import { useSelector } from 'react-redux'
import store, { State } from '../../app/store'
import { logoutThunk } from '../../middleware/thunks'
import { Signin } from './Signin'
import { Board } from '../game/Board'
import { UnfinishedGames } from '../game/UnfinishedGames'
import { HighScores } from '../game/HighScores'
import { Profile } from './Profile'

export const LandingPage = () => { 
    const user = useSelector((state : State) => state.userState.user)
    
    if (user?.token) {
        return <div>
            <div style={{display:'flex', justifyContent:'flex-end', marginBottom:40}}>
                <button onClick={() => store.dispatch(logoutThunk())} className='Button'>Logout</button>
            </div>
            <Profile/>
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
