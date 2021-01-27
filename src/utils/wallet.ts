import { Alert } from 'react-native'
import { MnemonicKey } from '@terra-money/terra.js'
import { encrypt, decrypt } from '@terra-money/key-utils'

import dev from './dev'
import preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'
import keystore from 'nativeModules/keystore'
import { upsertBioAuthPassord } from './storage'

const sanitize = (s = ''): string =>
  s.toLowerCase().replace(/[^a-z]/g, '')

export const formatSeedStringToArray = (seed: string): string[] => {
  return seed
    .trim()
    .replace(/[\n\r]/g, ' ')
    .replace(/\s\s+/g, ' ')
    .split(' ')
    .map(sanitize)
}

export const generateAddresses = (
  mnemonic: string
): {
  mk118: MnemonicKey
  mk330: MnemonicKey
} => {
  const formatted = formatSeedStringToArray(mnemonic).join(' ')
  const mk118 = new MnemonicKey({
    mnemonic: formatted,
    coinType: 118,
  })
  const mk330 = new MnemonicKey({
    mnemonic: formatted,
    coinType: 330,
  })

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
    await addWallet({ wallet, key, password })
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
    const wallets = await preferences.getString(
      PreferencesEnum.wallets
    )
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
  const encryptedKey = await keystore.read(name)
  return encryptedKey
}

const addWallet = async ({
  wallet,
  key,
  password,
}: {
  wallet: LocalWallet
  key: string
  password: string
}): Promise<void> => {
  const wallets = await getWallets()

  if (wallets.find((w) => w.name === wallet.name))
    throw new Error('Wallet with that name already exists')

  preferences.setString(
    PreferencesEnum.wallets,
    JSON.stringify([...wallets, wallet])
  )
  keystore.write(wallet.name, key)

  await upsertBioAuthPassord({ walletName: wallet.name, password })
}

export const getDecyrptedKey = async (
  name: string,
  password: string
): Promise<string> => {
  const encryptedKey = await getEncryptedKey(name)
  const decrypted = decryptKey(encryptedKey, password)

  return decrypted
}

export const changePassword = async (
  name: string,
  ondPassword: string,
  newPassword: string
): Promise<boolean> => {
  try {
    const decryptedKey = await getDecyrptedKey(name, ondPassword)
    const encryptedKey = encrypt(decryptedKey, newPassword)
    keystore.write(name, encryptedKey)
    await upsertBioAuthPassord({
      walletName: name,
      password: newPassword,
    })
    return true
  } catch (error) {
    return false
  }
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
    const key = await keystore.read(wallet.name)
    const ret = decrypt(key, password)
    if (ret === '') return false
    return true
  } catch (e) {
    dev.log(e)
    return false
  }
}
