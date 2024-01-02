import { reactive } from "vue"
import type { User } from "@/models/user"
import type { Game } from "@/models/game"

export const store = reactive({
  user: {} as User,
  token: '',
  game: {} as Game,

  setUser(user: User | undefined, token: string | undefined) {
    store.user = user ?? {}
    store.token = token ?? ''
  },
  loggedOut() : boolean {
    return store.token === ''
  }
})
