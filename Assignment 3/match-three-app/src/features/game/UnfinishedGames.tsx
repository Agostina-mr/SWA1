import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import store, { State } from '../../app/store'
import { getGamesThunk, getGameThunk } from '../../middleware/thunks'

export const UnfinishedGames = () => {
    const userId = useSelector((state: State) => state.userState.user?.id)
    const game = useSelector((state: State) => state.gameState.game)
    const previousGames = useSelector((state: State) => state.gameState.previousGames)
    const unfinished = previousGames?.filter((game) => !game.completed && game.user === userId)

    useEffect(() => {
        if (!previousGames && !game) {
            store.dispatch(getGamesThunk())
        }
    })

    return (
        game ? null : (
            <div>
                <h1> Unfinished Games </h1>
                <div style={{ width: 1000, overflow: 'auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                        unfinished?.length > 0 ? unfinished.map((game) => (
                            <div key={game.id}
                                style={{
                                    width: 300, height: 150, backgroundColor: 'white',
                                    margin: 3, cursor: 'pointer', borderRadius: 5, padding: 10
                                }}
                                onClick={() => store.dispatch(getGameThunk(game.id))}>
                                <p> Score: {game.score} </p>
                                <p> Moves: {game.moves} </p>
                                <p> Completed: {game.completed ? "Yes" : "No"} </p>
                            </div>
                        )) : <p> No unfinished games </p>
                    }
                </div>
            </div>)
    )
}