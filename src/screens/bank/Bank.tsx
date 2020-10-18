import React from 'react'
import { useMenu } from '@terra-money/use-native-station'
import Page from '../../components/Page'
import WithAuth from '../../components/WithAuth'
import { StatusBar } from 'react-native'

const Bank = () => {
  const { Bank: title } = useMenu()

  return (
    <Page title={title}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <WithAuth card>{(user) => null}</WithAuth>
    </Page>
  )
}

export default Bank
