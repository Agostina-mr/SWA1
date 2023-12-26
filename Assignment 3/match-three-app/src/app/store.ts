import { configureStore } from '@reduxjs/toolkit'
import  userReducer,  { UserState } from '../features/user/userSlice'

export type State = {userState: UserState}

export default configureStore<State>({
  reducer: {
    userState: userReducer
  }
});
