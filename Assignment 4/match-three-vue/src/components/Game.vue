<template>
    <div v-if="game">
        <h1>Moves: {{ game.moves }}</h1>
        <h1>Score: {{ game.score }}</h1>
        <h1 v-if="game.completed" class="label" style="background-color: green;">Completed</h1>
        <h1 v-else-if="invalidMove" class="label" style="background-color: red;">Invalid Move</h1>
    </div>
    <div style="display: 'flex', justify-content: 'center', flex-direction: 'column'" v-if="!game?.completed">
        <table>
            <tbody>
                <tr v-for='(row, rowIndex) in game?.board.tiles' v-bind:key="rowIndex">
                    <td v-for='(tile, colIndex) in row' v-bind:key="colIndex" class="tile"
                        :style="{ backgroundColor: isTileClicked(rowIndex, colIndex) ? 'yellow' : '#d0f1f7' }"
                        @click="handleTileClick(rowIndex, colIndex)">{{ tile }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Game } from '../models/game'
import { create, move } from '../script/gameScript'
import { store } from '../data/store'
import router from '@/router';
import { createGame, getGame, patchGame } from '@/data/client';

const props = defineProps(['id'])

const game = ref<Game | undefined>()
const invalidMove = ref(false)

onMounted(() => {
    if (store.loggedOut()) {
        router.push('/')
    }

    if (props.id) {
        getGame(props.id, store.token).then((previousdGame) => {
            game.value = previousdGame
        })
    } else {
        startGame()
    }
})

async function startGame() {
    const newGame = await createGame(store.token)
    const board = create(5, 5)
    game.value = { ...newGame, board, moves: 0 }
    await updateGame()
}

async function updateGame() {
    try {
        await patchGame(store.token, game.value!)
    } catch (error) {
        // ignored
    }
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
            setTimeout(async () => {
                const result = move(game.value!.board, newClickedTiles[0], newClickedTiles[1])
                game.value!.board = result.board
                game.value!.moves++
                game.value!.score += result.effects.length
                game.value!.completed = game.value!.moves >= 7
                invalidMove.value = result.effects.length === 0
                newClickedTiles.splice(0, 2)
                await updateGame()
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