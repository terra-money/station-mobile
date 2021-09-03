import {
  User,
  useWithdraw as useStationWithdraw,
  WithdrawProps,
} from 'lib'
import { useConfirm } from './useConfirm'

export const useWithdraw = ({
  user,
  amounts,
  validators,
}: {
  user: User
} & WithdrawProps): {
  runWithdraw: () => void
} => {
  const { navigateToConfirm } = useConfirm()
  const { confirm } = useStationWithdraw(user, {
    amounts,
    validators,
  })

  const runWithdraw = (): void => {
    confirm && navigateToConfirm({ confirm })
  }

  return {
    runWithdraw,
  }
}
