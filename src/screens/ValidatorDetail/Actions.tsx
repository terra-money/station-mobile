import React, { ReactElement, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { format, gte, useConfig, User, useStaking } from 'lib'
import { Text, Number, Button } from 'components'
import { useWithdraw } from 'hooks/useWithdraw'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { RootStackParams } from 'types'
import { COLOR } from 'consts'
import { DelegateType } from 'lib/post/useDelegate'
import { TerraValidator } from 'types/validator'
import { useMemoizedCalcValue } from '../../qureys/oracle'
import { calcRewardsValues } from '../../qureys/distribution'
import { getAvailableStakeActions, StakeAction, useDelegation } from '../../qureys/staking'
import { useTranslation } from 'react-i18next'

const Actions = ({
  user,
  data,
}: {
  user: User
  data?: TerraValidator
}): ReactElement => {
  const { currency } = useConfig()
  const { t } = useTranslation()

  const { personal } = useStaking()
  const { rewards, delegations } = personal

  const calcValue = useMemoizedCalcValue()

  const rewardsValues = useMemo(() => {
    const defaultValues = { address: data?.operator_address, sum: "0", list: [] }
    if (!rewards) return defaultValues
    const { byValidator } = calcRewardsValues(rewards, currency.current.key, calcValue)
    const values = byValidator.find(({ address }) => address === data?.operator_address)
    return values ?? defaultValues
  }, [calcValue, currency, data?.operator_address, rewards])

  const { runWithdraw } = useWithdraw({
    user,
    amounts: rewardsValues?.list.map((item) => (format.display(item))) || [],
    validators: [data?.operator_address],
  })

  const { data: delegation, ...delegationState } = useDelegation(data?.operator_address)
  const delegationAmount = delegationState.isSuccess && delegation
      ? delegation.balance.amount.toString()
      : "0"

  const delegationValue = calcValue({ amount: delegationAmount, denom: "uluna" })
  const availableActions = getAvailableStakeActions(data?.operator_address, delegations)

  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  return delegation ? (
    <View>
      <View style={styles.container}>
        <Text style={styles.title} fontType={'bold'}>
          {t('Page:Staking:My delegations')}
        </Text>

        <View style={{ alignItems: 'flex-start' }}>
          <Number
            numberFontStyle={{ fontSize: 20, textAlign: 'left' }}
            decimalFontStyle={{ fontSize: 15 }}
            {
              ...format.display({
                amount: delegationValue,
                denom: 'uluna'
              })
            }
          />
        </View>

        <View
          style={[
            styles.buttonBox,
            {
              flexDirection: 'row',
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Button
              theme={'sapphire'}
              disabled={!availableActions[StakeAction.DELEGATE]}
              title={t('Post:Staking:Delegate')}
              onPress={(): void => {
                navigate('Delegate', {
                  validatorAddress: data?.operator_address,
                  type: DelegateType.D,
                })
              }}
              size="sm"
            />
          </View>
          <View style={{ flex: 1, marginHorizontal: 5 }}>
            <Button
              theme={'sapphire'}
              disabled={!availableActions[StakeAction.REDELEGATE]}
              title={'Redelegate'}
              onPress={(): void => {
                navigate('Delegate', {
                  validatorAddress: data?.operator_address,
                  type: DelegateType.R,
                })
              }}
              size="sm"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              theme={'dodgerBlue'}
              disabled={!availableActions[StakeAction.UNBOND]}
              title={t('Post:Staking:Undelegate')}
              onPress={(): void => {
                navigate('Delegate', {
                  validatorAddress: data?.operator_address,
                  type: DelegateType.U,
                })
              }}
              size="sm"
            />
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.title} fontType={'bold'}>
          {t('Page:Staking:My rewards')}
        </Text>

        <View style={{ alignItems: 'flex-start' }}>
          <Number
            numberFontStyle={{ fontSize: 20, textAlign: 'left' }}
            decimalFontStyle={{ fontSize: 15 }}
            {
              ...format.display({
                amount: rewardsValues?.sum,
                denom: 'uluna'
              })
            }
          />
        </View>

        <View style={styles.buttonBox}>
          <Button
            theme={'sapphire'}
            disabled={!(rewardsValues && gte(rewardsValues.sum, 1))}
            title={t('Post:Staking:Withdraw')}
            onPress={(): void => {
              runWithdraw()
            }}
            size="sm"
          />
        </View>
      </View>
    </View>
  ) : (
    <View />
  )
}

export default Actions

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomColor: '#edf1f7',
    borderBottomWidth: 1,
    backgroundColor: COLOR.white,
  },
  title: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    marginBottom: 5,
  },
  buttonBox: {
    marginTop: 20,
    marginBottom: 10,
  },
})
