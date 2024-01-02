<script setup lang="ts">
import { ref } from 'vue'
import { login, logout, getUser, signUp } from '../data/client'
import { store } from '../data/store'

const username = ref('')
const password = ref('')
const status = ref('')

async function loginUser() {
    try {
        const loginResponse = await login({ username: username.value, password: password.value })
        const userResponse = await getUser(loginResponse.userId, loginResponse.token)
        store.setUser(userResponse, loginResponse.token)
        status.value = "Logged in"
    } catch (error) {
        status.value = "Error logging in"
    }
}

async function logoutUser() {
    try {
        await logout(store.token)
        store.setUser(undefined, undefined)
        status.value = "Logged out"
    } catch (error) {
        status.value = "Error logging out"
    }
}

async function signUpUser() {
    try {
        const userResponse = await signUp({ username: username.value, password: password.value })
        store.setUser(userResponse, undefined)
        status.value = "Signed up"
    } catch (error) {
        status.value = "Error signing up"
    }
}
</script>

<template>
    <div>
        <h1>{{ status }}</h1>
        <div v-if="store.loggedOut()">
            <input type="text" v-model="username" />
            <input type="password" v-model="password" />
            <button @click="loginUser">Login</button>
            <button @click="signUpUser">Sign Up</button>
        </div>
        <div v-else>
            <button @click="logoutUser">Logout</button>
        </div>
    </div>
</template>
