import React, { FC } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTranslation } from 'react-i18next'

import { TabNavigatorParamList } from './types'
import { Text, View } from 'native-base'

const { Navigator, Screen } =
  createBottomTabNavigator<TabNavigatorParamList>()

const EmptyTestScreen = () => {
  const { t } = useTranslation()
  return (
    <View>
      <Text>{t('Test screen')}</Text>
    </View>
  )
}

export const TabNavigator: FC = () => {
  const { t } = useTranslation()

  return (
    <Navigator>
      <Screen
        component={EmptyTestScreen}
        name={'Wallet'}
        options={{
          tabBarLabel: t('Wallet'),
        }}
      />
    </Navigator>
  )
}
