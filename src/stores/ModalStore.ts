import { ReactNode } from 'react'
import { atom } from 'recoil'
import { StoreKeyEnum } from './StoreKeyEnum'

const children = atom<ReactNode>({
  key: StoreKeyEnum.modalChildren,
  default: undefined,
})

const isVisible = atom<boolean>({
  key: StoreKeyEnum.modalIsVisible,
  default: false,
})

export default {
  children,
  isVisible,
}
