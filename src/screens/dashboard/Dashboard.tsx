import React from 'react'
import { useMenu } from '@terra-money/use-native-station'
import Page from '../../components/Page'
import Columns from './Columns'
import Charts from '../charts/Charts'

const Dashboard = () => {
  const { Dashboard: title } = useMenu()

  return (
    <Page title={title}>
      <Columns />
      <Charts />
    </Page>
  )
}

export default Dashboard
