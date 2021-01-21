import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { ValidatorUI } from 'use-station/src'
import ExtLink from 'components/ExtLink'
import Text from 'components/Text'

const Informations = (v: ValidatorUI): ReactElement => {
  const { accountAddress, operatorAddress } = v
  const { maxRate, maxChangeRate, delegationReturn, updateTime } = v

  const link = (
    <ExtLink
      url={accountAddress.link || ''}
      title={accountAddress.address}
    />
  )

  const list = [
    { label: operatorAddress.title, value: operatorAddress.address },
    { label: accountAddress.title, value: link },
    { label: maxRate.title, value: maxRate.percent },
    { label: maxChangeRate.title, value: maxChangeRate.percent },
    {
      label: delegationReturn.title,
      value: delegationReturn.percent,
    },
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
