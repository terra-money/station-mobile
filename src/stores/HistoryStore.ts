import { atom } from 'recoil'
import { TxsUI } from 'lib'
import { StoreKeyEnum } from './StoreKeyEnum'

const walletTabUi = atom<TxsUI | undefined>({
  key: StoreKeyEnum.walletTabUi,
  default: undefined,
})

export default { walletTabUi }
