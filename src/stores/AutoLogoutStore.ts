import { atom } from 'recoil'
import { StoreKeyEnum } from './StoreKeyEnum'

const isFromAutoLogout = atom<boolean>({
  key: StoreKeyEnum.isFromAutoLogout,
  default: false,
})

export default { isFromAutoLogout }
