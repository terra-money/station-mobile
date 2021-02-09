import { StdSignMsg } from '@terra-money/terra.js'
import { atom } from 'recoil'
import { StoreKeyEnum } from './StoreKeyEnum'

const stdSignMsg = atom<StdSignMsg | undefined>({
  key: StoreKeyEnum.stdSignMsg,
  default: undefined,
})

export default {
  stdSignMsg,
}
