import * as client from '../client/client'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { User } from '../models/user'
import { State } from '../app/store'

export const signUpThunk = createAsyncThunk('signUp', async (user: User) => 
{
       return await client.signUp(user)
})

export const loginThunk = createAsyncThunk('login', async (user: User) => 
{
       let login = await client.login(user)
       return {...await client.getUser(login.userId, login.token), token: login.token}
})

export const logoutThunk = createAsyncThunk('logout', async (_, { getState }) =>
{
       const state = getState() as State
       return await client.logout(state.userState.user.token)
})

export const createGameThunk = createAsyncThunk('saveGame', async (_, { getState }) =>
{
       const state = getState() as State
       return await client.createGame(state.userState.user.token)
})

export const patchGameThunk = createAsyncThunk('patchGame', async (_, { getState }) => 
{
       const state = getState() as State
       await client.patchGame(state.userState.user.token, state.gameState.game)
})

export const getGamesThunk = createAsyncThunk('getGames',  async (_, { getState }) => 
{
       const state = getState() as State
       return await client.getGames(state.userState.user.token)
})

export const getGameThunk = createAsyncThunk('getGame',  async (id: number, { getState }) =>
{
       const state = getState() as State
       return await client.getGame(id, state.userState.user.token)
})