import { createSlice, current } from '@reduxjs/toolkit'
import { Board, create, move } from '../../models/board'

export type GameState = {
    board: Board
}

export const gameSlice = createSlice({
    name: 'game',
    initialState: { board: {} } as GameState,
    reducers: {
        initializeBoard: (state) => {
            let board = create(5, 5)
            return {...state, board}
        },
        moveTiles: (state, action) => {
            console.log(action.payload)
            let result = move( action.payload.board, action.payload.first, action.payload.second )
            let board = result.board
            let newState = {...state, board}    
            console.log(newState)
            return {...state, board }
        }
    }
})

export const { initializeBoard, moveTiles } = gameSlice.actions
export default gameSlice.reducer
