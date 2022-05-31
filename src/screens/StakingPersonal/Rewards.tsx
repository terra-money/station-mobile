import React, { ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'
import _ from 'lodash'

import { format, StakingData, useConfig, User } from 'lib'

import { Button, Number, Text } from 'components'
import { COLOR, UTIL } from 'consts'
import { useWithdraw } from 'hooks/useWithdraw'
import { useDenomTrace } from 'hooks/useDenomTrace'
import { calcRewardsValues } from '../../qureys/distribution'
import { useMemoizedCalcValue } from '../../qureys/oracle'
import { useTranslation } from 'react-i18next'

const Denom = ({
 denom,
}: {
  denom?: string
}): ReactElement => {
  const isIbcDenom = UTIL.isIbcDenom(denom)
  const ibcDenom = useDenomTrace(denom)

  return (
    isIbcDenom ? format.denom(ibcDenom.data?.base_denom) : format.denom(denom)
  )
}

const Rewards = ({
  personal,
  user,
}: {
  personal: StakingData
  user: User
}): ReactElement => {
  const { currency } = useConfig()
  const { t } = useTranslation()
  const { rewards, delegations } = personal

  const calcValue = useMemoizedCalcValue('uluna')

  const rewardsValues = calcRewardsValues(rewards, currency?.current?.key, calcValue)

  const rewardLuna = rewardsValues?.total?.list.find(({ denom }) => denom === "uluna")?.amount ?? "0"

  const { runWithdraw } = useWithdraw({
    user,
    amounts: rewardsValues?.total?.list.map((item) => (format.display(item))),
    validators: delegations?.map(({ validator_address }) => validator_address) ?? [],
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} fontType={'medium'}>
          {t('Page:Staking:Rewards')}
        </Text>
        <Number
          numberFontStyle={{ fontSize: 20, textAlign: 'left' }}
          decimalFontStyle={{ fontSize: 15 }}
          {
            ...format.display({
              amount: rewardLuna,
              denom: 'uluna'
            })
          }
          unit="Luna"
          estimated
          fontType={'medium'}
        />
      </View>
      <View style={{ marginBottom: 8 }}>
        {_.map(rewardsValues?.total?.list, ({ denom, amount }, i) => {
          return (
            <View
              key={`rewards.table.contents-${i}`}
              style={styles.itemBox}
            >
              <Text style={{ paddingRight: 20 }}>
                <Denom denom={denom} />
              </Text>
              <Number
                numberFontStyle={{ fontSize: 14 }}
                decimalFontStyle={{ fontSize: 10.5 }}
              >
                {format.amount(amount)}
              </Number>
            </View>
          )
        })}
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Button
          title={t('Page:Staking:Withdraw all rewards')}
          disabled={!rewardsValues?.total.sum || rewardsValues?.total.sum === 'NaN'}
          theme={'gray'}
          onPress={(): void => {
            runWithdraw()
          }}
          size="sm"
        />
      </View>
    </View>
  )
}

export default Rewards

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingVertical: 20,
    backgroundColor: COLOR.white,
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 35,
    shadowOpacity: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
  },
  itemBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopColor: '#edf1f7',
    borderTopWidth: 1,
  },
})
