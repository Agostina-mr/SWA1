import * as client from '../client/client'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { User } from '../models/user'

export const signUpThunk = createAsyncThunk('signUp', async (user: User, thunkAPI) => 
{
       return await client.signUp(user.username, user.password)
})

   
