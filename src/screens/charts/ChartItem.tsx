import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ChartUI, ChartKey } from '@terra-money/use-native-station'
import { useChart } from '@terra-money/use-native-station'
import ErrorBoundary from '../../components/ErrorBoundary'
import ErrorComponent from '../../components/ErrorComponent'
import Number from '../../components/Number'

interface Props {
  chartKey: ChartKey
}

const Component = ({ chartKey }: Props) => {
  const { navigate } = useNavigation()
  const { value, chart, title } = useChart(chartKey)

  /* render */
  const renderChart = (chart: ChartUI) => (
    <TouchableOpacity onPress={() => navigate('Chart', { chartKey })}>
      <View>
        <Text>{title}</Text>
        {Array.isArray(value) ? (
          <Text style={{ fontSize: 20 }}>
            {value[0]}
            <Text>{value[1]}</Text>
          </Text>
        ) : (
          <Number {...value} fontSize={20} integer />
        )}
      </View>
    </TouchableOpacity>
  )

  return chart ? renderChart(chart) : null
}

const ChartItem = (props: Props) => (
  <ErrorBoundary fallback={<ErrorComponent />}>
    <Component {...props} />
  </ErrorBoundary>
)

export default ChartItem
