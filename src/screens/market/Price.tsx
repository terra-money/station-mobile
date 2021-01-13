import React, { ReactElement } from 'react'
import {
  PriceUI,
  Filter,
  usePrice,
  format,
} from '@terra-money/use-native-station'

import Card from '../../components/Card'
import Number from '../../components/Number'
import Picker from '../../components/Picker'
import Variation from './Variation'

const Price = ({ actives }: { actives: string[] }): ReactElement => {
  const { title, filter, ui, ...api } = usePrice(actives)
  const { denom, interval } = filter

  const renderFilter = ({
    value,
    set,
    options,
  }: Filter): ReactElement => (
    <>
      {!!options.length && (
        <Picker value={value} onChange={set} options={options} />
      )}
    </>
  )

  const render = ({ price, variation }: PriceUI): ReactElement => (
    <>
      <Number>{format.decimal(String(price))}</Number>
      <Variation variation={variation} showPercent />
    </>
  )

  return (
    <Card {...api} title={title}>
      {ui && render(ui)}
      {denom && renderFilter(denom)}
      {interval && renderFilter(interval)}
    </Card>
  )
}

export default Price
