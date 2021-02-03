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

const qrData = atom<
  | {
      address: string
      name: string
      privateKey: string
    }
  | undefined
>({
  key: StoreKeyEnum.recoverQRData,
  default: undefined,
})
export default {
  name,
  password,
  seed,
  qrData,
}
