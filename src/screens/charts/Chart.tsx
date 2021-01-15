import React, { ReactElement } from 'react'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useChart } from '@terra-money/use-native-station'
import { DashboardRouteParams } from '../../types/navigation'
import Page from 'components/Page'
import Text from 'components/Text'

type ChartRouteProp = RouteProp<DashboardRouteParams, 'Chart'>

const Chart = (): ReactElement => {
  const { params } = useRoute<ChartRouteProp>()
  const { title } = useChart(params.chartKey)

  return (
    <Page title={title}>
      <Text>Chart details</Text>
    </Page>
  )
}

export default Chart
