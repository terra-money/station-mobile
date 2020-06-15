import React from 'react'
import { View, Text } from 'react-native'
import { ValidatorUI } from '@terra-money/use-native-station'
import ExtLink from '../../components/ExtLink'

const Informations = (v: ValidatorUI) => {
  const { accountAddress, operatorAddress } = v
  const { maxRate, maxChangeRate, delegationReturn, updateTime } = v

  const link = (
    <ExtLink href={accountAddress.link}>{accountAddress.address}</ExtLink>
  )

  const list = [
    { label: operatorAddress.title, value: operatorAddress.address },
    { label: accountAddress.title, value: link },
    { label: maxRate.title, value: maxRate.percent },
    { label: maxChangeRate.title, value: maxChangeRate.percent },
    { label: delegationReturn.title, value: delegationReturn.percent },
    { label: updateTime.title, value: updateTime.date },
  ]

  return (
    <>
      {list.map(({ label, value }) => (
        <View key={label}>
          <Text>{label}</Text>
          <Text>{value}</Text>
        </View>
      ))}
    </>
  )
}

export default Informations
