import React, { ReactNode, useEffect, useState } from 'react'
import { getWallets } from '../utils/wallet'

interface Props {
  render: (wallets:LocalWallet[]) => ReactNode
}

const WithKeys = ({ render }: Props) => {
  const [wallets, setWallets] = useState<LocalWallet[]>()

  useEffect(()=>{
    const fn = async () => {
      const wallets =  await getWallets()
      setWallets(wallets)
    }

    fn()
  },[])

  return <>{!wallets ? null : render(wallets)}</>
}

export default WithKeys
