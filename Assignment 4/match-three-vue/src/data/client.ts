import type { User, Login } from '../models/user'
import type { Game } from '../models/game'

const callServer = async <Return>(url: string, init: RequestInit = {}): Promise<Return> => {
    const response = await fetch(url, { ...init, headers: { ...init.headers, 'Accept': 'application/json', 'Content-Type': 'application/json' } })
    if (response.ok) {
        return response.json()
    } else {
        return Promise.reject<Return>(response.statusText)
    }
}

const create = async <Body, Return>(url: string, body: Body): Promise<Return> => callServer<Return>(url, { method: 'POST', body: JSON.stringify(body) })
export const signUp = async (user: User): Promise<User> => create<User, User>('http://localhost:9090/users', user)
export const login = async (user: User): Promise<Login> => create<User, Login>('http://localhost:9090/login', user)
export const getUser = async (id: number, token: string) => callServer<User>(`http://localhost:9090/users/${id}?token=${token}`)
export const logout = async (token: string) => { await fetch('http://localhost:9090/logout?token=' + token, { method: 'POST' }) }
export const patchUser = async (id: number, token: string, user: User) => callServer<User>(`http://localhost:9090/users/${id}?token=${token}`, { method: 'PATCH', body: JSON.stringify(user) })

export const createGame = async (token: string) => create<any, Game>('http://localhost:9090/games?token=' + token, {})
export const patchGame = async (token: string, game: Game) => callServer<Game>(`http://localhost:9090/games/${game.id}?token=${token}`,
    { method: 'PATCH', body: JSON.stringify(game) })
export const getGames = async (token: string) => callServer<Game[]>(`http://localhost:9090/games?token=${token}`)
export const getGame = async (id: number, token: string) => callServer<Game>(`http://localhost:9090/games/${id}?token=${token}`)