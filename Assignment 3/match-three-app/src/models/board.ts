export type Generator<T> = { next: () => T }

export type Position = {
    row: number,
    col: number
}

export type Match<T> = {
    matched: T,
    positions: Position[]
}

export type Board<T> = {
    width: number,
    height: number,
    generator: Generator<T>,
    tiles: T[][]
}

export type Effect<T> = {
    kind: 'Match' | 'Refill',
    match?: Match<T>
}

export type MoveResult<T> = {
    board: Board<T>,
    effects: Effect<T>[]
}