import {
  LinkingOptions,
  PathConfigMap,
} from '@react-navigation/native'
import { atom, selector } from 'recoil'
import { StoreKeyEnum } from './StoreKeyEnum'
import _ from 'lodash'

export enum MainLinkingScreenKeyEnum {
  ConnectView = 'ConnectView',
  SendTxView = 'SendTxView',
  AutoLogout = 'AutoLogout',
}

const mainLinkingScreens = {
  [MainLinkingScreenKeyEnum.ConnectView]: {
    path: 'connect',
  },
  [MainLinkingScreenKeyEnum.SendTxView]: {
    path: 'sign',
  },
  [MainLinkingScreenKeyEnum.AutoLogout]: {
    path: 'wallet_recover',
  },
}

const mainLinkingScreenKeys = atom<MainLinkingScreenKeyEnum[]>({
  key: StoreKeyEnum.mainLinkingScreenKeys,
  default: [
    MainLinkingScreenKeyEnum.ConnectView,
    MainLinkingScreenKeyEnum.SendTxView,
    MainLinkingScreenKeyEnum.AutoLogout,
  ],
})

const mainLinking = selector<LinkingOptions>({
  key: StoreKeyEnum.mainLinking,
  get: ({ get }) => {
    const kyes = get(mainLinkingScreenKeys)
    const screens: PathConfigMap = {}
    _.forEach(kyes, (key) => {
      screens[key] = mainLinkingScreens[key]
    })
    return {
      prefixes: ['terrastation://'],
      config: { screens },
    }
  },
})

export enum AuthLinkingScreenKeyEnum {
  RecoverWallet = 'RecoverWallet',
}

const authLinkingScreens = {
  [AuthLinkingScreenKeyEnum.RecoverWallet]: {
    screens: {
      Step2QR: {
        path: 'wallet_recover',
      },
    },
  },
}

const authLinkingScreenKeys = atom<AuthLinkingScreenKeyEnum[]>({
  key: StoreKeyEnum.authLinkingScreenKeys,
  default: [AuthLinkingScreenKeyEnum.RecoverWallet],
})

const authLinking = selector<LinkingOptions>({
  key: StoreKeyEnum.authLinking,
  get: ({ get }) => {
    const kyes = get(authLinkingScreenKeys)
    const screens: PathConfigMap = {}
    _.forEach(kyes, (key) => {
      screens[key] = authLinkingScreens[key]
    })
    return {
      prefixes: ['terrastation://'],
      config: { screens },
    }
  },
})

export default {
  mainLinking,
  mainLinkingScreenKeys,
  authLinking,
  authLinkingScreenKeys,
}
