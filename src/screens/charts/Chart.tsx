import React from 'react'
import { Text } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useChart } from '@terra-money/use-native-station'
import { DashboardRouteParams } from '../../types/navigation'
import Page from '../../components/Page'

type ChartRouteProp = RouteProp<DashboardRouteParams, 'Chart'>

const Chart = () => {
  const { params } = useRoute<ChartRouteProp>()
  const { title } = useChart(params.chartKey)

  return (
    <Page title={title}>
      <Text>Chart details</Text>
    </Page>
  )
}

export default Chart
