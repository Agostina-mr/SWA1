import * as e from "express"

export type Generator<T>= { next:() => T } 

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
    kind: 'Match'|'Refill',
    match?: Match<T>
}

export type MoveResult<T> = {
    board: Board<T>,
    effects: Effect<T>[]
}    

export function create<T>(generator: Generator<T>, width: number, height: number): Board<T> {
    let tiles = populate(generator, width, height)
    return {generator, width, height, tiles}
}  

function populate<T>(generator: Generator<T>, width: number, height: number) : T[][] {
    let tiles = populateRecursive(generator, width, height, [])
    return tiles
}

function populateRecursive<T>(generator: Generator<T>, width: number, height: number, tiles: T[][], row: number = 0): T[][] {
    if (row < height) {
        if (!tiles[row]) {
            tiles[row] = [];
        }

        populateRow(generator, width, tiles[row], 0);

        populateRecursive(generator, width, height, tiles, row + 1);
    }

    return tiles;
}

function populateRow<T>(generator: Generator<T>, width: number, row: T[], col: number): any {
    if (col < width) {
        row.push(generator.next());
        populateRow(generator, width, row, col + 1);
    }
}

export function positions<T>(board: Board<T>): Position[] {

    let positions = positionsRecursive(board, 0, 0, [])
    
    return positions
}

function positionsRecursive<T>(board: Board<T>, row: number, col: number, positions: Position[]): Position[] {
    if (row < board.height) {
        if (col < board.width) {
            positions.push({ row, col });
            positionsRecursive(board, row, col + 1, positions);
        } else {
            positionsRecursive(board, row + 1, 0, positions);
        }
    }
    return positions;
}

export function piece<T>(board: Board<T>, p: Position): T | undefined {
    if (p.row >= 0 && p.row < board.height && p.col >= 0 && p.col < board.width) {
        return board.tiles[p.row][p.col]
    }
    return undefined
}    

export function canMove<T>(board: Board<T>, first: Position, second: Position): boolean {

    if (!belongsToSameRowOrColumn(first, second)) {
        return false
    }
    if (!isValidPosition(board, first) || !isValidPosition(board, second)) {    
        return false
    }
    return willMatch(board, first, second)
}

export function move<T>(generator: Generator<T>, board: Board<T>, first: Position, second: Position): MoveResult<T> {

    board = { ...board, generator: generator }
    if (!canMove(board, first, second)) {
        return  { board, effects:[] }
    }

    let temp = board.tiles[first.row][first.col]
    board.tiles[first.row][first.col] = board.tiles[second.row][second.col]
    board.tiles[second.row][second.col] = temp

    let matches = []
    let effects = []
    do {
        matches = getMatches(board)
        matches.forEach(match => {
            if (match.matched !== undefined){
                effects.push({ kind: 'Match', match })
                removeMatches(board, match)
            }  
        });

        if (matches.length > 0) {
            effects.push(refill(board).effects[0])
        }

    } while (matches.length > 0)
    return { board, effects }
}

function removeMatches<T>(board: Board<T>, match: Match<T>) {
    match.positions.forEach(position => {
         board.tiles[position.row][position.col] = undefined
    });
}

function belongsToSameRowOrColumn(first: Position, second: Position): boolean {
    return first.row === second.row || first.col === second.col
}

function refill<T>(board: Board<T>) : MoveResult<T> {
    
    for (let x = 0; x < board.height; x++) {
        for (let y = 0; y < board.width; y++) {
            if (board.tiles[x][y] === undefined) {
                moveColumnDown(board, x, y)
            }
        }
    }

    return { board, effects: [{ kind: 'Refill' }]}
}

function moveColumnDown<T>(board: Board<T>, row: number, column: number): Board<T> {
    for (let x = row; x > 0; x--) {
        board.tiles[x][column] = board.tiles[x-1][column]
    }

    board.tiles[0][column] = board.generator.next()

    return board
}

function isValidPosition<T>(board: Board<T>, p: Position): boolean {
    return p.row >= 0 && p.col >= 0 && p.row < board.height && p.col < board.width;
}

function willMatch<T>(board: Board<T>, first: Position, second: Position): boolean {
    let tilesCopy = []
    for (let x = 0; x < board.height; x++) {
        tilesCopy[x] = []
        for (let y = 0; y < board.width; y++) {
            tilesCopy[x][y] = board.tiles[x][y]
        }
    }

    let temp = tilesCopy[first.row][first.col]
    tilesCopy[first.row][first.col] = tilesCopy[second.row][second.col]
    tilesCopy[second.row][second.col] = temp
    
    let matches = getMatches({ width: board.width, height: board.height, generator: board.generator, tiles: tilesCopy })
    return matches.length > 0
}

function  getMatches<T>(board: Board<T>) : Match<T>[] {
    let allMatches: Match<T>[] = []

    for (let x = 0; x < board.height; x++) {

        let match = { matched: undefined, positions: [] }

        for (let y = 0; y < board.width; y++) {
            if (board.tiles[x][y] === match.matched) {
                match.positions.push({ row: x, col: y })
            } else {
                if (match.positions.length > 2) {
                    allMatches.push(match)
                }
                match = { matched: board.tiles[x][y], positions: [{ row: x, col: y }] }
            }
        }

        if (match.positions.length > 2) {
            allMatches.push(match)
        }
    } 

    for (let y = 0; y < board.width; y++) {

        let match = { matched: undefined, positions: [] }

        for (let x = 0; x < board.height; x++) {
            if (board.tiles[x][y] === match.matched) {
                match.positions.push({ row: x, col: y })
            } else {
                if (match.positions.length > 2) {
                    allMatches.push(match)
                }
                match = { matched: board.tiles[x][y], positions: [{ row: x, col: y }] }
            }
        }

        if (match.positions.length > 2) {
            allMatches.push(match)
        }
    }
    return allMatches
}
