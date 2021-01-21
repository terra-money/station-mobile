import { atom } from 'recoil'
import { ConfirmProps } from 'use-station/src'
import { StoreKeyEnum } from './StoreKeyEnum'

const confirm = atom<ConfirmProps | undefined>({
  key: StoreKeyEnum.sendConfirm,
  default: undefined,
})

export default { confirm }
