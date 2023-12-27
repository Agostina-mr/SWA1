import { createSlice } from '@reduxjs/toolkit'
import { Board, create, move } from '../../models/board'

export type GameState = {
    board: Board
    moves: number
    score: number
    wasValidMove: boolean
}

export const gameSlice = createSlice({
    name: 'game',
    initialState: { board: {}, moves: 0, score: 0 } as GameState,
    reducers: {
        initializeBoard: (state) => {
            let board = create(5, 5)
            return {...state, board}
        },
        moveTiles: (state, action) => {

            let { board, effects } = move( action.payload.board, action.payload.first, action.payload.second )
            console.log("effects", {...state, board, 
                wasValidMove: (effects.length > 0), 
                moves: state.moves + 1, 
                score: state.score + effects.length 
            })

            return {...state, board, 
                wasValidMove: (effects.length > 0), 
                moves: state.moves + 1, 
                score: state.score + effects.length 
            }
        }
    }
})

export const { initializeBoard, moveTiles } = gameSlice.actions
export default gameSlice.reducer
