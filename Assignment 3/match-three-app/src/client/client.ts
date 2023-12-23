import {User} from '../models/user'

const callServer = async <Return>(url: string, init: RequestInit = {}): Promise<Return> => {
    const response = await fetch(url, { ...init, headers: {...init.headers, 'Accept': 'application/json', 'Content-Type': 'application/json'}})
    if (response.ok) {
        return response.json()
    } else {
        return Promise.reject<Return>(response.statusText)
    }
}

const create = async <Body,Return>(url: string, body: Body): Promise<Return> => callServer<Return>(url, {method: 'POST', body: JSON.stringify(body)})
export const signUp = async (username: string, password: string): Promise<User> => create<User , User>('http://localhost:9090/users', {username, password})


