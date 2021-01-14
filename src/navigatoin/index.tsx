import React, { ReactElement } from 'react'
import {
  NavigationContainer,
  DefaultTheme,
  LinkingOptions,
} from '@react-navigation/native'

import { RootStack } from '../types'

import Tabs from './Tabs'
import AuthMenu from '../screens/auth/AuthMenu'
import SelectWallet from '../screens/auth/SelectWallet'
import NewWalletStack from './NewWalletStack'
import WalletCreated from '../screens/auth/NewWallet/WalletCreated'
import Add from '../screens/auth/Add'

import OnBoarding from '../screens/OnBoarding'
import Setting from '../screens/Setting'
import ConnectView from '../screens/topup/ConnectView'
import SendTxView from '../screens/topup/SendTxView'
import { View } from 'react-native'

const TerraTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F9FAFF',
  },
}

const AppNavigator = ({
  skipOnboarding,
}: {
  skipOnboarding?: boolean
}): ReactElement => {
  /* linking */
  const linking: LinkingOptions = {
    prefixes: ['terrastation://'],
    config: {
      screens: {
        ConnectView: {
          path: 'connect/:arg',
        },
        SendTxView: {
          path: 'sign/:arg',
        },
      },
    },
  }

  return (
    <NavigationContainer theme={TerraTheme} linking={linking}>
      <RootStack.Navigator
        initialRouteName={skipOnboarding ? 'Tabs' : 'OnBoarding'}
      >
        <RootStack.Screen
          name="OnBoarding"
          component={OnBoarding}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <RootStack.Screen
          name="Tabs"
          component={Tabs}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <RootStack.Screen
          name="Setting"
          component={Setting}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="AuthMenu"
          component={AuthMenu}
          options={{ headerTitle: AuthMenu.header }}
        />
        <RootStack.Screen
          name="SelectWallet"
          component={SelectWallet}
          options={{ headerTitle: SelectWallet.header }}
        />
        <RootStack.Screen
          name="NewWallet"
          component={NewWalletStack}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="WalletCreated"
          component={WalletCreated}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="Add"
          component={Add}
          options={{ animationEnabled: false }}
        />
        <RootStack.Screen
          name="ConnectView"
          component={ConnectView}
          options={{ animationEnabled: false }}
        />
        <RootStack.Screen
          name="SendTxView"
          component={SendTxView}
          options={{ animationEnabled: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
