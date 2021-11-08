import React, { ReactElement } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import _ from 'lodash'
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native'
import BigNumber from 'bignumber.js'
import { AccAddress } from '@terra-money/terra.js'

import { UTIL, COLOR } from 'consts'

import { Field, DisplayCoin } from 'lib'

import { RootStackParams } from 'types/navigation'

import { schemeUrl } from 'utils/qrCode'
import { parseDynamicLinkURL } from 'utils/scheme'
import usePayload from 'hooks/usePayload'

import Text from './Text'
import Select, { SelectOptionProps } from './Select'
import DefaultFormInput from './FormInput'
import Number from './Number'
import FormLabel from './FormLabel'
import PasteButton from './PasteButton'
import QrCodeButton from './QrCodeButton'
import useTopNoti from 'hooks/useTopNoti'

type FieldButton = {
  label: string
  display: DisplayCoin
  attrs: { onClick: () => void }
}
const FormButton = ({
  button,
}: {
  button: FieldButton
}): ReactElement => {
  const { attrs, display, label } = button
  return (
    <TouchableOpacity
      style={styles.formButtonContainer}
      onPress={attrs.onClick}
    >
      <Text style={styles.formButtonLabel}>{label}:</Text>
      <Number
        numberFontStyle={{
          fontSize: 12,
          color: COLOR.primary._03,
          textDecorationLine: 'underline',
        }}
        fontType="medium"
      >
        {display.value}
      </Number>
    </TouchableOpacity>
  )
}

const FormTextarea = ({ field }: { field: Field }): ReactElement => {
  const { attrs, setValue } = field
  return (
    <View style={{ height: 100 }}>
      <DefaultFormInput
        value={attrs.value}
        defaultValue={attrs.defaultValue}
        editable={!attrs.readOnly}
        multiline
        placeholder={attrs.placeholder}
        secureTextEntry={attrs.type === 'password'}
        style={{
          textAlignVertical: 'top',
        }}
        containerStyle={{
          height: 100,
        }}
        onChangeText={setValue}
      />
    </View>
  )
}

const FormInput = ({ field }: { field: Field }): ReactElement => {
  const { attrs, setValue, error } = field
  const { showNoti } = useTopNoti()
  const onChangeText = (text: string): void => {
    let value = text
    if (field.attrs.type === 'number') {
      const onlyNumber = UTIL.delComma(text)
      const bn = new BigNumber(onlyNumber).dp(6, BigNumber.ROUND_DOWN)
      if (bn.isNaN()) {
        value = ''
      } else if (bn.isGreaterThan(1e15)) {
        value = bn.modulo(1e15).toString(10)
      } else {
        value = text
      }
    }
    setValue?.(value)
  }

  const onPressPasteButton = (value: string): void => {
    setValue && setValue(value)
  }

  const { validSendPayload } = usePayload()
  const { dispatch } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  const dispatchToSend = async (payload: string): Promise<void> => {
    const valid = await validSendPayload(payload)
    if (valid.success) {
      dispatch(StackActions.replace('Send', valid.params))
    } else {
      showNoti({ message: valid.errorMessage, type: 'danger' })
    }
  }

  const onRead = ({ data }: { data: string }): void => {
    const linkUrl = parseDynamicLinkURL(data)
    const payload = linkUrl && linkUrl.searchParams.get('payload')
    const action = linkUrl && linkUrl.searchParams.get('action')
    if (action === 'send' && payload) {
      dispatchToSend(payload)
    } else if (schemeUrl.send.test(data)) {
      const payload = data.replace(schemeUrl.send, '')
      dispatchToSend(payload)
    } else if (AccAddress.validate(data)) {
      setValue?.(data)
    } else {
      showNoti({
        message: 'Not a wallet address QR code.',
        type: 'danger',
      })
    }
  }

  const onlyIfScan = ({ data }: { data: string }): string => {
    const linkUrl = parseDynamicLinkURL(data)
    const readable =
      // if kind of address
      AccAddress.validate(data) ||
      // if dynamic link
      !!linkUrl ||
      // if app scheme
      schemeUrl.send.test(data)
    return readable ? '' : 'Not a wallet address QR code.'
  }

  return (
    <View>
      {attrs.readOnly !== true && attrs.id === 'to' && (
        <View
          style={{
            marginTop: -25,
            marginBottom: 8,
            alignItems: 'flex-end',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <QrCodeButton onRead={onRead} onlyIfScan={onlyIfScan} />
            <View style={{ width: 5 }} />
            <PasteButton onPress={onPressPasteButton} />
          </View>
        </View>
      )}
      <DefaultFormInput
        secureTextEntry={attrs.type === 'password'}
        keyboardType={attrs.type === 'number' ? 'numeric' : 'default'}
        errorMessage={error}
        value={attrs.value}
        defaultValue={attrs.defaultValue}
        editable={!attrs.readOnly}
        placeholder={attrs.placeholder}
        onChangeText={onChangeText}
      />
    </View>
  )
}

const FormSelect = ({ field }: { field: Field }): ReactElement => {
  const { attrs, setValue } = field

  const options: SelectOptionProps[] = _.map(
    field.options?.filter((x) => !x.disabled || x.value === ''),
    (option) => {
      return {
        label: option.children,
        value: option.value,
      }
    }
  )

  return (
    <Select
      disabled={options.length < 1}
      selectedValue={attrs.value || ''}
      onValueChange={(value): void => {
        setValue && setValue(`${value}`)
      }}
      optionList={options}
    />
  )
}

const FormField = ({ field }: { field: Field }): ReactElement => {
  return (
    <>
      <View style={styles.fieldLableBox}>
        {_.some(field.label) && <FormLabel text={field.label} />}
        {field.button && <FormButton button={field.button} />}
      </View>

      <View style={styles.section}>
        {field.element === 'select' && <FormSelect field={field} />}
        {field.element === 'input' && <FormInput field={field} />}
        {field.element === 'textarea' && (
          <FormTextarea field={field} />
        )}
      </View>
    </>
  )
}

export default FormField

const styles = StyleSheet.create({
  fieldLableBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    position: 'relative',
    marginBottom: 20,
  },
  formButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1,
    paddingLeft: 20,
  },
  formButtonLabel: {
    fontSize: 12,
    marginRight: 5,
  },
})
