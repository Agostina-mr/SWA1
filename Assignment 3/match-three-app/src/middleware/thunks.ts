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
       return {request: user, response: await client.login(user)}
})

export const logoutThunk = createAsyncThunk('logout', async (token: string) => 
{
       return await client.logout(token)
})

export const createGameThunk = createAsyncThunk('saveGame', async (token: string) => 
{
       return await client.createGame(token)
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