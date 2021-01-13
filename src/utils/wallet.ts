import { MnemonicKey } from '@terra-money/terra.js'
import { Alert, NativeModules } from 'react-native'
import dev from './dev'
import { encrypt, decrypt } from './keystore'

const { Preferences, Keystore } = NativeModules

export const recover = async (
  mk: MnemonicKey,
  { name, password }: { name: string; password: string }
): Promise<void> => {
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

export const decryptKey = (
  encryptedKey: string,
  password: string
): string => {
  try {
    return decrypt(encryptedKey, password)
  } catch {
    throw new Error('Incorrect password')
  }
}

export const getWallets = async (): Promise<LocalWallet[]> => {
  try {
    const wallets = await Preferences.getString('wallets')
    return JSON.parse(wallets)
  } catch {
    return []
  }
}

export const getWallet = async (
  name: string
): Promise<LocalWallet | undefined> => {
  const wallets = await getWallets()
  return wallets.find((wallet) => wallet.name === name)
}

export const getEncryptedKey = async (
  name: string
): Promise<string> => {
  const encryptedKey = await Keystore.read(name)
  return encryptedKey
}

const addWallet = async ({
  wallet,
  key,
}: {
  wallet: LocalWallet
  key: string
}): Promise<void> => {
  const wallets = await getWallets()

  if (wallets.find((w) => w.name === wallet.name))
    throw new Error('Wallet with that name already exists')

  await Preferences.setString(
    'wallets',
    JSON.stringify([...wallets, wallet])
  )
  await Keystore.write(wallet.name, key)
}

export const getDecyrptedKey = async (
  name: string,
  password: string
): Promise<string> => {
  const encryptedKey = await getEncryptedKey(name)
  const decrypted = decryptKey(encryptedKey, password)
  return decrypted
}

export const testPassword = async ({
  name,
  password,
}: {
  name: string
  password: string
}): Promise<boolean> => {
  const wallet = await getWallet(name)

  if (!wallet) throw new Error('Wallet with that name does not exist')

  try {
    const key = await Keystore.read(wallet.name)
    const ret = decrypt(key, password)
    if (ret === '') return false
    return true
  } catch (e) {
    dev.log(e)
    return false
  }
}
