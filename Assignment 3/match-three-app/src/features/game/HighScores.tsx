import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../app/store'

export const HighScores = () => {
    const userId = useSelector((state: State) => state.userState.user?.id)
    const game = useSelector((state: State) => state.gameState.game)
    const previousGames = useSelector((state: State) => state.gameState.previousGames)

    return (
        game ? null : (
            <div style={{overflow: 'auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                <div>
                    <h1> High Scores </h1>
                    <div style={{ width: 500, overflow: 'auto', display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
                        {
                            previousGames?.filter((game) => game.completed && game.user !== userId)
                                .sort((a, b) => b.score - a.score).slice(0, 10)
                                .map((game) => (
                                    <div key={game.id}
                                        style={{
                                            width: 300, height: 100, backgroundColor: 'white',
                                            margin: 3, borderRadius: 5, padding: 10
                                        }}>
                                        <p> User: {game.user} </p>
                                        <p> Score: {game.score} </p>
                                    </div>
                                ))
                        }
                    </div>
                </div>
                <div>
                    <h1> My Best Scores </h1>
                    <div style={{ width: 500, overflow: 'auto', display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
                        {
                            previousGames?.filter((game) => game.completed && game.user === userId)
                                .sort((a, b) => b.score - a.score).slice(0, 3)
                                .map((game) => (
                                    <div key={game.id}
                                        style={{
                                            width: 300, height: 100, backgroundColor: 'white',
                                            margin: 3, borderRadius: 5, padding: 10
                                        }}>
                                        <p> User: {game.user} </p>
                                        <p> Score: {game.score} </p>
                                    </div>
                                ))
                        }
                    </div>
                </div>
            </div>)
    )
}