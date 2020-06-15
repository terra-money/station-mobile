import React from 'react'
import { DisplayCoin } from '@terra-money/use-native-station'
import Number from './Number'

interface Props {
  list: DisplayCoin[]
  integer?: boolean
}

const Displays = ({ list, integer }: Props) => {
  const renderItem = (d: DisplayCoin, i: number) => (
    <Number {...d} integer={integer} key={i} />
  )

  return <>{list.map(renderItem)}</>
}

export default Displays
