import React, { ReactElement, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import _ from 'lodash'
import { ChartKey, useChart } from 'use-station/src'

import { AreaChart } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

import ErrorBoundary from 'components/ErrorBoundary'
import ErrorComponent from 'components/ErrorComponent'
import { Text, Number, LoadingIcon } from 'components'
import color from 'styles/color'

interface Props {
  chartKey: ChartKey
}

const Component = ({ chartKey }: Props): ReactElement => {
  const { value, title, chart, filter } = useChart(chartKey)
  let displayData: number[] = []
  if (chart?.data) {
    const { data } = chart
    displayData = _.map(data, (item) => item.y)
  }

  useEffect(() => {
    const { duration } = filter
    duration.set('7')
  }, [])

  return (
    <View style={styles.chart_item}>
      <Text style={styles.chart_item_title} fontType={'bold'}>
        {title}
      </Text>
      <View style={styles.bottom}>
        {Array.isArray(value) ? (
          <Text style={styles.chart_item_value}>
            {value[0]}
            <Text style={styles.chart_item_unit}> {value[1]}</Text>
          </Text>
        ) : (
          <Number {...value} integer />
        )}
        {chart?.data ? (
          <AreaChart
            style={{ width: 60, height: 40, marginBottom: 5 }}
            data={displayData}
            contentInset={{ top: 0, bottom: 10 }}
            curve={shape.curveNatural}
            svg={{ fill: 'rgba(32, 67, 181, 0.15)' }}
          />
        ) : (
          <LoadingIcon />
        )}
      </View>
    </View>
  )
}
const ChartItem = (props: Props): ReactElement => (
  <ErrorBoundary fallback={<ErrorComponent />}>
    <Component {...props} />
  </ErrorBoundary>
)

const styles = StyleSheet.create({
  chart_item: {
    padding: 20,
  },
  chart_item_title: {
    fontSize: 14,
    lineHeight: 21,
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  chart_item_value: {
    color: color.sapphire,
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  chart_item_unit: {
    fontSize: 18,
    letterSpacing: 0,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default ChartItem
