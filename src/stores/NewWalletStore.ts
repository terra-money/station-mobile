import { atom } from 'recoil'

const name = atom<string>({
  key: 'name',
  default: 'test1',
})

const password = atom<string>({
  key: 'password',
  default: '1234567890',
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
