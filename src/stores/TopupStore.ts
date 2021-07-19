import { StdSignMsg } from '@terra-money/terra.js'
import { atom } from 'recoil'
import { StoreKeyEnum } from './StoreKeyEnum'

const stdSignMsg = atom<StdSignMsg | undefined>({
  key: StoreKeyEnum.stdSignMsg,
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
  stdSignMsg,
  connectAddress,
  continueSignedTx,
}
