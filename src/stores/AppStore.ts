import { atom } from 'recoil'
import { createRef, RefObject } from 'react'
import { StoreKeyEnum } from './StoreKeyEnum'

const showLoading = atom<boolean>({
  key: StoreKeyEnum.showLoading,
  default: false,
})

const loadingTxHash = atom<string>({
  key: StoreKeyEnum.loadingTxHash,
  default: '',
})

const loadingTitle = atom<string>({
  key: StoreKeyEnum.loadingTitle,
  default: '',
})

const webviewInstance = atom<RefObject<ReactNativeWebView>>({
  key: StoreKeyEnum.webviewInstance,
  default: createRef(),
})

const webviewLoadEnd = atom<boolean>({
  key: StoreKeyEnum.webviewLoadEnd,
  default: false,
})

const webviewComponentLoaded = atom<boolean>({
  key: StoreKeyEnum.webviewComponentLoaded,
  default: false,
})

export default {
  showLoading,
  loadingTxHash,
  loadingTitle,
  webviewInstance,
  webviewLoadEnd,
  webviewComponentLoaded,
}
