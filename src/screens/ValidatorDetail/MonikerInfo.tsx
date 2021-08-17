import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { DelegateType } from 'use-station/src/post/useDelegate'

import { Text, Number, Button } from 'components'
import { User, ValidatorUI } from 'use-station/src'
import color from 'styles/color'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { RootStackParams } from 'types'

const Top = ({
  ui,
  user,
}: {
  ui: ValidatorUI
  user?: User
}): ReactElement => {
  const {
    details,
    uptime,
    votingPower,
    selfDelegation,
    commission,
    delegate,
    redelegate,
    myDelegations,
    operatorAddress,
  } = ui

  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()
  return (
    <View style={styles.container}>
      <View>
        {_.some(details) && (
          <View style={{ paddingBottom: 15 }}>
            <Text style={styles.details}>{details}</Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.infoItem}>
            <Text style={styles.infoItemTitle} fontType={'bold'}>
              {votingPower.title}
            </Text>
            <Text style={styles.infoItemValue} fontType={'medium'}>
              {votingPower.percent}
            </Text>
            <Number
              {...votingPower.display}
              numberFontStyle={{
                fontSize: 12,
                lineHeight: 18,
                textAlign: 'center',
              }}
            />
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoItemTitle} fontType={'bold'}>
              {selfDelegation.title}
            </Text>
            <Text style={styles.infoItemValue} fontType={'medium'}>
              {selfDelegation.percent}
            </Text>
            <Number
              {...selfDelegation.display}
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
              {commission.title}
            </Text>
            <Text style={styles.infoItemValue} fontType={'medium'}>
              {commission.percent}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoItemTitle} fontType={'bold'}>
              {uptime.title}
            </Text>
            <Text style={styles.infoItemValue} fontType={'medium'}>
              {uptime.percent}
            </Text>
          </View>
        </View>
        {user &&
          (myDelegations.display ? (
            <View />
          ) : (
            <View style={styles.section}>
              <View
                style={[styles.infoItem, { flexDirection: 'row' }]}
              >
                <Button
                  theme={'sapphire'}
                  disabled={delegate.disabled}
                  title={delegate.children}
                  onPress={(): void => {
                    navigate('Delegate', {
                      validatorAddress: operatorAddress.address,
                      type: DelegateType.D,
                    })
                  }}
                  containerStyle={{ flex: 1 }}
                />
                <View style={{ width: 10 }} />
                <Button
                  theme={'sapphire'}
                  disabled={redelegate.disabled}
                  title={redelegate.children}
                  onPress={(): void => {
                    navigate('Delegate', {
                      validatorAddress: operatorAddress.address,
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
    backgroundColor: color.white,
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
