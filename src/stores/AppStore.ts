import { atom } from 'recoil'
import { StoreKeyEnum } from './StoreKeyEnum'

const showLoading = atom<boolean>({
  key: StoreKeyEnum.showLoading,
  default: false,
})

const loadingTxHash = atom<string>({
  key: StoreKeyEnum.loadingTxHash,
  default: '',
})

export default {
  showLoading,
  loadingTxHash,
}
