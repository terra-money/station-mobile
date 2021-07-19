import { useEffect, useState } from 'react'
import _ from 'lodash'

import { getWallets } from 'utils/wallet'

export const useValueValidator = (): {
  valueValidate: {
    password: (password: string) => string
    name: (name: string) => string
  }
  walletList: LocalWallet[]
} => {
  const [walletList, setWalletList] = useState<LocalWallet[]>([])

  const isNameExists = (name: string): boolean => {
    return _.some(walletList, (x) => x.name === name)
  }

  const valueValidate = {
    name: (name: string): string =>
      !name.length
        ? 'name is required'
        : name.length < 5 || name.length > 20
        ? `name must be between 5 and 20 characters`
        : isNameExists(name)
        ? `"${name}" is already exists`
        : '',
    password: (password: string): string =>
      !password.length
        ? 'Password is required'
        : password.length < 10
        ? 'Password must be longer than 10 characters'
        : '',
  }
  useEffect(() => {
    getWallets().then((list): void => {
      setWalletList(list)
    })
  }, [])
  return {
    valueValidate,
    walletList,
  }
}
