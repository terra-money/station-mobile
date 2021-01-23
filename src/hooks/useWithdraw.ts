import { RootStackParams } from 'types'
import {
  User,
  useWithdraw as useStationWithdraw,
  WithdrawProps,
} from 'use-station/src'
import { useConfirm } from './useConfirm'

export const useWithdraw = ({
  user,
  amounts,
  from,
}: {
  user: User
} & WithdrawProps): {
  runWithdraw: ({
    confirmNavigateTo,
  }: {
    confirmNavigateTo: keyof RootStackParams
  }) => void
} => {
  const { navigateToConfirm } = useConfirm()
  const { confirm } = useStationWithdraw(user, { amounts, from })

  const runWithdraw = ({
    confirmNavigateTo,
  }: {
    confirmNavigateTo: keyof RootStackParams
  }): void => {
    confirm && navigateToConfirm({ confirm, confirmNavigateTo })
  }

  return {
    runWithdraw,
  }
}
