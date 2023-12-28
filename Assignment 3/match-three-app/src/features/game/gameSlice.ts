import { createSlice } from '@reduxjs/toolkit'
import { Game } from '../../models/game'
import { create, move } from '../../models/board'
import { createGameThunk, getGamesThunk } from '../../middleware/thunks'

export type GameState = {
    game: Game
    wasValidMove: boolean
    previousGames: Game[]
}

export const gameSlice = createSlice({
    name: 'game',
    initialState: {} as GameState,
    reducers: {
        moveTiles: (state, action) => {
            let { board, effects } = move(action.payload.board, action.payload.first, action.payload.second)

            return {...state,
                game: {
                    ...state.game,
                    board,
                    moves: state.game.moves + 1,
                    score: state.game.score + effects.length,
                    completed: (state.game.moves + 1) === 15
                }, wasValidMove: (effects.length > 0)
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createGameThunk.fulfilled, (state, action) => {
            let board = create(5, 5)
            return { ...state, game: { ...action.payload, board, moves: 0 } }
        })
        builder.addCase(getGamesThunk.fulfilled, (state, action) => {
            return {...state, previousGames: action.payload }
        })
    }
})

export const { moveTiles } = gameSlice.actions
export default gameSlice.reducer
