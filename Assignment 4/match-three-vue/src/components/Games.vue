<script setup lang="ts">
import { onMounted, ref } from 'vue'
import router from '@/router'
import { store } from '../data/store'
import { getGames } from '../data/client'
import type { Game } from '../models/game'

const unfinished = ref<Game[]>([])

onMounted(async () => {
    if (store.loggedOut()) {
        router.push('/')
    }
    
    const games = await getGames(store.token)
    unfinished.value = games.filter((game) => !game.completed && game.user === store.user?.id)
})

function getGame(gameId: number | undefined) {
    router.push(`/game/${gameId}`)
}
</script>


<template>
    <div className='Centre'>
        <div>
            <h1> Unfinished Games </h1>
            <table v-if="unfinished.length > 0">
                <tr v-for="game in unfinished" v-bind:key="game.id" @click="getGame(game.id)">
                    <td> Score: {{game.score}} </td>
                    <td> Moves: {{game.moves}} </td>
                </tr>
            </table>
            <div v-else>
                <p> No unfinished games </p>
            </div>
        </div>
        <button @click="router.push('/game')" class="button">New Game</button>
    </div>
</template>