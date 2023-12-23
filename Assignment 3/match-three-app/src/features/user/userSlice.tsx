import { createSlice } from '@reduxjs/toolkit'
import { User } from '../../models/user'
import { signUpThunk } from '../../middleware/thunks'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {} as User,
        statusLabel: '' 
    },
    reducers: {
        logout: (state) => {
            state.user = {} as User
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signUpThunk.fulfilled, (state, action) => {
            state.user = action.payload
            state.statusLabel = 'Fulfilled'
        })
        builder.addCase(signUpThunk.rejected, (state) => {
            state.statusLabel = 'Rejected'
        })
        builder.addCase(signUpThunk.pending, (state) => {
            state.statusLabel = 'Pending'
        })
    }
})

export const { logout } = userSlice.actions
export default userSlice.reducer
