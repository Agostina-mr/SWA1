import { createSlice } from '@reduxjs/toolkit'
import { Board, create, move } from '../../models/board'
import { createGameThunk } from '../../middleware/thunks'

export type GameState = {
    board: Board
    moves: number
    score: number
    wasValidMove: boolean
    completed: boolean
    id?: number
}

export const gameSlice = createSlice({
    name: 'game',
    initialState: { board: {}, moves: 0, score: 0 } as GameState,
    reducers: {
        moveTiles: (state, action) => {

            let { board, effects } = move( action.payload.board, action.payload.first, action.payload.second )

            return {...state, board, 
                wasValidMove: (effects.length > 0), 
                moves: state.moves + 1, 
                score: state.score + effects.length, 
                completed: (state.moves + 1) === 15
            }
        }
    },
    extraReducers : (builder) => {
        builder.addCase(createGameThunk.fulfilled, (state, action) => {
            let board = create(5, 5)            
            return {...state, id: action.payload.id, board}
        })
    }
})

export const { moveTiles } = gameSlice.actions
export default gameSlice.reducer
