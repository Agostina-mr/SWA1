import { GameState } from '../features/game/gameSlice'
import { User } from '../models/user'

const callServer = async <Return>(url: string, init: RequestInit = {}): Promise<Return> => {
    const response = await fetch(url, { ...init, headers: {...init.headers, 'Accept': 'application/json', 'Content-Type': 'application/json'}})
    if (response.ok) {
        return response.json()
    } else {
        return Promise.reject<Return>(response.statusText)
    }
}

const create = async <Body,Return>(url: string, body: Body): Promise<Return> => callServer<Return>(url, {method: 'POST', body: JSON.stringify(body)})
export const signUp = async (user : User): Promise<User> => create<User , User>('http://localhost:9090/users', user)
export const login = async (user : User): Promise<User> => create<User , User>('http://localhost:9090/login', user)
export const logout = async (token : string) => {await fetch('http://localhost:9090/logout?token=' + token, {method: 'POST'})}

export const createGame = async (token : string) => create<any, GameState>('http://localhost:9090/games?token=' + token, {})
export const patchGame = async (token : string, game : GameState) => callServer<GameState>(`http://localhost:9090/games/${game.id}?token=${token}`,
                                 {method: 'PATCH', body: JSON.stringify(game)})