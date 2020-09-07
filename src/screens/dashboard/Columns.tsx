import React from 'react'
import { Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { DashboardUI } from '@terra-money/use-native-station'
import { PricesUI, TaxRateUI } from '@terra-money/use-native-station'
import { StakingRatioUI } from '@terra-money/use-native-station'
import { useDashboard } from '@terra-money/use-native-station'
import Card from '../../components/Card'
import DisplaySelector from './DisplaySelector'
import EStyleSheet from 'react-native-extended-stylesheet';

const Columns = () => {
  const { navigate } = useNavigation()
  const { ui } = useDashboard()

  const renderPrice = ({ title, display: { value, unit } }: PricesUI) => (
    <Card
      title={title}
      value={value}
      unit={unit}
      onPress={() => navigate('Market')}
      dark
    />
  )

  const renderTaxRate = ({ desc, ...rest }: TaxRateUI) => (
    <Card {...rest} badge={desc} dark />
  )

  const renderStakingRatio = ({ title, content, ...rest }: StakingRatioUI) => {
    const { small, desc } = rest
    return (
      <Card title={title} badge={desc} dark>
        <Text style={styles.value}>{content} <Text style={styles.small}>({small})</Text></Text>
      </Card>
    )
  }

  const render = (ui: DashboardUI) => (
    <>
      <View style={styles.carousel}>
        <View style={styles.carousel_item}>{renderPrice(ui.prices)}</View>
        <View style={styles.carousel_item}>{renderTaxRate(ui.taxRate)}</View>
        <View style={styles.carousel_item}><DisplaySelector {...ui.issuance} /></View>
        <View style={styles.carousel_item}><DisplaySelector {...ui.communityPool} /></View>
        <View style={styles.carousel_item}>{renderStakingRatio(ui.stakingRatio)}</View>
      </View>
      <View style={styles.carousel_paging}>
        <View style={[styles.carousel_paging_indicator, styles.active]}/>
        <View style={styles.carousel_paging_indicator}/>
        <View style={styles.carousel_paging_indicator}/>
        <View style={styles.carousel_paging_indicator}/>
        <View style={styles.carousel_paging_indicator}/>
      </View>
    </>
  )

  return ui ? render(ui) : null
}

/* styles */
const styles = EStyleSheet.create({
  carousel: {
    flexDirection: "row",
    flexWrap: "nowrap"
  },
  carousel_item: {
    width: "100%"
  },
  carousel_paging: {
    flexDirection: 'row',
    justifyContent: "center",
    marginBottom: 10
  },
  carousel_paging_indicator: {
    backgroundColor: "$primaryColor",
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 5,
    opacity: 0.2
  },
  active: {
    opacity: 1
  },
  value: {
    fontFamily: "TerraCompact-Regular",
    fontSize: 28,
    letterSpacing: -0.5,
    lineHeight: 36,
    color: "#fff",
    marginTop: 10
  },

  small: {
    fontSize: 12,
    letterSpacing: 0
  },
})

export default Columns
