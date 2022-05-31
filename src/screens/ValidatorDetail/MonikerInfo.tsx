import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { DelegateType } from 'lib/post/useDelegate'

import { Text, Number, Button } from 'components'
import { format, useIsClassic, User } from 'lib'
import { COLOR } from 'consts'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { RootStackParams } from 'types'
import { TerraValidator } from 'types/validator'
import { useTranslation } from 'react-i18next'
import { readPercent } from '@terra.kitchen/utils'
import { useDelegation } from '../../qureys/staking'
import { calcSelfDelegation } from '../../qureys/Terra/TerraAPI'

const Top = ({
  data,
  user,
}: {
  data?: TerraValidator
  user?: User
}): ReactElement => {
  const { t } = useTranslation()
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()
  const isClassic = useIsClassic()

  const { data: delegation, ...delegationState } = useDelegation(data?.operator_address)
  const delegationAmount = delegationState?.isSuccess && delegation
    ? delegation?.balance?.amount.toString()
    : "0"

  return (
    <View style={styles.container}>
      <View>
        <View style={{ paddingBottom: 15 }}>
          <Text style={styles.details}>
            {data?.description?.details}
          </Text>
        </View>
        <View style={styles.section}>
          <View style={styles.infoItem}>
            <Text style={styles.infoItemTitle} fontType={'bold'}>
              {t('Page:Staking:Voting power')}
            </Text>
            <Text style={styles.infoItemValue} fontType={'medium'}>
              {readPercent(data?.voting_power_rate)}
            </Text>
            <Number
              {
                ...format.display({
                  amount: data?.delegator_shares,
                  denom: 'uluna'
                })
              }
              numberFontStyle={{
                fontSize: 12,
                lineHeight: 18,
                textAlign: 'center',
              }}
            />
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoItemTitle} fontType={'bold'}>
              {t('Page:Staking:Self-delegation')}
            </Text>
            <Text style={styles.infoItemValue} fontType={'medium'}>
              {readPercent(calcSelfDelegation(data))}
            </Text>
            <Number
              {
                ...format.display({
                  amount: data?.self,
                  denom: 'uluna'
                })
              }
              numberFontStyle={{
                fontSize: 12,
                lineHeight: 18,
                textAlign: 'center',
              }}
            />
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.infoItem}>
            <Text style={styles.infoItemTitle} fontType={'bold'}>
              {t('Page:Staking:Commission')}
            </Text>
            <Text style={styles.infoItemValue} fontType={'medium'}>
              {readPercent(data?.commission?.commission_rates?.rate)}
            </Text>
          </View>
          <View style={styles.infoItem}>
            {
              isClassic && (
                <>
                  <Text style={styles.infoItemTitle} fontType={'bold'}>
                    {t('Page:Staking:Uptime')}
                  </Text>
                  <Text style={styles.infoItemValue} fontType={'medium'}>
                    {readPercent(data?.time_weighted_uptime)}
                  </Text>
                </>
              )
            }
          </View>
        </View>
        {user &&
          (delegationAmount !== '0' ? (
            <View />
          ) : (
            <View style={styles.section}>
              <View
                style={[styles.infoItem, { flexDirection: 'row' }]}
              >
                <Button
                  theme={'sapphire'}
                  disabled={data?.jailed}
                  title={t('Post:Staking:Delegate')}
                  onPress={(): void => {
                    navigate('Delegate', {
                      validatorAddress: data?.operator_address,
                      type: DelegateType.D,
                    })
                  }}
                  containerStyle={{ flex: 1 }}
                />
                <View style={{ width: 10 }} />
                <Button
                  theme={'sapphire'}
                  disabled={data?.jailed}
                  title={'Redelegate'}
                  onPress={(): void => {
                    navigate('Delegate', {
                      validatorAddress: data?.operator_address,
                      type: DelegateType.R,
                    })
                  }}
                  containerStyle={{ flex: 1 }}
                />
              </View>
            </View>
          ))}
      </View>
    </View>
  )
}

export default Top

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomColor: '#edf1f7',
    borderBottomWidth: 1,
    backgroundColor: COLOR.white,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  infoItemTitle: {
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },
  infoItemValue: {
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: 0,
    textAlign: 'center',
  },
  details: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
  },
})
