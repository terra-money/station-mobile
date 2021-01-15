import { atom } from 'recoil'
import { StoreKeyEnum } from './StoreKeyEnum'

const name = atom<string>({
  key: StoreKeyEnum.recoverWalletName,
  default: '',
})

const password = atom<string>({
  key: StoreKeyEnum.recoverWalletPassword,
  default: '',
})

const seed = atom<string[]>({
  key: StoreKeyEnum.recoverWalletSeed,
  default: [],
})

export default {
  name,
  password,
  seed,
}
