import { Board } from './board'

export type Game = {
    id?: number
    user: number
    board: Board
    moves: number
    score: number
    completed: boolean
}