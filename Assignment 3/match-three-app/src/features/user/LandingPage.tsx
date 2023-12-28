import React from 'react'
import { useSelector } from 'react-redux'
import store, { State } from '../../app/store'
import { logoutThunk } from '../../middleware/thunks'
import { Signin } from './Signin'
import { BoardComponent } from '../game/Board'
import { AllGames } from '../game/AllGames'

export const LandingPage = () => {
    const username = useSelector((state : State) => state.userState.user?.username)
    const status = useSelector((state : State) => state.userState.status)   
    const token = useSelector((state : State) => state.userState.user?.token)
    const isAdmin = useSelector((state : State) => state.userState.user?.admin)
    
    if (token) {
        return <div>
            <div style={{display:'flex', justifyContent:'flex-end', marginBottom:40}}>
                <button onClick={() => store.dispatch(logoutThunk(token))} className='Button'>Logout</button>
            </div>
            <div>
                <label> Username: {username}</label>  
                <label> Admin: {isAdmin ? "Yes" : "No"}</label>  
                <label> Status: {status}</label>
            </div>
            <div>
            <BoardComponent/>
            <AllGames/>
            </div>
        </div>
    } else {
        return <Signin/>
    }
}

