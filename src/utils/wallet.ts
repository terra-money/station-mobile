import { MnemonicKey } from '@terra-money/terra.js'
import { encrypt, decrypt } from './keystore'
import { Alert, NativeModules } from 'react-native'

const useWallet = () => {
  const recover = async (
    mk: MnemonicKey,
    { name, password }: { name: string; password: string }
  ) => {
    try {
      const key = encrypt(mk.privateKey.toString('hex'), password)
      if (!key) {
        throw new Error('Encryption error occurred')
      }
      const wallet = { name, address: mk.accAddress }
      await addWallet({ wallet, key })
    } catch (e) {
      Alert.alert(e.toString())
    }
  }

  const decryptWallet = (wallet: string, password: string) => {
    try {
      const decrypted = decrypt(wallet, password)
      //   const key = new RawKey(Buffer.from(decrypted, "hex"))

      //   return key
      return null
    } catch {
      throw new Error('Incorrect password')
    }
  }

  return { recover, decryptWallet }
}

const { Preferences, Keystore } = NativeModules

export const getWallets = async (): Promise<LocalWallet[]> => {
  try {
    const wallets = await Preferences.getString('wallets')
    return JSON.parse(wallets)
  } catch {
    return []
  }
}

const addWallet = async ({
  wallet,
  key,
}: {
  wallet: LocalWallet
  key: string
}) => {
  const wallets = await getWallets()

  if (wallets.find((w) => w.name === wallet.name))
    throw new Error('Wallet with that name already exists')

  await Preferences.setString('wallets', JSON.stringify([...wallets, wallet]))
  await Keystore.write(wallet.name, key)
}

export const testPassword = async ({
  name,
  password,
}: {
  name: string
  password: string
}) => {
  const wallets = await getWallets()
  const wallet = wallets.find((w) => w.name === name)

  if (!wallet) throw new Error('Wallet with that name does not exist')

  try {
    const key = await Keystore.read(wallet.name)
    const ret = decrypt(key, password)
    if (ret === '') return false
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

export default useWallet
