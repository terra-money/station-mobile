import React, { ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import _ from 'lodash'
import {
  PricesUI,
  TaxRateUI,
  StakingRatioUI,
  useDashboard,
} from 'use-station/src'

import Swiper from 'react-native-swiper'
import Card from 'components/Card'
import { Text } from 'components'

import DisplaySelector from './DisplaySelector'

const Columns = (): ReactElement => {
  const { navigate } = useNavigation()
  const { ui } = useDashboard()

  const renderPrice = ({
    title,
    display: { value, unit },
  }: PricesUI): ReactElement => (
    <Card
      title={title}
      value={value}
      unit={unit}
      onPress={(): void => navigate('Swap')}
      dark
    />
  )

  const renderTaxRate = ({
    desc,
    ...rest
  }: TaxRateUI): ReactElement => <Card {...rest} badge={desc} dark />

  const renderStakingRatio = ({
    title,
    content,
    ...rest
  }: StakingRatioUI): ReactElement => {
    const { small, desc } = rest
    return (
      <Card title={title} badge={desc} dark>
        <Text style={styles.value}>
          {content} <Text style={styles.small}>({small})</Text>
        </Text>
      </Card>
    )
  }

  const SwiperDotView = (): ReactElement => (
    <View
      style={{
        backgroundColor: 'rgba(32, 67, 181, .2)',
        width: 6,
        height: 6,
        borderRadius: 3,
        margin: 5,
      }}
    />
  )
  const SwiperActiveDotView = (): ReactElement => (
    <View
      style={{
        backgroundColor: 'rgba(32, 67, 181, 1)',
        width: 6,
        height: 6,
        borderRadius: 3,
        margin: 5,
      }}
    />
  )

  return (
    <>
      {_.some(ui) && (
        <Swiper
          style={[styles.carousel, { height: 168 }]}
          loop
          autoplay
          autoplayTimeout={10} // seconds
          dot={SwiperDotView()}
          activeDot={SwiperActiveDotView()}
        >
          <View style={styles.carousel_item}>
            {renderPrice(ui.prices)}
          </View>
          <View style={styles.carousel_item}>
            {renderTaxRate(ui.taxRate)}
          </View>
          <View style={styles.carousel_item}>
            <DisplaySelector {...ui.issuance} />
          </View>
          <View style={styles.carousel_item}>
            <DisplaySelector {...ui.communityPool} />
          </View>
          <View style={styles.carousel_item}>
            {renderStakingRatio(ui.stakingRatio)}
          </View>
        </Swiper>
      )}
    </>
  )
}

/* styles */
const styles = StyleSheet.create({
  carousel: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  carousel_item: {
    width: '100%',
  },
  value: {
    fontSize: 28,
    letterSpacing: -0.5,
    lineHeight: 36,
    color: '#fff',
    marginTop: 10,
  },

  small: {
    fontSize: 12,
    letterSpacing: 0,
  },
})

export default Columns
