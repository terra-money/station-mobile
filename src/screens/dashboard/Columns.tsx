import React from 'react'
import { Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { DashboardUI } from '@terra-money/use-native-station'
import { PricesUI, TaxRateUI } from '@terra-money/use-native-station'
import { StakingRatioUI } from '@terra-money/use-native-station'
import { useDashboard } from '@terra-money/use-native-station'
import Card from '../../components/Card'
import DisplaySelector from './DisplaySelector'

const Columns = () => {
  const { navigate } = useNavigation()
  const { ui } = useDashboard()

  const renderPrice = ({ title, display: { value, unit } }: PricesUI) => (
    <Card
      title={title}
      content={[value, unit].join(' ')}
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
        <Text>{content}</Text>
        <Text>({small})</Text>
      </Card>
    )
  }

  const render = (ui: DashboardUI) => (
    <>
      {renderPrice(ui.prices)}
      {renderTaxRate(ui.taxRate)}
      <DisplaySelector {...ui.issuance} />
      <DisplaySelector {...ui.communityPool} />
      {renderStakingRatio(ui.stakingRatio)}
    </>
  )

  return ui ? render(ui) : null
}

export default Columns
