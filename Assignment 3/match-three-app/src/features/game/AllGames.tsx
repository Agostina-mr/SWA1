import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import store, { State } from '../../app/store'
import { getGamesThunk } from '../../middleware/thunks'

export const AllGames = () => {
    const game = useSelector((state: State) => state.gameState.game)
    const previousGames = useSelector((state: State) => state.gameState.previousGames)

    if (!previousGames && !game) {
        store.dispatch(getGamesThunk())
    }

    return (
        game ? null : (
            <div>
                <h1> Previous Games </h1>
                {
                    previousGames?.map((game) => (
                        <div>
                            <p> Score: {game.score} </p>
                            <p> Moves: {game.moves} </p>
                            <p> Completed: {game.completed ? "Yes" : "No"} </p>
                        </div>
                    ))
                }
            </div>)
    )
}