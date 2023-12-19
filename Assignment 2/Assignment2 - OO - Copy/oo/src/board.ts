export type Generator<T> = { next: () => T }

export type Position = {
    row: number,
    col: number
}

export type Match<T> = {
    matched: T,
    positions: Position[]
}

export type BoardEvent<T> = {
    kind: "Match" | "Refill";
    match?: Match<T>;
};

export type BoardListener<T> = (event: BoardEvent<T>) => any;


export class Board<T> {
    readonly width: number
    readonly height: number
    readonly generator: Generator<T>
    listener: BoardListener<T>
    tiles: T[][]

    // Constructor here
    constructor(generator: Generator<T>, width: number, height: number) {
        this.move = this.move.bind(this);
        this.width = width
        this.height = height
        this.generator = generator
        this.tiles = []

        for (let x = 0; x < height; x++) {
            this.tiles[x] = []
            for (let y = 0; y < width; y++) {
                this.tiles[x][y] = generator.next()
            }
        }
    }

    addListener(listener: BoardListener<T>) {
        this.listener = listener;
    }

    positions(): Position[] {
        //returns an array of all positions on the board
        let positions: Position[] = []
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                positions.push({ row: y, col: x })
            }
        }
        return positions
    }

    piece(p: Position): T | undefined {
        if (!this.isValidPosition(p)) {
            return undefined
        }

        return this.tiles[p.row][p.col]
    }

    canMove(first: Position, second: Position): boolean {
        if (!this.belongsToSameRowOrColumn(first, second)) {
            return false
        }

        if(!this.isValidPosition(first) || !this.isValidPosition(second)){
            return false
        }

        return this.willMatch(first, second)
    }

    isValidPosition(p: Position): boolean {
        return p.row >= 0 && p.col >= 0 && p.row < this.height && p.col < this.width;
    }

    belongsToSameRowOrColumn(first: Position, second: Position): boolean {
        return first.row === second.row || first.col === second.col
    }

    willMatch(first: Position, second: Position): boolean {
        let tilesCopy = []
        for (let x = 0; x < this.height; x++) {
            tilesCopy[x] = []
            for (let y = 0; y < this.width; y++) {
                tilesCopy[x][y] = this.tiles[x][y]
            }
        }

        let temp = tilesCopy[first.row][first.col]
        tilesCopy[first.row][first.col] = tilesCopy[second.row][second.col]
        tilesCopy[second.row][second.col] = temp

        let [horizontalFirst, verticalFirst] = this.match(tilesCopy, first)
        let [horizontalSecond, verticalSecond] = this.match(tilesCopy, second)

        return horizontalFirst.positions.length > 2
                || verticalFirst.positions.length > 2
                || horizontalSecond.positions.length > 2
                || verticalSecond.positions.length > 2
    }

    match(tiles : T[][], p: Position): Match<T>[] {
        const row = p.row
        const col = p.col

        let tile = tiles[row][col]
        let horizontalMatches = { matched: tile, positions: [{ row: row, col: col }] }
        let verticalMatches = { matched: tile, positions: [{ row: row, col: col }] }

        let left = col - 1
        let right = col + 1
        let up = row - 1
        let down = row + 1

        while (left >= 0 && tiles[row][left] === tile) {
            horizontalMatches.positions.push({ row: row, col: left })
            left--
        }

        while (right < this.width && tiles[row][right] === tile) {
            horizontalMatches.positions.push({ row: row, col: right })
            right++
        }

        while (up >= 0 && tiles[up][col] === tile) {
            verticalMatches.positions.push({ row: up, col: col })
            up--
        }
        while (down < this.height && tiles[down][col] === tile) {
            verticalMatches.positions.push({ row: down, col: col })
            down++
        }

        horizontalMatches.positions.sort((a, b) =>
            (a.row * this.width + a.col) - (b.row * this.width + b.col))

        verticalMatches.positions.sort((a, b) =>
            (a.row * this.width + a.col) - (b.row * this.width + b.col))

        return [horizontalMatches, verticalMatches]
    }

    cascadingMatches(): Match<T>[] {
        let allMatches: Match<T>[] = []

        for (let x = 0; x < this.height; x++) {

            let match = { matched: undefined, positions: [] }

            for (let y = 0; y < this.width; y++) {
                if (this.tiles[x][y] === match.matched) {
                    match.positions.push({ row: x, col: y })
                } else {
                    if (match.positions.length > 2) {
                        allMatches.push(match)
                    }
                    match = { matched: this.tiles[x][y], positions: [{ row: x, col: y }] }
                }
            }

            if (match.positions.length > 2) {
                allMatches.push(match)
            }
        }

        for (let y = 0; y < this.width; y++) {

            let match = { matched: undefined, positions: [] }

            for (let x = 0; x < this.height; x++) {
                if (this.tiles[x][y] === match.matched) {
                    match.positions.push({ row: x, col: y })
                } else {
                    if (match.positions.length > 2) {
                        allMatches.push(match)
                    }
                    match = { matched: this.tiles[x][y], positions: [{ row: x, col: y }] }
                }
            }

            if (match.positions.length > 2) {
                allMatches.push(match)
            }
        }

        return allMatches
    }

    move(first: Position, second: Position) {

        if (!this.canMove(first, second)) {
            return
        }

        let temp = this.tiles[first.row][first.col]
        this.tiles[first.row][first.col] = this.tiles[second.row][second.col]
        this.tiles[second.row][second.col] = temp

        let firstMatch = this.match(this.tiles, first)
        let secondMatch = this.match(this.tiles, second)

        let matches = firstMatch.concat(secondMatch)

        matches.forEach(match => {
            if (match.positions.length > 2) {
                if (this.listener) {
                    this.listener({ kind: "Match", match: match })
                }
                this.removeMatches(match)
            }
        });

        matches = []
        do {
            this.refill()

            matches = this.cascadingMatches()
            matches.forEach(match => {
                if (this.listener) {
                    this.listener({ kind: "Match", match: match })
                }
                this.removeMatches(match)
            });
        } while (matches.length > 0)
    }

    removeMatches(match: Match<T>) {
       match.positions.forEach(position => {
            this.tiles[position.row][position.col] = undefined
       });
    }

    refill() {
        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                if (this.tiles[x][y] === undefined) {
                    this.moveColumnDown(x, y)
                }
            }
        }
//remember to delete this
        let rows = []
        for (let x = 0; x < this.height; x++) {
            let row = []
            for (let y = 0; y < this.width; y++) {
                if (this.tiles[x][y] === undefined) {
                    //this.tiles[x][y] = this.generator.next()
                }
                row.push(this.tiles[x][y])
            }
            rows.push(row)
        }
        console.log(rows)

        if (this.listener) {
            this.listener({ kind: "Refill" })
        }
    }

    moveColumnDown(row: number, column: number) {
        for (let x = row; x > 0; x--) {
            this.tiles[x][column] = this.tiles[x-1][column]
        }

        this.tiles[0][column] = this.generator.next()
    }
}