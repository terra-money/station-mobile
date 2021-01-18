import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { ChartKey, useChart } from '@terra-money/use-native-station'

import EStyleSheet from 'react-native-extended-stylesheet'
import { AreaChart, Path } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

import ErrorBoundary from 'components/ErrorBoundary'
import ErrorComponent from 'components/ErrorComponent'
import Number from 'components/Number'
import Text from 'components/Text'

interface Props {
  chartKey: ChartKey
}

const Component = ({ chartKey }: Props): ReactElement => {
  const { value, title } = useChart(chartKey)
  const data = [3, 3, 5, 4, 6, 7, 8]
  const Line = (): ReactElement => (
    <Path key="line " stroke="rgba(32, 67, 181,.45)" fill="none" />
  )

  return (
    <View style={styles.chart_item}>
      <Text style={styles.chart_item_title}>{title}</Text>
      <View style={styles.bottom}>
        {Array.isArray(value) ? (
          <Text style={styles.chart_item_value}>
            {value[0]}
            <Text style={styles.chart_item_unit}> {value[1]}</Text>
          </Text>
        ) : (
          <Number {...value} integer />
        )}
        <AreaChart
          style={{ width: 60, height: 30, marginBottom: 5 }}
          data={data}
          contentInset={{ top: 0, bottom: 10 }}
          curve={shape.curveNatural}
          svg={{ fill: 'rgba(32, 67, 181, 0.15)' }}
        >
          <Line />
        </AreaChart>
      </View>
    </View>
  )
}
const ChartItem = (props: Props): ReactElement => (
  <ErrorBoundary fallback={<ErrorComponent />}>
    <Component {...props} />
  </ErrorBoundary>
)

const styles = EStyleSheet.create({
  chart_item: {
    padding: 20,
  },
  chart_item_title: {
    color: '$primaryColor',
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'TerraCompact-Bold',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  chart_item_value: {
    color: '$primaryColor',
    fontSize: 24,
    lineHeight: 36,
    fontFamily: 'TerraCompact-Regular',
    letterSpacing: -0.5,
  },
  chart_item_unit: {
    fontSize: 18,
    letterSpacing: 0,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
})

export default ChartItem
