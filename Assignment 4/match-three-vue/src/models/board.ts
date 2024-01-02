export type Position = {
    row: number,
    col: number
}

export type Match = {
    matched: string,
    positions: Position[]
}

export type Board = {
    width: number,
    height: number,
    tiles: string[][]
}

export type Effect = {
    kind: 'Match' | 'Refill',
    match?: Match
}

export type MoveResult = {
    board: Board,
    effects: Effect[]
}
