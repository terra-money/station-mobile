import React, { ReactElement, useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import _ from 'lodash'

import Tooltip from 'react-native-walkthrough-tooltip'

import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import Body from 'components/layout/Body'
import WithAuth from 'components/layout/WithAuth'
import {
  ConfirmProps,
  Field,
  FormUI,
  SwapUI,
  useMarket,
  User,
  useSwap,
} from 'use-station/src'
import { StackScreenProps } from '@react-navigation/stack'

import ErrorComponent from 'components/ErrorComponent'
import Input from 'components/Input'
import {
  Text,
  Icon,
  Number,
  Button,
  Loading,
  SelectOptionProps,
  Select,
} from 'components'

import color from 'styles/color'
import { useConfirm } from 'hooks/useConfirm'
import { RootStackParams } from 'types'
import layout from 'styles/layout'

type Props = StackScreenProps<RootStackParams, 'Swap'>

const SwapTypeSelect = ({
  field,
}: {
  field: Field
}): ReactElement => {
  const { attrs, setValue } = field
  const options: SelectOptionProps[] = _.map(
    field.options?.filter((x) => !x.disabled),
    (option) => {
      return {
        label: option.children,
        value: option.value,
      }
    }
  )
  return (
    <>
      {!field.attrs.hidden && (
        <Select
          disabled={options.length < 1}
          selectedValue={attrs.value}
          onValueChange={(value): void => {
            setValue && setValue(`${value}`)
          }}
          optionList={options}
          containerStyle={{ height: 30, paddingLeft: 0 }}
        />
      )}
    </>
  )
}

const SelectInputForm = ({
  selectField,
  inputField,
}: {
  selectField: Field
  inputField: Field
}): ReactElement => {
  const options: SelectOptionProps[] = _.map(
    selectField.options?.filter((x) => !x.disabled),
    (option) => {
      return {
        label: option.children,
        value: option.value,
      }
    }
  )
  return (
    <View
      style={{
        flexDirection: 'row',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#cfd8ea',
      }}
    >
      <Select
        disabled={options.length < 1}
        selectedValue={selectField.attrs.value}
        onValueChange={(value): void => {
          selectField.setValue && selectField.setValue(`${value}`)
        }}
        optionList={options}
        containerStyle={{
          flex: layout.getScreenWideType() === 'narrow' ? 3 : 2,
          borderWidth: 0,
        }}
      />
      <Input
        value={inputField.attrs.value}
        defaultValue={inputField.attrs.defaultValue}
        editable={!inputField.attrs.readOnly}
        placeholder={inputField.attrs.placeholder}
        onChangeText={inputField.setValue}
        containerStyle={{ flex: 3, borderWidth: 0 }}
        style={{
          borderRadius: 0,
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
        }}
      />
    </View>
  )
}

const Render = ({
  form,
  title,
  ui,
  confirm,
}: {
  form: FormUI
  title: string
  ui: SwapUI
  confirm?: ConfirmProps
}): ReactElement => {
  const { fields, submitLabel, onSubmit } = form
  const { max, spread } = ui

  const [
    isVisibleSpreadTooltip,
    setisVisibleSpreadTooltip,
  ] = useState(false)

  const { navigateToConfirm } = useConfirm()

  return (
    <View style={styles.swapForm}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={styles.swapTitle} fontType={'bold'}>
            {title}
          </Text>
        </View>

        <View style={{ flex: 1, maxWidth: 160 }}>
          {/* fields[4] : Swap option between default and terraswap */}
          <SwapTypeSelect field={fields[4]} />
        </View>
      </View>

      <View>
        <TouchableOpacity
          onPress={max.attrs.onClick}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 5,
          }}
        >
          <Text style={{ fontSize: 12, paddingRight: 5 }}>
            {max.title}
          </Text>
          <Number numberFontStyle={{ fontSize: 12 }}>
            {max.display.value}
          </Number>
        </TouchableOpacity>
      </View>

      <SelectInputForm
        selectField={fields[0]}
        inputField={fields[1]}
      />
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Icon size={24} color={color.sapphire} name={'swap-vert'} />
      </View>
      <SelectInputForm
        selectField={fields[2]}
        inputField={fields[3]}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 30,
        }}
      >
        <Tooltip
          isVisible={isVisibleSpreadTooltip}
          content={<Text>{spread.text}</Text>}
          placement="top"
          onClose={(): void => setisVisibleSpreadTooltip(false)}
        >
          <TouchableOpacity
            onPress={(): void => setisVisibleSpreadTooltip(true)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text>{spread.title}</Text>
            <Icon name={'info'} color={color.sapphire} size={14} />
          </TouchableOpacity>
        </Tooltip>
        <Text>{spread.value}</Text>
      </View>
      <Button
        theme={'sapphire'}
        disabled={form.disabled}
        title={submitLabel}
        onPress={(): void => {
          onSubmit && onSubmit()
          confirm && navigateToConfirm({ confirm })
        }}
      />
    </View>
  )
}

const RenderSwap = ({
  actives,
  user,
  title,
}: {
  actives: string[]
  user: User
  title: string
}): ReactElement => {
  const { error, loading, form, confirm, ui } = useSwap(user, actives)

  return (
    <>
      {error ? (
        <ErrorComponent card />
      ) : loading ? (
        <Loading />
      ) : (
        ui &&
        form && (
          <Render
            form={form}
            title={title}
            ui={ui}
            confirm={confirm}
          />
        )
      )}
    </>
  )
}

const RenderMarket = ({ user }: { user: User }): ReactElement => {
  const { error, loading, ui, swap } = useMarket()

  return (
    <>
      {error ? (
        <ErrorComponent card />
      ) : loading ? (
        <Loading />
      ) : (
        ui && (
          <RenderSwap
            {...{ actives: ui.actives, user, title: swap }}
          />
        )
      )}
    </>
  )
}

const Screen = ({ navigation }: Props): ReactElement => {
  const [refreshing, setRefreshing] = useState(false)
  const refreshPage = async (): Promise<void> => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 100)
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      refreshPage()
    })
  }, [])

  return (
    <WithAuth>
      {(user): ReactElement => (
        <Body theme={'sky'} scrollable onRefresh={refreshPage}>
          {refreshing ? null : <RenderMarket user={user} />}
        </Body>
      )}
    </WithAuth>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  title: 'Swap',
})

export default Screen

const styles = StyleSheet.create({
  swapForm: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
  },
  swapTitle: {
    fontSize: 16,
  },
})
