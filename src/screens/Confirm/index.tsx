import React, { ReactElement, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { StackScreenProps } from '@react-navigation/stack'
import { useRecoilValue } from 'recoil'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'

import { User, ConfirmProps } from 'use-station/src'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import WithAuth from 'components/layout/WithAuth'
import {
  Text,
  Button,
  Select,
  FormLabel,
  Number,
  Input,
  WarningBox,
} from 'components'

import { RootStackParams } from 'types/navigation'
import { useConfirm } from 'hooks/useConfirm'
import ConfirmStore from 'stores/ConfirmStore'

type Props = StackScreenProps<RootStackParams, 'Confirm'>

const Render = ({
  user,
  confirm,
}: {
  user: User
  confirm: ConfirmProps
} & Props): ReactElement => {
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  const { getComfirmData } = useConfirm()
  const { contents, fee, form } = getComfirmData({ confirm, user })

  // To ignore password validation.
  // form.fields must have password
  useEffect(() => {
    if (form) {
      const formPassword = _.find(
        form.fields,
        (x) => x.attrs.id === 'password'
      )
      if (formPassword?.setValue) {
        formPassword.setValue('1')
      }
    }
  }, [form])

  return (
    <>
      <SubHeader theme={'sapphire'} title={form.title} />
      <Body
        theme={'sky'}
        scrollable
        containerStyle={{
          paddingTop: 20,
          justifyContent: 'space-between',
          marginBottom: 40,
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
                    <Text style={{ fontSize: 12, lineHeight: 16 }}> {unit}</Text>
                  </View>
                ))}
                {_.some(text) && (
                  <Text style={{ fontSize: 16, lineHeight: 24 }}>
                    {text}
                  </Text>
                )}
              </View>
            )
          })}

          <FormLabel text={fee.label} />
          <View style={{ flexDirection: 'row', paddingBottom: 20 }}>
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
                paddingLeft: 0,
              }}
            >
              <Input editable={false} value={fee.input.attrs.value} />
            </View>
          </View>
          {_.map(form.errors, (error, i) => (
            <WarningBox key={`errors-${i}`} message={error} />
          ))}
        </View>

        <Button
          theme={'sapphire'}
          disabled={form.disabled}
          title={'Next'}
          onPress={(): void => {
            navigate('ConfirmPassword', {
              feeSelectValue: fee.select.attrs.value || '',
            })
          }}
          containerStyle={{ marginTop: 20 }}
        />
      </Body>
    </>
  )
}

const Screen = (props: Props): ReactElement => {
  const confirm = useRecoilValue(ConfirmStore.confirm)

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
  theme: 'sapphire',
})

export default Screen

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
})
