import React from 'react'
import { useMenu } from '@terra-money/use-native-station'
import Page from '../../components/Page'
import Columns from './Columns'
import Charts from '../charts/Charts'
import { StatusBar } from 'react-native'

const Dashboard = () => {
  const { Dashboard: title } = useMenu()

  return (
    <Page title={title}>
      <StatusBar barStyle='dark-content' backgroundColor='transparent' />
      <Columns />
      <Charts />
    </Page>
  )
}

export default Dashboard
