import { atom } from 'recoil'
import { StoreKeyEnum } from './StoreKeyEnum'

const showLoading = atom<boolean>({
  key: StoreKeyEnum.showLoading,
  default: false,
})

export default { showLoading }
