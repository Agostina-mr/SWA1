import * as client from '../client/client'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { User } from '../models/user'

export const signUpThunk = createAsyncThunk('signUp', async (user: User) => 
{
       return await client.signUp(user)
})

export const loginThunk = createAsyncThunk('login', async (user: User) => 
{
       return await client.login(user)
})

export const logoutThunk = createAsyncThunk('logout', async (token: string) => 
{
       return await client.logout(token)
})