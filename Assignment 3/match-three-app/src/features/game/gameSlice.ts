import { createSlice } from '@reduxjs/toolkit'
import { Game } from '../../models/game'
import { create, move } from '../../models/board'
import { createGameThunk, getGameThunk, getGamesThunk, logoutThunk } from '../../middleware/thunks'

export type GameState = {
    game: Game
    invalidMove: boolean
    previousGames: Game[]
}

export const gameSlice = createSlice({
    name: 'game',
    initialState: {} as GameState,
    reducers: {
        moveTiles: (state, action) => {
            let { board, effects } = move(action.payload.board, action.payload.first, action.payload.second)

            return {
                ...state,
                game: {
                    ...state.game,
                    board,
                    moves: state.game.moves + 1,
                    score: state.game.score + effects.length,
                    completed: (state.game.moves + 1) >= 7
                }, invalidMove: (effects.length === 0)
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createGameThunk.fulfilled, (state, action) => {
                let board = create(5, 5)
                return { ...state, game: { ...action.payload, board, moves: 0 } }
            })
            .addCase(getGamesThunk.fulfilled, (state, action) => {
                return { ...state, previousGames: action.payload }
            })
            .addCase(logoutThunk.fulfilled, () => {
                return {} as GameState
            })
            .addCase(getGameThunk.fulfilled, (state, action) => {
                return { ...state, game: action.payload }
            })
    }
})

export const { moveTiles } = gameSlice.actions
export default gameSlice.reducer
