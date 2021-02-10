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

const qrData = atom<RecoverWalletQrCodeDataType | undefined>({
  key: StoreKeyEnum.recoverQRData,
  default: undefined,
})
export default {
  name,
  password,
  seed,
  qrData,
}
