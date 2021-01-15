import { MnemonicKey } from '@terra-money/terra.js'
import { Alert, NativeModules } from 'react-native'
import dev from './dev'
import { encrypt, decrypt } from './keystore'

const { Preferences, Keystore } = NativeModules

export const generateAddresses = (
  mnemonic: string
): {
  mk118: MnemonicKey
  mk330: MnemonicKey
} => {
  const mk118 = new MnemonicKey({ mnemonic, coinType: 118 })
  const mk330 = new MnemonicKey({ mnemonic, coinType: 330 })

  return { mk118, mk330 }
}

export const createWallet = async ({
  seed,
  name,
  password,
}: {
  seed: string
  name: string
  password: string
}): Promise<boolean> => {
  const { mk330 } = generateAddresses(seed)

  return recover(mk330, { name, password })
}

export const recover = async (
  mk: MnemonicKey,
  { name, password }: { name: string; password: string }
): Promise<boolean> => {
  try {
    const key = encrypt(mk.privateKey.toString('hex'), password)
    if (!key) {
      throw new Error('Encryption error occurred')
    }
    const wallet = { name, address: mk.accAddress }
    await addWallet({ wallet, key })
    return true
  } catch (e) {
    Alert.alert(e.toString())
  }
  return false
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
