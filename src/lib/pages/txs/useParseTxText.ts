import { useQuery } from 'react-query'
import { format } from '../../utils'
import useLCD from '../../../hooks/useLCD'
import { truncate } from '../../utils/format'
import { useAuth } from '../../contexts/AuthContext'
import { useCurrentChainName } from '../../contexts/ConfigContext'
import useWhitelist from '../../cw20/useWhitelist'
import useContracts from '../../hooks/useContracts'
import BigNumber from 'bignumber.js'
import { getTraceDenom } from 'hooks/useDenomTrace'

const REGEXP = {
  ADDRESS: /(terra1[a-z0-9]{38})|(terravaloper[a-z0-9]{39})/g,
  COIN: /^\d+((terra1[a-z0-9]{38})|(u[a-z]{1,4}))/g,
}

const useParseTxText = (): ((text?: string) => Promise<string>) => {
  const chainName = useCurrentChainName()
  const { user } = useAuth()
  const { whitelist } = useWhitelist()
  const { contracts } = useContracts(chainName)
  const lcd = useLCD()
  const { data: validators } = useQuery('validators', () =>
    lcd.staking.validators()
  )

  /*
  # Terra address
  - My wallet
  - Validator address => monikier
  - Token => Symbol
  - Contract => Protocol + contract name

  # Amount and denom list
  - List of coins => Human readable
  */

  const replaceAddress = (address: string): string => {
    const token = whitelist?.[address]
    const contract = contracts?.[address]
    const validator = validators?.find(
      ({ operator_address }) => operator_address === address
    )

    return address === user?.address
      ? 'My wallet'
      : validator
      ? validator.description.moniker
      : contract
      ? [contract.protocol, contract.name].join(' ')
      : token
      ? token.symbol
      : truncate(address)
  }

  const replaceCoin = (coin: string): string => {
    const { amount, token } = splitTokenText(coin)

    return format.coin(
      { amount, denom: token },
      whitelist[token]?.decimals,
      undefined,
      whitelist
    )
  }

  const splitIbcWord = async (word: string): Promise<string> => {
    const idx = word.indexOf('ibc/')

    const coin = new BigNumber(word.slice(0, idx)).dividedBy(1e6)
    const denom = word.slice(idx)
    const baseDenom = await getTraceDenom(lcd, denom)

    return coin + ' ' + format.denom(baseDenom)
  }

  const parseWord = async (word: string): Promise<string> =>
    word.split(',').length > 1
      ? 'multiple coins'
      : word.includes('ibc/')
      ? await splitIbcWord(word)
      : word
          .replace(REGEXP.COIN, replaceCoin)
          .replace(REGEXP.ADDRESS, replaceAddress)

  return async (text = ''): Promise<string> => {
    return (await Promise.all(text.split(' ').map(parseWord))).join(
      ' '
    )
  }
}

export default useParseTxText

/* utils */
export const splitTokenText = (
  string = ''
): {
  amount: string
  token: string
} => {
  const [, amount, token] = string.split(/(\d+)(\w+)/)
  return { amount, token }
}
