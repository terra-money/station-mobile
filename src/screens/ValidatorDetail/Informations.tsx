import React, { ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'
import _ from 'lodash'

import { ValidatorUI } from 'lib'
import { Text, ExtLink } from 'components'
import color from 'styles/color'

const Informations = (v: ValidatorUI): ReactElement => {
  const { accountAddress, operatorAddress } = v
  const { maxRate, maxChangeRate, updateTime } = v

  const link = (
    <ExtLink
      url={accountAddress.link || ''}
      title={accountAddress.address}
      textStyle={{ color: color.dodgerBlue }}
    />
  )

  const list = [
    { label: operatorAddress.title, value: operatorAddress.address },
    { label: accountAddress.title, value: link },
    { label: maxRate.title, value: maxRate.percent },
    { label: maxChangeRate.title, value: maxChangeRate.percent },
    { label: updateTime.title, value: updateTime.date },
  ]

  return (
    <View style={styles.container}>
      {_.map(list, ({ label, value }) => (
        <View key={label} style={styles.item}>
          <Text style={styles.title} fontType={'bold'}>
            {label}
          </Text>
          {typeof value === 'string' ? (
            <Text style={styles.value}>{value}</Text>
          ) : (
            value
          )}
        </View>
      ))}
    </View>
  )
}

export default Informations

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomColor: '#edf1f7',
    borderBottomWidth: 1,
    backgroundColor: color.sky,
  },
  item: {
    marginBottom: 25,
  },
  title: {
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },
  value: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.2,
  },
})
