
import { Board, Generator, Position, MoveResult, Match } from './board'
//reducers
export function create<T>(generator: Generator<T>, width: number, height: number): Board<T> {
    let tiles = populate(generator, width, height)
    return { generator, width, height, tiles }
}
export function positions<T>(board: Board<T>): Position[] {

    let positions = positionsRecursive(board, 0, 0, [])
    return positions
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
    return getMatches(swap(board, first, second)).length > 0
}

export function move<T>(generator: Generator<T>, board: Board<T>, first: Position, second: Position): MoveResult<T> {

    board = { ...board, generator: generator }
    if (!canMove(board, first, second)) {
        return { board, effects: [] }
    }

    board = swap(board, first, second)

    let effects = []
    while (true) {
        let matches = getMatches(board)

        if (matches.length) {
            board = refill(board, matches)
            
            effects.push(...matches.map(match => { return { kind: 'Match', match } }))
            effects.push({ kind: 'Refill' })
        }
        else
        {
            return { board, effects }
        }
    }
}
//logic
function populate<T>(generator: Generator<T>, width: number, height: number): T[][] {
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


function belongsToSameRowOrColumn(first: Position, second: Position): boolean {
    return first.row === second.row || first.col === second.col
}

function refill<T>(board: Board<T>, matches: Match<T>[]): Board<T> {
    let allPositions = matches.flatMap(match => match.positions)
    let tiles = board.tiles.map(row => row.slice())

    tiles.forEach((row, rowIndex) => {
        row.forEach((_, colIndex) => {
            if (allPositions.some(pos => pos.row === rowIndex && pos.col === colIndex)) {
                for (let x = rowIndex; x > 0; x--) {
                    tiles[x][colIndex] = tiles[x - 1][colIndex]
                }
                tiles[0][colIndex] = board.generator.next()             
            }
        })
    })

    return { ...board, tiles }
}

function isValidPosition<T>(board: Board<T>, p: Position): boolean {
    return p.row >= 0 && p.col >= 0 && p.row < board.height && p.col < board.width;
}

function swap<T>(board: Board<T>, first: Position, second: Position): Board<T> {
    let tiles = board.tiles.map(row => row.slice())

    let temp = tiles[first.row][first.col]
    tiles[first.row][first.col] = tiles[second.row][second.col]
    tiles[second.row][second.col] = temp

    return { ...board, tiles }
}

function getMatches<T>(board: Board<T>): Match<T>[] {
    return board.tiles.flatMap((row, rowIndex) =>
        row.reduce((matches, tile, colIndex) => {
            const lastMatch = matches[matches.length - 1];

            if (lastMatch?.matched === tile) {
                lastMatch.positions.push({ row: rowIndex, col: colIndex });
            } else {
                matches.push({ matched: tile, positions: [{ row: rowIndex, col: colIndex }] });
            }

            return matches;
        }, [] as Match<T>[])
    ).concat(
        board.tiles[0].flatMap((_, colIndex) =>
            board.tiles.reduce((matches, currentRow, rowIndex) => {
                const lastMatch = matches[matches.length - 1];

                if (lastMatch?.matched === currentRow[colIndex]) {
                    lastMatch.positions.push({ row: rowIndex, col: colIndex });
                } else {
                    matches.push({ matched: currentRow[colIndex], positions: [{ row: rowIndex, col: colIndex }] });
                }

                return matches;
            }, [] as Match<T>[])
        )
    ).filter(match => match.positions.length > 2);
}
