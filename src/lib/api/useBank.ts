import { BankData, Balance, API, BankDataV2, BalanceV2 } from "../types";
import { lt } from '../utils'
import useFCD from './useFCD'
import { useIsClassic } from "lib/contexts/ConfigContext";

export default ({ address }: { address: string }): API<BankData | BankDataV2> => {
  const { data, ...rest } = useFCD<BankData | BankDataV2>({ url: `/v1/bank/${address}`})
  const isClassic = useIsClassic()

  const fixAvailable = (bank: BankData): Balance[] => {

    return bank?.balance?.map(({ available, ...rest }) => ({
      ...rest,
      available: lt(available, 0) ? '0' : available,
    }))
  }

  const fixAvailableV2 = (bank: BankDataV2): BalanceV2[] => {
    return bank?.account?.balances?.map(({ ...rest }) => ({
      ...rest,
    }))
  }

  return isClassic ? Object.assign(
    {},
    rest,
    data && {
      data: Object.assign({}, data, {
        balance: fixAvailable(data)
      }),
    }
  ) : Object.assign(
    {},
    rest,
    data && {
      data: Object.assign({}, data, {
        balance: fixAvailableV2(data),
      }),
    }
  )
}
