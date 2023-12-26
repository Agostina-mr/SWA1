import { createSlice } from '@reduxjs/toolkit'
import { Board, Generator } from '../../models/board'

export type GameState = {
    board: Board<string>
}

const values = 'AABCDABABCDEFCDEFEFABCDEFBAABCDEABCDEFFAABCDEFBCAABCDEFABCDEFBCAABCDEFBCABCDEFDEFDABCDEFEFABCABCDEFABCDEFDEFDEFABCDEFBABCDEFCABCDEFDEFCDEF'.split('')
export const gameSlice = createSlice({
    name: 'game',
    initialState: { board: create(generator(values), 10, 10) } as GameState,
    reducers: {
        initializeBoard: (state) => {
            let board = create(generator(values), 5, 5)
            return {...state, board}
        }


    }
})

export const { initializeBoard } = gameSlice.actions
export default gameSlice.reducer

// helpers

function generator<T>(values: T[]): Generator<T> {
    let index = 0
    return {
        next: () => {
            let value = values[index]
            index = (index + 1) % values.length
            return value
        }
    }
}
export function create<T>(generator: Generator<T>, width: number, height: number): Board<T> {
    let tiles = createTiles(generator, width, height)
    return { generator, width, height, tiles }
}
function createTiles<T>(generator: Generator<T>, width: number, height: number): T[][] {
    return Array.from({ length: height }, () => createRow(generator, width));
}

function createRow<T>(generator: Generator<T>, width: number): T[] {
    return Array.from({ length: width }, () => generator.next());
}