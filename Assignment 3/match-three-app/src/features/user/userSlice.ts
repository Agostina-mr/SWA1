import { createSlice, current } from '@reduxjs/toolkit'
import { User } from '../../models/user'
import { loginThunk, logoutThunk, signUpThunk } from '../../middleware/thunks'

export type UserState = {
    user: User
    status: string
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {} as UserState,
    reducers: {
        logout: (state) => {
            return {...state, user: {} as User}
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signUpThunk.fulfilled, (state) => {
            return {...state, status: 'Fulfilled'}
        })
        builder.addCase(signUpThunk.rejected, (state) => {
            return {...state, status: 'Rejected'}
        })
        builder.addCase(signUpThunk.pending, (state) => {
            return {...state, status: 'Pending'}
        })
        builder.addCase(loginThunk.fulfilled, (state, action) => {
            return {...state, status: 'logged in', user: action.payload}
        })
        builder.addCase(logoutThunk.fulfilled, (state) => {
            return {...state, status: 'logged out', user: {} as User}
        })
    }
})

export const { logout } = userSlice.actions
export default userSlice.reducer
