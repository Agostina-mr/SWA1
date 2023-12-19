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
        
        let matches = this.getMatches(tilesCopy)
        return matches.length > 0
    }

    getMatches(tiles : T[][]): Match<T>[] {
        let allMatches: Match<T>[] = []

        for (let x = 0; x < this.height; x++) {

            let match = { matched: undefined, positions: [] }

            for (let y = 0; y < this.width; y++) {
                if (tiles[x][y] === match.matched) {
                    match.positions.push({ row: x, col: y })
                } else {
                    if (match.positions.length > 2) {
                        allMatches.push(match)
                    }
                    match = { matched: tiles[x][y], positions: [{ row: x, col: y }] }
                }
            }

            if (match.positions.length > 2) {
                allMatches.push(match)
            }
        }

        for (let y = 0; y < this.width; y++) {

            let match = { matched: undefined, positions: [] }

            for (let x = 0; x < this.height; x++) {
                if (tiles[x][y] === match.matched) {
                    match.positions.push({ row: x, col: y })
                } else {
                    if (match.positions.length > 2) {
                        allMatches.push(match)
                    }
                    match = { matched: tiles[x][y], positions: [{ row: x, col: y }] }
                }
            }

            if (match.positions.length > 2) {
                allMatches.push(match)
            }
        }
        console.log(allMatches)
        return allMatches
    }

    move(first: Position, second: Position) {

        if (!this.canMove(first, second)) {
            return
        }

        let temp = this.tiles[first.row][first.col]
        this.tiles[first.row][first.col] = this.tiles[second.row][second.col]
        this.tiles[second.row][second.col] = temp

        let matches = []
        do {
            matches = this.getMatches(this.tiles)
            matches.forEach(match => {
                if (this.listener) {
                    this.listener({ kind: "Match", match: match })
                }
                this.removeMatches(match)
            });

            if (matches.length > 0) {
                this.refill()
            }
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