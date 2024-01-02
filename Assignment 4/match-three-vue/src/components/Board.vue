<template>
    <div v-if="board">
        <h1>Moves: {{ moves }}</h1>
        <h1>Score: {{ score }}</h1>
        <h1 v-if="completed" class="label" style="background-color: green;">Completed</h1>
        <h1 v-else-if="invalidMove" class="label" style="background-color: red;">Invalid Move</h1>
    </div>
    <div style="display: 'flex', justify-content: 'center', flex-direction: 'column'" v-if="!completed">
        <table>
            <tbody>
                <tr v-for='(row, rowIndex) in board?.tiles' v-bind:key="rowIndex">
                    <td v-for='(tile, colIndex) in row' v-bind:key="colIndex" class="tile"
                        :style="{ backgroundColor: isTileClicked(rowIndex, colIndex) ? 'yellow' : '#d0f1f7' }"
                        @click="handleTileClick(rowIndex, colIndex)">{{ tile }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="centre" v-else>
        <button @click="startGame" class="button">New Game</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Board } from '../models/board'
import { create, move } from '../script/gameScript'

const board = ref<Board | undefined>()
const moves = ref(0)
const score = ref(0)
const invalidMove = ref(false)
const completed = ref(true)

function startGame() {
    board.value = create(5, 5)
    moves.value = 0
    score.value = 0
    invalidMove.value = false
    completed.value = false
}
const clickedTiles = ref<{ row: number, col: number }[]>([])

function handleTileClick(row: number, col: number) {
    const newClickedTiles = [...clickedTiles.value]

    if (isTileClicked(row, col)) {
        const index = newClickedTiles.findIndex((pos) => pos.row === row && pos.col === col)
        newClickedTiles.splice(index, 1)
    } else {
        newClickedTiles.push({ row, col })
        if (newClickedTiles.length === 2) {
            setTimeout(() => {
                const result = move(board.value!, newClickedTiles[0], newClickedTiles[1])
                board.value = result.board
                moves.value++
                score.value += result.effects.length
                invalidMove.value = result.effects.length === 0
                completed.value = moves.value >= 7
                newClickedTiles.splice(0, 2)
                //store.dispatch(patchGameThunk())
            }, 200)
        }
    }

    clickedTiles.value = newClickedTiles
}

function isTileClicked(row: number, col: number) {
    return clickedTiles.value.some((pos) => pos.row === row && pos.col === col)
}
</script>

<style scoped>
.button {
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: #f8e113;
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
.tile {
    margin: 10px;
    padding: 10px;
    height: 100px;
    width: 100px;
    border-radius: 5px;
    background-color: #d0f1f7;
    color: rgb(18, 6, 6);
    border: none;
    font-size: 50px;
    cursor: pointer;
    text-align: center;
    font-family: 'Courier New', Courier, monospace;
}
.label {
  width: 100%;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: #f8e113;
  color: white;
  border: none;
  font-size: 20px;
  text-align: center;
}
.centre{
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>