import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { useSetRecoilState } from 'recoil'
import _ from 'lodash'

import {
  ConfirmPage,
  ConfirmProps,
  useConfirm as useStationConfirm,
  User,
} from 'use-station/src'

import ConfirmStore from 'stores/ConfirmStore'
import { RootStackParams } from 'types'

// @ts-ignore
import getSigner from 'utils/wallet-helper/signer'
// @ts-ignore
import signTx from 'utils/wallet-helper/api/signTx'
import { RawKey } from '@terra-money/terra.js'
import { getDecyrptedKey } from 'utils/wallet'

export type NavigateToConfirmProps = {
  confirm: ConfirmProps
}

export const useConfirm = (): {
  navigateToConfirm: (props: NavigateToConfirmProps) => void
  getComfirmData: ({
    confirm,
    user,
  }: {
    confirm: ConfirmProps
    user: User
  }) => ConfirmPage
  initConfirm: () => void
} => {
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  // ConfirmProps couldn't be serialized, so it have to transfer on recoil
  const setConfirm = useSetRecoilState(ConfirmStore.confirm)

  const navigateToConfirm = ({
    confirm,
  }: NavigateToConfirmProps): void => {
    setConfirm(confirm)
    navigate('Confirm')
  }

  const initConfirm = (): void => {
    setConfirm(undefined)
  }

  const getComfirmData = ({
    confirm,
    user,
  }: {
    confirm: ConfirmProps
    user: User
  }): ConfirmPage => {
    return useStationConfirm(confirm, {
      user,
      password: '',
      sign: async ({ tx, base, password }) => {
        const decyrptedKey = await getDecyrptedKey(
          user.name || '',
          password
        )
        if (_.isEmpty(decyrptedKey)) {
          throw new Error('Incorrect password')
        }
        const rk = new RawKey(Buffer.from(decyrptedKey, 'hex'))
        const signer = await getSigner(rk.privateKey, rk.publicKey)
        const signedTx = await signTx(tx, signer, base)
        return signedTx
      },
    })
  }

  return { navigateToConfirm, getComfirmData, initConfirm }
}
