import React, { ReactElement, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { StackScreenProps } from '@react-navigation/stack'
import { RawKey } from '@terra-money/terra.js'
import { useRecoilValue } from 'recoil'

import { User, ConfirmProps, useConfirm } from 'use-station/src'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import Text from 'components/Text'
import WithAuth from 'components/layout/WithAuth'
import UseStationForm from 'components/UseStationForm'
import Button from 'components/Button'
import Select from 'components/Select'
import FormLabel from 'components/FormLabel'
import Number from 'components/Number'
import SwapStore from 'stores/SwapStore'
import { getDecyrptedKey } from 'utils/wallet'

import { RootStackParams } from 'types/navigation'

// @ts-ignore
import getSigner from 'utils/wallet-helper/signer'
// @ts-ignore
import signTx from 'utils/wallet-helper/api/signTx'
import Input from 'components/Input'
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native'
import WarningBox from 'components/WarningBox'

type Props = StackScreenProps<RootStackParams, 'SwapConfirm'>

const Render = ({
  user,
  confirm,
}: {
  user: User
  confirm: ConfirmProps
} & Props): ReactElement => {
  const { navigate, dispatch } = useNavigation<
    NavigationProp<RootStackParams>
  >()
  const { contents, fee, form, result } = useConfirm(confirm, {
    user,
    password: '',
    sign: async ({ tx, base, password }) => {
      const decyrptedKey = await getDecyrptedKey(
        user.name || '',
        password
      )
      if (_.isEmpty(decyrptedKey)) {
        throw new Error('Incorrect password')
      }
      const rk = new RawKey(Buffer.from(decyrptedKey, 'hex'))
      const signer = await getSigner(rk.privateKey, rk.publicKey)
      const signedTx = await signTx(tx, signer, base)
      return signedTx
    },
  })
  useEffect(() => {
    if (result) {
      dispatch(StackActions.popToTop())
      navigate('Complete', {
        result,
        confirmNavigateTo: 'Swap',
      })
    }
  }, [result])

  return (
    <>
      <SubHeader theme={'blue'} title={form.title} />
      <Body
        theme={'sky'}
        scrollable
        containerStyle={{
          paddingTop: 20,
          justifyContent: 'space-between',
          paddingBottom: 40,
        }}
      >
        <View>
          {_.map(contents, ({ name, displays, text }, i) => {
            return (
              <View key={`dispalay-${i}`} style={styles.section}>
                <FormLabel text={name} />
                {_.map(displays, ({ value, unit }, j) => (
                  <View
                    key={`dispalay-${j}`}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                    }}
                  >
                    <Number>{value}</Number>
                    <Text>{unit}</Text>
                  </View>
                ))}
                {_.some(text) && (
                  <Input editable={false} value={text} />
                )}
              </View>
            )
          })}

          <FormLabel text={fee.label} />
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: 100, marginRight: 10 }}>
              <Select
                onValueChange={(value): void => {
                  fee.select.setValue(`${value}`)
                }}
                optionList={_.map(fee.select.options, (option) => ({
                  label: option.children,
                  value: option.value,
                }))}
              />
            </View>
            <View
              style={{
                flex: 1,
                paddingLeft: 17,
              }}
            >
              <Input editable={false} value={fee.input.attrs.value} />
            </View>
          </View>

          <UseStationForm form={form} />
          {_.map(form.errors, (error, i) => (
            <WarningBox key={`errors-${i}`} message={error} />
          ))}
        </View>

        <Button
          theme={'blue'}
          disabled={form.disabled}
          title={form.submitLabel}
          onPress={form.onSubmit}
          containerStyle={{ marginTop: 20 }}
        />
      </Body>
    </>
  )
}

const Screen = (props: Props): ReactElement => {
  const confirm = useRecoilValue(SwapStore.confirm)

  return (
    <WithAuth>
      {(user): ReactElement => (
        <>
          {confirm ? (
            <Render {...{ ...props, user, confirm }} />
          ) : null}
        </>
      )}
    </WithAuth>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'blue',
})

export default Screen

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
})
