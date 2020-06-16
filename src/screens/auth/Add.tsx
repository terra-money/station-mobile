import React, { useState } from 'react'
import { Seed, Address, Wallet, Bip } from '@terra-money/use-native-station'
import { useSignUp, SignUpNext } from '@terra-money/use-native-station'
import ErrorComponent from '../../components/ErrorComponent'
import Form from '../../components/Form'
import Warning from './Warning'
import Seeds from './Seeds'
import SelectAccount from './SelectAccount'
import ConfirmSeed from './ConfirmSeed'
import {NativeModules} from 'react-native';

const generateAddresses = async (
  phrase: string
): Promise<[Address, Address]> => {

  const result = await NativeModules.TerraWallet.getNewWalletFromSeed(phrase, 330);
  // return {
  //     private_key: result.privateKey,
  //     public_key: result.publicKey,
  //     address: result.address,
  //     mnemonic: result.mnemonic
  // };

  const addresses = [result.publicKey, result.address] as [Address, Address]
  return addresses

  

  //만약, seed까지 자동으로 생성을 원한다면
  /* 
    const result = await NativeModules.TerraWallet.getNewWallet();
    const wallet = {
        private_key: result.privateKey,
        public_key: result.publicKey,
        address: result.address,
        mnemonic: result.mnemonic
    };
  */
}

const generateWalletFromSeed = async ([phrase, bip]: [string, Bip]): Promise<Wallet> => {
  const result = await NativeModules.TerraWallet.getNewWalletFromSeed(phrase, bip);
  return {
      privateKey: result.privateKey,
      publicKey: result.publicKey,
      terraAddress: result.address,
  };
}

const encrypt = ([wallet, password]: [Wallet, string]): string => {
  return ''
}

export const storeKeys = (keys: Key[]) => {}

type Key = { name: string; address: string; wallet: string }
export const loadKeys = (): Key[] => []

type Params = { name: string; password: string; wallet: Wallet }
export const importKey = async ({ name, password, wallet }: Params) => {
  const keys = loadKeys()

  if (keys.find((key) => key.name === name))
    throw new Error('Key with that name already exists')

  const encrypted = encrypt([wallet, password])

  if (!encrypted) throw new Error('Encryption error occurred')

  const key: Key = {
    name,
    address: wallet.terraAddress,
    wallet: encrypted,
  }

  storeKeys([...keys, key])
}

const isExists = (q: keyof Key, v: string): boolean => {
  const keys = loadKeys()
  return !!keys.find((key) => key[q] === v)
}

const Add = ({ generated }: { generated?: Seed }) => {
  const { form, mnemonics: seeds, warning, next, reset, error } = useSignUp({
    generated,
    generateAddresses: async (phrase: string) =>
      await generateAddresses(phrase),
    generateWallet: async (phrase, bip) => {
      const params = [phrase, bip]
      const wallet = await generateWalletFromSeed(params as [string, Bip])
      return wallet
    },
    submit: importKey,
    isNameExists: (name: string) => isExists('name', name),
    isAddressExists: (address: string) => isExists('address', address),
  })

  /* warning */
  const [checked, setChecked] = useState(false)
  const toggle = () => setChecked((c) => !c)

  /* render */
  const renderNext = (next: SignUpNext) => {
    const components = {
      select: () => <SelectAccount {...next} />,
      confirm: () => <ConfirmSeed {...next} />,
    }

    return components[next.step]()
  }

  return error ? (
    <ErrorComponent>{error.message}</ErrorComponent>
  ) : next ? (
    renderNext(next)
  ) : (
    <Form form={form} disabled={generated && !checked}>
      {generated ? (
        <Warning {...warning} attrs={{ value: checked, onChange: toggle }} />
      ) : (
        <Seeds {...seeds} />
      )}
    </Form>
  )
}

export default Add


/*

일반적인 preference 저장(보안없음)
NativeModules.FlutterPreferences
- setBool(key:string, value:boolean): void
- getBool(key:string): Promise<boolean> // key가 없을때 false

- setDouble(key:string, value:number): void
- getDouble(key:string): Promise<number> // key가 없을때 0.0

- setInt(key:string, value:number(정수만)): void
- getInt(key:string): Promise<number> // key가 없을때 0

- setString(key:string, value:string): void
- getString(key:string): Promise<string> // key가 없을때 ""

- remove(key:string): void


보안정보 저장(ios: keychain, android: keystore)
* ios의 경우 앱을 지워도 keychain에 데이터가 남아있으므로 재설치시 데이터초기화를 따로 해주어야 함.(다른 앱에서 이 영역에 접근할수는 없음.)
* 보안영역에 데이터가 저장되는 것이라 하더라도, 저장 전 원본데이터를 자체적으로 한번 더 암호화 하는 것을 추천.
* 이 로직은 Flutter로 작성된 하베스트1.0의 로직을 2.0으로의 마이그레이션을 위해 그대로 포팅한 것임.

NativeModules.FlutterKeystore
- write(key:string, value:string): void
- read(key:string): Promise<string> // key가 없을때 throw
- remove(key:string): void
*/