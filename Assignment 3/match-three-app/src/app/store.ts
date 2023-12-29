import { configureStore } from '@reduxjs/toolkit'
import  userReducer,  { UserState } from '../features/slices/userSlice'
import gameReducer, { GameState } from '../features/slices/gameSlice'


export type State = { userState: UserState,
                      gameState: GameState 
            }

export default configureStore<State>({
  reducer: {
    userState: userReducer,
    gameState: gameReducer
  }
})
