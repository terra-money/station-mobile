import { atom } from 'recoil'
import { StoreKeyEnum } from './StoreKeyEnum'

const name = atom<string>({
  key: StoreKeyEnum.newWalletName,
  default: '',
})

const password = atom<string>({
  key: StoreKeyEnum.newWalletPassword,
  default: '',
})

const seed = atom<string[]>({
  key: StoreKeyEnum.newWalletSeed,
  default: [],
})

export default {
  name,
  password,
  seed,
}
