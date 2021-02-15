import React, { ReactElement, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { StackScreenProps } from '@react-navigation/stack'
import { useRecoilValue } from 'recoil'
import {
  NavigationProp,
  StackActions,
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
import { getBioAuthPassword, getIsUseBioAuth } from 'utils/storage'
import { authenticateBiometric } from 'utils/bio'
import { useAlert } from 'hooks/useAlert'
import { useLoading } from 'hooks/useLoading'

type Props = StackScreenProps<RootStackParams, 'Confirm'>

const INIT_PASSWORD = '1'

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
  const { confirm: confirmAlert } = useAlert()
  const { showLoading, hideLoading } = useLoading()
  const { getComfirmData, initConfirm } = useConfirm()
  const { contents, fee, form, result } = getComfirmData({
    confirm,
    user,
  })
  // form.fields must have password
  const formPassword = _.find(
    form.fields,
    (x) => x.attrs.id === 'password'
  )
  const [isUseBioAuth, setIsUseBioAuth] = useState(false)
  const [initPageComplete, setinitPageComplete] = useState(false)
  const onPressNextButton = async (): Promise<void> => {
    if (isUseBioAuth) {
      const isSuccess = await authenticateBiometric()
      if (isSuccess) {
        const password = await getBioAuthPassword({
          walletName: user.name || '',
        })

        if (formPassword?.setValue) {
          formPassword.setValue(password)
        }
      } else {
        confirmAlert({
          desc: 'Would you like to confirm with your password?',
          onPressConfirm: () => {
            navigate('ConfirmPassword', {
              feeSelectValue: fee.select.attrs.value || '',
            })
          },
        })
      }
    } else {
      navigate('ConfirmPassword', {
        feeSelectValue: fee.select.attrs.value || '',
      })
    }
  }

  // during form is submitting, show loading
  useEffect(() => {
    form.submitting ? showLoading() : hideLoading()
  }, [form.submitting])

  // only password change from bio-auth, except init
  useEffect(() => {
    const password = formPassword?.attrs.value
    if (password && password !== INIT_PASSWORD && form.onSubmit) {
      form.onSubmit()
    }
  }, [formPassword?.attrs.value])

  // result will set after form.onSubmit or error
  useEffect(() => {
    if (result) {
      dispatch(StackActions.popToTop())
      navigate('Complete', { result })
      initConfirm()
    }
  }, [result])

  const initPage = async (): Promise<void> => {
    formPassword?.setValue && formPassword.setValue(INIT_PASSWORD)
    setIsUseBioAuth(await getIsUseBioAuth())
    setinitPageComplete(true)
  }

  useEffect(() => {
    initPage()
  }, [])

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
                    <Number
                      numberFontStyle={{
                        textAlign: 'left',
                      }}
                    >
                      {value}
                    </Number>
                    <Text style={{ fontSize: 12, lineHeight: 16 }}>
                      {' '}
                      {unit}
                    </Text>
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
          disabled={form.disabled || false === initPageComplete}
          title={'Next'}
          onPress={onPressNextButton}
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
