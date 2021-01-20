import { atom } from 'recoil'
import { ConfirmProps } from 'use-station/src'

const confirm = atom<ConfirmProps | undefined>({
  key: 'confirm',
  default: undefined,
})

export default { confirm }
