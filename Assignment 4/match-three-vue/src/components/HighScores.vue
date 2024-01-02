<script setup lang="ts">
import { onMounted, ref } from 'vue'
import router from '@/router'
import { store } from '../data/store'
import { getGames } from '../data/client'
import type { Game } from '../models/game'

const highScores = ref<Game[]>([])
const personalBest = ref<Game[]>([])
onMounted(async () => {
    if (store.loggedOut()) {
        router.push('/')
    }

    const games = await getGames(store.token)
    highScores.value = games.filter((game) => game.completed && game.user !== store.user?.id).sort((a, b) => b.score - a.score).slice(0, 10)
    personalBest.value = games.filter((game) => game.completed && game.user === store.user?.id).sort((a, b) => b.score - a.score).slice(0, 3)
})

</script>

<template>
    <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div>
            <h1>High Scores</h1>
            <ol>
                <li v-for="game in highScores" :key="game.id">
                    <div> User: {{ game.user }} </div>
                    <div> Score: {{ game.score }} </div>
                    <div> Moves: {{ game.moves }} </div>
                </li>
            </ol>
        </div>
        <div>
            <h1>Personal Best</h1>
            <ol>
                <li v-for="game in personalBest" :key="game.id">
                    <div> User: {{ game.user }} </div>
                    <div> Score: {{ game.score }} </div>
                    <div> Moves: {{ game.moves }} </div>
                </li>
            </ol>
        </div>
    </div>
</template>