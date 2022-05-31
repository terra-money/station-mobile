import React, { ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'
import { COLOR } from 'consts'
import { format } from 'lib'
import { Text, ExtLink } from 'components'
import { TerraValidator } from 'types/validator'
import { useTranslation } from 'react-i18next'
import { AccAddress } from '@terra-money/terra.js'
import { readPercent } from '@terra.kitchen/utils'
import useFinder from 'lib/hooks/useFinder'

const Informations = ({ data }: { data: TerraValidator }): ReactElement => {
  const { t } = useTranslation()
  const getLink = useFinder()

  const operatorLink = (
    <ExtLink
      url={getLink?.({ q: 'validator', v: data?.operator_address }) || ''}
      title={data?.operator_address}
      textStyle={{ color: COLOR.primary._03 }}
    />
  )
  const accountLink = (
    <ExtLink
      url={getLink?.({ q: 'account', v: AccAddress.fromValAddress(data?.operator_address) }) || ''}
      title={AccAddress.fromValAddress(data?.operator_address)}
      textStyle={{ color: COLOR.primary._03 }}
    />
  )
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.title} fontType={'bold'}>
          {t('Page:Staking:Operator address')}
        </Text>
          {data?.operator_address && operatorLink}
      </View>
      <View style={styles.item}>
        <Text style={styles.title} fontType={'bold'}>
          {t('Page:Staking:Account address')}
        </Text>
          {data?.operator_address && accountLink}
      </View>
      <View style={styles.item}>
        <Text style={styles.title} fontType={'bold'}>
          {t('Page:Staking:Max commission rate')}
        </Text>
        <Text style={styles.value}>
          {readPercent(data?.commission?.commission_rates.max_rate)}
        </Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.title} fontType={'bold'}>
          {t('Page:Staking:Max daily commission change')}
        </Text>
        <Text style={styles.value}>
          {readPercent(data?.commission?.commission_rates.max_change_rate)}
        </Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.title} fontType={'bold'}>
          {t('Page:Staking:Last commission change')}
        </Text>
        <Text style={styles.value}>
          {format.date(data?.commission?.update_time)}
        </Text>
      </View>
    </View>
  )
}

export default Informations

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomColor: '#edf1f7',
    borderBottomWidth: 1,
    backgroundColor: COLOR.sky,
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
