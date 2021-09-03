import { atom } from 'recoil'
import { ConfirmProps } from 'lib'
import { StoreKeyEnum } from './StoreKeyEnum'

const confirm = atom<ConfirmProps | undefined>({
  key: StoreKeyEnum.confirm,
  default: undefined,
})

export default { confirm }
