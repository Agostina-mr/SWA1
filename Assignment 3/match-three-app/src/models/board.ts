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

export function nextChar(): string {
    const min = 'A'.charCodeAt(0)
    const max = 'E'.charCodeAt(0) + 1
    let value = Math.random() * (max - min) + min
    return String.fromCharCode(value)
}

export function create(width: number, height: number): Board {
    let tiles = createTiles(width, height)
    return { width, height, tiles }
}
function createTiles(width: number, height: number): string[][] {
    return Array.from({ length: height }, () => createRow(width));
}

function createRow(width: number): string[] {
    return Array.from({ length: width }, () => nextChar());
}

export function positions(board: Board): Position[] {

    let positions = positionsRecursive(board, 0, 0, [])
    return positions
}

export function piece(board: Board, p: Position): string | undefined {
    if (p.row >= 0 && p.row < board.height && p.col >= 0 && p.col < board.width) {
        return board.tiles[p.row][p.col]
    }
    return undefined
}

export function canMove(board: Board, first: Position, second: Position): boolean {

    if (!belongsToSameRowOrColumn(first, second)) {
        console.log("not same row or column")
        return false
    }
    if (!isValidPosition(board, first) || !isValidPosition(board, second)) {
        console.log("not valid position")
        return false
    }
    return getMatches(swap(board, first, second)).length > 0
}

export function move(board: Board, first: Position, second: Position): MoveResult {

    board = { ...board }
    if (!canMove(board, first, second)) {
        console.log("can't move")
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
            console.log("no more matches")
            console.log('ONE',effects )
            return { board, effects }
        }
    }
}

function positionsRecursive(board: Board, row: number, col: number, positions: Position[]): Position[] {
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

function refill(board: Board, matches: Match[]): Board {
    let allPositions = matches.flatMap(match => match.positions)
    let tiles = board.tiles.map(row => row.slice())

    tiles.forEach((row, rowIndex) => {
        row.forEach((_, colIndex) => {
            if (allPositions.some(pos => pos.row === rowIndex && pos.col === colIndex)) {
                for (let x = rowIndex; x > 0; x--) {
                    tiles[x][colIndex] = tiles[x - 1][colIndex]
                }
                tiles[0][colIndex] = nextChar()
            }
        })
    })

    return { ...board, tiles }
}

function isValidPosition(board: Board, p: Position): boolean {
    return p.row >= 0 && p.col >= 0 && p.row < board.height && p.col < board.width;
}

function swap(board: Board, first: Position, second: Position): Board {
    let tiles = board.tiles.map(row => row.slice())

    let temp = tiles[first.row][first.col]
    tiles[first.row][first.col] = tiles[second.row][second.col]
    tiles[second.row][second.col] = temp

    return { ...board, tiles }
}

function getMatches(board: Board): Match[] {
    return board.tiles.flatMap((row, rowIndex) =>
        row.reduce((matches, tile, colIndex) => {
            const lastMatch = matches[matches.length - 1]

            if (lastMatch?.matched === tile) {
                console.log("match")
                lastMatch.positions.push({ row: rowIndex, col: colIndex })
            } else {
                matches.push({ matched: tile, positions: [{ row: rowIndex, col: colIndex }] })
            }

            return matches;
        }, [] as Match[])
    ).concat(
        board.tiles[0].flatMap((_, colIndex) =>
            board.tiles.reduce((matches, currentRow, rowIndex) => {
                const lastMatch = matches[matches.length - 1];

                if (lastMatch?.matched === currentRow[colIndex]) {
                    lastMatch.positions.push({ row: rowIndex, col: colIndex })
                } else {
                    matches.push({ matched: currentRow[colIndex], positions: [{ row: rowIndex, col: colIndex }] })
                }

                return matches;
            }, [] as Match[])
        )
    ).filter(match => match.positions.length > 2);
}
