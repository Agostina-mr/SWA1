<script setup lang="ts">
import { onMounted, ref } from 'vue'
import router from '@/router'
import { store } from '../data/store'
import { patchUser } from '@/data/client'

const password = ref('')

onMounted(() => {
    if (store.loggedOut()) {
        router.push('/')
    }
})

function updatePassword() {
    patchUser(store.user?.id!, store.token, { password: password.value })
    password.value = ''
}
</script>

<template>
    <h1>Change Password</h1>
    <h5>Logged in as {{ store.user?.username }}</h5>
    <h5>Id: {{ store.user?.id }}</h5>
    <form @submit.prevent="updatePassword()">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" />
        <button type="submit">Update Password</button>
    </form>
</template>