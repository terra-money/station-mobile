import React, { ReactElement, useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import Tooltip from 'react-native-walkthrough-tooltip'

import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import Body from 'components/layout/Body'
import WithAuth from 'components/layout/WithAuth'
import {
  ConfirmProps,
  FormUI,
  SwapUI,
  useMarket,
  User,
  useSwap,
} from 'use-station/src'
import { StackScreenProps } from '@react-navigation/stack'

import ErrorComponent from 'components/ErrorComponent'
import UseStationFormField from 'components/UseStationFormField'
import { Text, Icon, Number, Button, Loading } from 'components'

import color from 'styles/color'
import { useConfirm } from 'hooks/useConfirm'
import { RootStackParams } from 'types'

type Props = StackScreenProps<RootStackParams, 'Swap'>

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
      <Text style={styles.swapTitle} fontType={'bold'}>
        {title}
      </Text>
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
      <View style={{ flexDirection: 'row' }}>
        {fields.slice(0, 2).map((field, i) => (
          <View
            key={field.attrs.id}
            style={{ flex: i === 0 ? 1 : 2 }}
          >
            <UseStationFormField field={field} />
          </View>
        ))}
      </View>
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Icon size={24} color={color.sapphire} name={'swap-vert'} />
      </View>
      <View style={{ flexDirection: 'row' }}>
        {fields.slice(2, 4).map((field, i) => (
          <View
            key={field.attrs.id}
            style={{ flex: i === 0 ? 1 : 2 }}
          >
            <UseStationFormField field={field} />
          </View>
        ))}
      </View>

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
          confirm &&
            navigateToConfirm({
              confirm,
              confirmNavigateTo: 'Swap',
            })
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
        <Body
          theme={'sky'}
          scrollable
          containerStyle={{ paddingTop: 20 }}
          onRefresh={refreshPage}
        >
          {refreshing ? null : <RenderMarket user={user} />}
        </Body>
      )}
    </WithAuth>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  title: 'Spaw',
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
