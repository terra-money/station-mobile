import { Tx } from '@terra-money/terra.js'
import { atom } from 'recoil'
import { StoreKeyEnum } from './StoreKeyEnum'

const unsignedTx = atom<Tx | undefined>({
  key: StoreKeyEnum.unsignedTx,
  default: undefined,
})

const connectAddress = atom<string | undefined>({
  key: StoreKeyEnum.connectAddress,
  default: undefined,
})

const continueSignedTx = atom<boolean | undefined>({
  key: StoreKeyEnum.continueSignedTx,
  default: undefined,
})

export default {
  unsignedTx,
  connectAddress,
  continueSignedTx,
}
