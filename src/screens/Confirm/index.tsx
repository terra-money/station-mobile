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

import { User, ConfirmProps, DisplayCoin } from 'lib'

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

const Displays = ({
  displays,
}: {
  displays: DisplayCoin[]
}): ReactElement => {
  return (
    <>
      {displays.length > 1 ? (
        _.map(displays, ({ value, unit }, j) => (
          <View
            key={`dispalay-${j}`}
            style={[
              styles.displayItem,
              {
                borderTopRightRadius: j === 0 ? 5 : 0,
                borderTopLeftRadius: j === 0 ? 5 : 0,
                borderBottomLeftRadius:
                  j === displays.length - 1 ? 5 : 0,
                borderBottomRightRadius:
                  j === displays.length - 1 ? 5 : 0,
              },
            ]}
          >
            <Text style={{ fontSize: 12, lineHeight: 16 }}>
              {unit}
            </Text>
            <Number
              numberFontStyle={{
                textAlign: 'left',
                fontSize: 12,
              }}
            >
              {value}
            </Number>
          </View>
        ))
      ) : (
        <View
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
            {displays[0].value}
          </Number>
          <Text style={{ fontSize: 12, lineHeight: 16 }}>
            {' '}
            {displays[0].unit}
          </Text>
        </View>
      )}
    </>
  )
}

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
  const { contents, fee, form, result, txhash } = getComfirmData({
    confirm,
    user,
  })
  const [pressedNextButton, setPressedNextButton] = useState(false)
  // form.fields must have password
  const formPassword = _.find(
    form.fields,
    (x) => x.attrs.id === 'password'
  )
  const [isUseBioAuth, setIsUseBioAuth] = useState(false)
  const [initPageComplete, setinitPageComplete] = useState(false)

  const options = fee.select.options || []

  const onPressNextButton = async (): Promise<void> => {
    setPressedNextButton(true)
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
    setPressedNextButton(false)
  }

  // during form is submitting, show loading
  useEffect(() => {
    txhash && showLoading({ txhash })
  }, [txhash])

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
      hideLoading()
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
                {displays && <Displays displays={displays} />}
                {_.some(text) && (
                  <Text style={{ fontSize: 16, lineHeight: 24 }}>
                    {text}
                  </Text>
                )}
              </View>
            )
          })}

          <FormLabel text={fee.label} />
          {_.some(fee.status) ? (
            <View style={{ paddingBottom: 20 }}>
              <Text>{fee.status}</Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', paddingBottom: 20 }}>
              <View style={{ width: 100, marginRight: 10 }}>
                <Select
                  selectedValue={fee.select.attrs.value || ''}
                  onValueChange={(value): void => {
                    fee.select.setValue(`${value}`)
                  }}
                  optionList={_.map(options, (option) => ({
                    label: option.children,
                    value: option.value,
                    disabled: option.disabled,
                  }))}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  paddingLeft: 0,
                }}
              >
                <Input
                  editable={false}
                  value={fee.input.attrs.value}
                />
              </View>
            </View>
          )}

          {_.map(form.errors, (error, i) => (
            <WarningBox key={`errors-${i}`} message={error} />
          ))}
        </View>

        <Button
          theme={'sapphire'}
          disabled={
            pressedNextButton ||
            form.disabled ||
            _.isEmpty(options) ||
            false === initPageComplete
          }
          title={'Confirm'}
          onPress={onPressNextButton}
          containerStyle={{ marginTop: 20, marginBottom: 40 }}
        />
      </Body>
    </>
  )
}

const Confirm = (props: Props): ReactElement => {
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

Confirm.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default Confirm

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  displayItem: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: '#edf1f7',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 1,
  },
})
