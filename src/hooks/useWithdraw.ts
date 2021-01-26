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
  runWithdraw: () => void
} => {
  const { navigateToConfirm } = useConfirm()
  const { confirm } = useStationWithdraw(user, { amounts, from })

  const runWithdraw = (): void => {
    confirm && navigateToConfirm({ confirm })
  }

  return {
    runWithdraw,
  }
}
