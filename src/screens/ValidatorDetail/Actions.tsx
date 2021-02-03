import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'

import { User, ValidatorUI } from 'use-station/src'
import { Text, Number, Button } from 'components'
import { useWithdraw } from 'hooks/useWithdraw'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { RootStackParams } from 'types'
import color from 'styles/color'

const Actions = ({
  user,
  ui,
}: {
  user: User
  ui: ValidatorUI
}): ReactElement => {
  const {
    delegate,
    undelegate,
    myDelegations,
    myRewards,
    withdraw,
    operatorAddress,
  } = ui

  const { runWithdraw } = useWithdraw({
    user,
    amounts: myRewards.amounts || [],
    from: operatorAddress.address,
  })

  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  return myDelegations.display ? (
    <View>
      <View style={styles.container}>
        <Text style={styles.title} fontType={'bold'}>
          {myDelegations.title}
        </Text>

        <View style={{ alignItems: 'flex-start' }}>
          <Number
            numberFontStyle={{ fontSize: 20 }}
            decimalFontStyle={{ fontSize: 15 }}
            {...myDelegations.display}
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
          <View style={{ flex: 1, marginRight: 5 }}>
            <Button
              theme={'sapphire'}
              disabled={delegate.disabled}
              title={delegate.children}
              onPress={(): void => {
                navigate('Delegate', {
                  validatorAddress: operatorAddress.address,
                  isUndelegation: false,
                })
              }}
              size="sm"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Button
              theme={'dodgerBlue'}
              disabled={undelegate.disabled}
              title={undelegate.children}
              onPress={(): void => {
                navigate('Delegate', {
                  validatorAddress: operatorAddress.address,
                  isUndelegation: true,
                })
              }}
              size="sm"
            />
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.title} fontType={'bold'}>
          {myRewards.title}
        </Text>

        <View style={{ alignItems: 'flex-start' }}>
          <Number
            numberFontStyle={{ fontSize: 20 }}
            decimalFontStyle={{ fontSize: 15 }}
            {...myRewards.display}
          />
        </View>

        <View style={styles.buttonBox}>
          <Button
            theme={'sapphire'}
            disabled={withdraw.disabled}
            title={withdraw.children}
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
    backgroundColor: color.white,
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
