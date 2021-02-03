import React, {
  ReactElement,
  useEffect,
  useState,
  Fragment,
} from 'react'
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
import font from 'styles/font'

import SelectInputForm from './SelectInputForm'

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
          containerStyle={{ height: 24 }}
          textStyle={{
            fontSize: 10,
            fontFamily: font.gotham.medium,
          }}
        />
      )}
    </>
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
      <View style={styles.topSection}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            height: 24,
          }}
        >
          <View>
            <Text style={styles.swapTitle} fontType={'bold'}>
              {title}
            </Text>
          </View>

          <View style={{ flex: 1, maxWidth: 100 }}>
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
              Available:
            </Text>
            <Number
              numberFontStyle={{
                fontSize: 12,
                color: color.dodgerBlue,
                textDecorationLine: 'underline',
              }}
              fontType="medium"
            >
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
      </View>
      <View style={styles.bottomSection}>
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
              <Icon
                name={'info'}
                color={color.sapphire}
                size={14}
                style={{ marginLeft: 5 }}
              />
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

const Screen = ({ navigation }: Props): ReactElement => {
  const { error, loading, ui, swap } = useMarket()
  const [refreshingKey, setRefreshingKey] = useState(0)
  const refreshPage = async (): Promise<void> => {
    setRefreshingKey((ori) => ori + 1)
  }

  useEffect(() => {
    if (loading === false) {
      navigation.addListener('focus', () => {
        refreshPage()
      })
    }
  }, [loading])

  return (
    <WithAuth>
      {(user): ReactElement => (
        <Body theme={'sky'} scrollable onRefresh={refreshPage}>
          <Fragment key={refreshingKey}>
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
          </Fragment>
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
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 35,
    shadowOpacity: 1,
  },
  swapTitle: {
    fontSize: 16,
  },
  topSection: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f7',
  },
  bottomSection: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
})
