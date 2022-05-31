import React, { ReactElement } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import { format, StakingData, StakingPersonal, useAuth, useConfig } from 'lib'

import { Button, Icon, Number, Text } from 'components'
import { COLOR } from 'consts'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { RootStackParams } from 'types'
import { useWithdraw } from 'hooks/useWithdraw'
import { calcDelegationsTotal, calcUnbondingsTotal } from '../../qureys/staking'
import { calcRewardsValues } from '../../qureys/distribution'
import { useTranslation } from 'react-i18next'
import { useMemoizedCalcValue } from '../../qureys/oracle'

const NotStaked = (): ReactElement => {
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
          onPress={(): void => {
            navigate('StakingInformation')
          }}
        >
          <Text style={styles.headerTitle} fontType={'bold'}>
            Staking rewards
          </Text>
          <Icon
            color={COLOR.primary._02}
            name={'info'}
            size={16}
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      </View>
      <Text style={{ lineHeight: 21, marginTop: -15 }}>
        {
          "You haven't staked any assets yet. Stake Luna to start earning rewards."
        }
      </Text>
    </>
  )
}

const PersonalSummary = ({
  personal,
}: {
  personal: StakingData
}): ReactElement => {
  const {
    delegations,
    unbondings,
    rewards,
  } = personal
  const { user } = useAuth()
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()
  const { t } = useTranslation()
  const { currency } = useConfig()

  const calcValue = useMemoizedCalcValue('uluna')

  const delegationTotal = calcDelegationsTotal(delegations)
  const unbondingsTotal = calcUnbondingsTotal(unbondings)

  const { total } = calcRewardsValues(rewards, currency.current.key, calcValue)
  const rewardLuna = total?.list?.find(({ denom }) => denom === "uluna")?.amount ?? "0"

  const { runWithdraw } = useWithdraw({
    user,
    amounts: total?.list?.map((item) => (format.display(item))),
    validators: delegations?.map(({ validator_address }) => validator_address) ?? [],
  })

  return (
    <View style={styles.container}>
      {(delegationTotal !== '0' || rewardLuna !== '0' || unbondingsTotal !== 'NaN') ? (
        <>
          <TouchableOpacity
            onPress={(): void => {
              navigate('StakingPersonal')
            }}
            style={styles.header}
          >
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.headerTitle} fontType={'bold'}>
                Summary
              </Text>
            </View>
            <Icon
              name={'arrow-forward'}
              color={COLOR.primary._02}
              size={24}
            />
          </TouchableOpacity>
          <View style={{ marginBottom: 10 }}>
            {rewardLuna && (
              <View style={styles.itemBox}>
                <Text style={{ paddingRight: 20 }}>
                  {t('Page:Staking:Rewards')}
                </Text>
                <Number
                  numberFontStyle={{ fontSize: 14 }}
                  decimalFontStyle={{ fontSize: 10.5 }}
                  {
                    ...format.display({
                      amount: rewardLuna,
                      denom: 'uluna'
                    })
                  }
                  unit="Luna"
                  estimated
                />
              </View>
            )}
            {delegationTotal && (
              <View style={styles.itemBox}>
                <Text style={{ paddingRight: 20 }}>
                  {'Delegated'}
                </Text>
                <Number
                  numberFontStyle={{ fontSize: 14 }}
                  decimalFontStyle={{ fontSize: 10.5 }}
                  {
                    ...format.display({
                      amount: delegationTotal,
                      denom: 'uluna'
                    })
                  }
                  unit="Luna"
                />
              </View>
            )}
            { (unbondingsTotal && unbondingsTotal !== 'NaN') && (
              <View style={styles.itemBox}>
                <Text style={{ paddingRight: 20 }}>
                  {'Undelegated'}
                </Text>
                <Number
                  numberFontStyle={{ fontSize: 14 }}
                  decimalFontStyle={{ fontSize: 10.5 }}
                  {
                    ...format.display({
                      amount: unbondingsTotal,
                      denom: 'uluna'
                    })
                  }
                  unit="Luna"
                />
              </View>
            )}
          </View>

          <Button
            title={t('Page:Staking:Withdraw all rewards')}
            disabled={!total.sum || total.sum === 'NaN'}
            theme={'gray'}
            onPress={(): void => {
              runWithdraw()
            }}
            size="sm"
          />
        </>
      ) : (
        <NotStaked />
      )}
    </View>
  )
}

export default PersonalSummary

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 20,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  itemBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  undelegated: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
  },
})
