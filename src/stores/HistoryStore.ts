import { atom } from 'recoil'
import { TxsUI } from 'use-station/src'
import { StoreKeyEnum } from './StoreKeyEnum'

const walletTabUi = atom<TxsUI | undefined>({
  key: StoreKeyEnum.walletTabUi,
  default: undefined,
})

export default { walletTabUi }
