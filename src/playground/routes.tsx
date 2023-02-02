import React from 'react'
import { useTheme } from 'native-base'

import PlaygroundScreen from '.'

import { Stack } from '@core/services/navigation'

export type PlaygroundRoutes = {
  Playground: undefined
}

export function getPlaygroundRoutes({ Group, Screen }: Stack) {
  const theme = useTheme()
  return (
    <Group
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background[100],
        },
        statusBarStyle: 'dark',
        statusBarColor: 'transparent',
        navigationBarColor: 'transparent',
      }}>
      <Screen name="Playground" component={PlaygroundScreen} />
    </Group>
  )
}
