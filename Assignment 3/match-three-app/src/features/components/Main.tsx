import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../app/store'
import { Signin } from './Signin'
import { Board } from './Board'
import { UnfinishedGames } from './UnfinishedGames'
import { HighScores } from './HighScores'
import '../../App.css'
import { PersonalBest } from './PersonalBest'
export const Main = () => {
    const user = useSelector((state: State) => state.userState.user)

    return (
        <div>
            {
                user?.token ? (
                    <div style={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'row'}}>
                        <div style={{ width: '30%' }}>
                        <HighScores />
                        </div>
                        <div  style={{width:'30%'}}>
                            <Board />
                            <UnfinishedGames />
                        </div>
                        <div style={{ width: '30%' }}>
                            <PersonalBest />
                        </div>
                    </div>) : <Signin />
            }
        </div>
    )
}

export default Main