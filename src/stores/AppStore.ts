import { atom } from 'recoil'
import { StoreKeyEnum } from './StoreKeyEnum'

const afterOnBoarding = atom<boolean>({
  key: StoreKeyEnum.afterOnBoarding,
  default: false,
})

const showLoading = atom<boolean>({
  key: StoreKeyEnum.showLoading,
  default: false,
})

export default {
  showLoading,
  afterOnBoarding,
}
