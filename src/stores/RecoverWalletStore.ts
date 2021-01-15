import { atom } from 'recoil'

const name = atom<string>({
  key: 'name',
  default: '',
})

const password = atom<string>({
  key: 'password',
  default: '',
})

const seed = atom<string[]>({
  key: 'seed',
  default: [],
})

export default {
  name,
  password,
  seed,
}
