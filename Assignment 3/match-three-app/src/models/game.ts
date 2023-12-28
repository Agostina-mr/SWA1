import { Board } from './board'

export type Game = {
    board: Board
    moves: number
    score: number
    completed: boolean
    id?: number
}