export type Login = {
    userId: number
    token: string
}

export type User = {
    id?: number
    admin?: boolean
    username?: string
    password?: string
    token?: string
}