import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react'
import dev from 'utils/dev'
import { getWallets } from '../utils/wallet'

interface Props {
  render: (wallets: LocalWallet[]) => ReactNode
}

const WithKeys = ({ render }: Props): ReactElement => {
  const [wallets, setWallets] = useState<LocalWallet[]>()

  useEffect(() => {
    const fn = async (): Promise<void> => {
      const wallets = await getWallets()

      dev.log('wallets : ' + wallets)
      setWallets(wallets)
    }

    fn()
  }, [])

  return <>{!wallets ? null : render(wallets)}</>
}

export default WithKeys
