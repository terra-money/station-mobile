import React, {
  ReactElement,
  useEffect,
  useState,
  Fragment,
} from 'react'
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native'
import _ from 'lodash'
import Tooltip from 'react-native-walkthrough-tooltip'
import { StackScreenProps } from '@react-navigation/stack'
import { TouchableOpacity } from 'react-native-gesture-handler'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'

import { RootStackParams } from 'types'
import { navigationHeaderOptions } from 'components/layout/TabScreenHeader'
import Body from 'components/layout/Body'
import {
  AssetsUI,
  ConfirmProps,
  Field,
  FormUI,
  SwapUI,
  useAssets,
  useAuth,
  useMarket,
  User,
  useSwap,
} from 'lib'

import ErrorComponent from 'components/ErrorComponent'
import {
  Text,
  Icon,
  Number,
  Button,
  SelectOptionProps,
  Select,
} from 'components'

import color from 'styles/color'
import { useConfirm } from 'hooks/useConfirm'
import font from 'styles/font'

import SelectInputForm from './SelectInputForm'
import Card from 'components/Card'

type Props = StackScreenProps<RootStackParams, 'Wallet'>

const SwapTypeSelect = ({
  field,
}: {
  field: Field
}): ReactElement => {
  if (!field) {
    return <></>
  }

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

  const SwapTypeText = (): ReactElement => {
    return (
      <>
        {options.length > 0 && (
          <View>
            <Text
              fontType="bold"
              style={{ textAlign: 'right', fontSize: 11 }}
            >
              {options[0].label}
            </Text>
          </View>
        )}
      </>
    )
  }

  return (
    <>
      {options.length > 1 ? (
        <>
          {!field.attrs.hidden && (
            <Select
              disabled={options.length < 1}
              selectedValue={attrs.value || ''}
              onValueChange={(value): void => {
                setValue?.(`${value}`)
              }}
              optionList={options}
              containerStyle={{ height: 24 }}
              textStyle={{
                lineHeight: 15,
                fontSize: 10,
                fontFamily: font.gotham.medium,
              }}
              icon={
                Platform.OS === 'ios'
                  ? (): ReactElement => (
                      <View style={{ marginRight: -10 }}>
                        <Icon
                          name={'arrow-drop-down'}
                          size={14}
                          color={color.sapphire}
                        />
                      </View>
                    )
                  : undefined
              }
            />
          )}
        </>
      ) : (
        <SwapTypeText />
      )}
    </>
  )
}

const Render = ({
  form,
  title,
  ui,
  confirm,
  haveBalance,
}: {
  form: FormUI
  title: string
  ui: SwapUI
  confirm?: ConfirmProps
  haveBalance: boolean
}): ReactElement => {
  const { fields, submitLabel, onSubmit, disabled } = form
  const { label, max, spread, expectedPrice, bank, pairs } = ui

  const [
    isVisibleSpreadTooltip,
    setisVisibleSpreadTooltip,
  ] = useState(false)

  const { navigateToConfirm } = useConfirm()
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()
  const opacity = haveBalance ? 1.0 : 0.4

  return (
    <>
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
              {fields[4] && <SwapTypeSelect field={fields[4]} />}
            </View>
          </View>
          {!haveBalance && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Icon
                name={'info-outline'}
                color={color.sapphire}
                size={18}
              />
              <Text
                fontType={'book'}
                style={{
                  fontSize: 14,
                  lineHeight: 21,
                  marginLeft: 6,
                }}
              >
                {`There are no coins available to swap.`}
              </Text>
            </View>
          )}
          <View style={{ opacity: opacity }}>
            <View>
              <TouchableOpacity
                disabled={!haveBalance}
                onPress={max?.attrs.onClick}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginBottom: 5,
                }}
              >
                <Text style={{ fontSize: 12, paddingRight: 5 }}>
                  {'Available:'}
                </Text>
                <Number
                  numberFontStyle={{
                    fontSize: 12,
                    color: color.dodgerBlue,
                    textDecorationLine: 'underline',
                  }}
                  fontType="medium"
                >
                  {max?.display.value}
                </Number>
              </TouchableOpacity>
            </View>
            <SelectInputForm
              disabled={!haveBalance}
              selectField={fields[0]}
              inputField={fields[1]}
              containerStyle={{
                borderColor: color.sapphire,
              }}
              selectPlaceHolder={'Select a coin to swap'}
            />
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <Icon
                size={24}
                color={color.sapphire}
                name={'swap-vert'}
              />
            </View>
            <SelectInputForm
              disabled={
                !haveBalance || _.isEmpty(fields[0].attrs.value)
              }
              selectField={fields[2]}
              inputField={fields[3]}
              containerStyle={{
                backgroundColor: '#ebeff8',
              }}
              selectPlaceHolder={'Select a coin to receive'}
            />
          </View>
        </View>
        <View style={styles.bottomSection}>
          {expectedPrice && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
                opacity: opacity,
              }}
            >
              <Text
                fontType="medium"
                style={{ fontSize: 12, lineHeight: 18 }}
              >
                {expectedPrice.title}
              </Text>
              <Text
                style={{
                  flexShrink: 1,
                  paddingLeft: 20,
                  fontSize: 12,
                  lineHeight: 18,
                  textAlign: 'right',
                }}
              >
                {expectedPrice.text}
              </Text>
            </View>
          )}
          {spread && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 30,
                opacity: opacity,
              }}
            >
              <Tooltip
                isVisible={isVisibleSpreadTooltip}
                content={<Text>{spread.tooltip}</Text>}
                placement="top"
                onClose={(): void => setisVisibleSpreadTooltip(false)}
              >
                <TouchableOpacity
                  disabled={!haveBalance || !spread.tooltip}
                  onPress={(): void =>
                    setisVisibleSpreadTooltip(true)
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    fontType="medium"
                    style={{ fontSize: 12, lineHeight: 18 }}
                  >
                    {spread.title}
                  </Text>
                  {!!spread.tooltip && (
                    <Icon
                      name={'info'}
                      color={color.sapphire}
                      size={14}
                      style={{ marginLeft: 5 }}
                    />
                  )}
                </TouchableOpacity>
              </Tooltip>
              <Text
                style={{
                  flexShrink: 1,
                  paddingLeft: 20,
                  fontSize: 12,
                  lineHeight: 18,
                  textAlign: 'right',
                }}
              >
                {spread.text || `${spread.value} ${spread.unit}`}
              </Text>
            </View>
          )}
          <Button
            theme={'sapphire'}
            disabled={disabled}
            title={submitLabel}
            onPress={(): void => {
              onSubmit && onSubmit()
              confirm && navigateToConfirm({ confirm })
            }}
          />
        </View>
      </View>
      {pairs && (
        <View
          style={{
            shadowColor: 'rgba(0, 0, 0, 0.05)',
            shadowOffset: {
              width: 0,
              height: 20,
            },
            shadowRadius: 35,
            shadowOpacity: 1,
            marginBottom: 40,
          }}
        >
          <Button
            theme={'white'}
            title={
              <View style={{ flexDirection: 'row' }}>
                <Icon name="bolt" color={color.sapphire} size={18} />
                <Text fontType="medium">{label.multipleSwap}</Text>
              </View>
            }
            onPress={(): void => {
              navigate('SwapMultipleCoins', { bank, pairs })
            }}
          />
        </View>
      )}
    </>
  )
}

const RenderSwap = ({
  actives,
  user,
  title,
  navigation,
  refreshingKey,
  assetUi,
  assetExecute,
}: {
  actives: string[]
  user: User
  title: string
  refreshingKey: number
  assetUi?: AssetsUI
  assetExecute?: () => Promise<void>
} & Props): ReactElement => {
  const { form, confirm, ui, load } = useSwap(user, actives)
  const haveBalance = _.some(
    assetUi?.tokens || assetUi?.available || assetUi?.vesting
  )

  const refresh = (): void => {
    if (load) {
      load()
      const amtSet = form?.fields[1].setValue
      amtSet && amtSet('')
    }
    assetExecute && assetExecute()
  }

  useEffect(() => {
    refreshingKey && refresh()
  }, [refreshingKey])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refresh()
    })
    return unsubscribe
  }, [])

  return (
    <View>
      {assetUi && ui && form && (
        <Render
          form={form}
          title={title}
          ui={ui}
          confirm={confirm}
          haveBalance={haveBalance}
        />
      )}
    </View>
  )
}

const Swap = (props: Props): ReactElement => {
  const { error, loading, ui, swap, execute } = useMarket()
  const [refreshingKey, setRefreshingKey] = useState(0)

  const refreshPage = async (): Promise<void> => {
    setRefreshingKey((ori) => ori + 1)
  }
  const { user } = useAuth()
  if (!user) {
    return <></>
  }
  const { ui: assetUi, execute: assetExecute } = useAssets(user)

  useEffect(() => {
    let unsubscribe
    if (false === loading) {
      unsubscribe = props.navigation.addListener('focus', () => {
        execute()
      })
    }
    return unsubscribe
  }, [loading])

  return (
    <>
      {user && (
        <Body
          theme={'sky'}
          {...(ui && assetUi ? { scrollable: true } : {})}
          onRefresh={refreshPage}
        >
          <Fragment>
            {error ? (
              <Card style={{ marginHorizontal: 0 }}>
                <ErrorComponent />
              </Card>
            ) : assetUi && ui ? (
              <RenderSwap
                {...{
                  actives: ui.actives,
                  user,
                  title: swap,
                  refreshingKey,
                  assetUi,
                  assetExecute,
                }}
                {...props}
              />
            ) : (
              <View
                style={{
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator size="large" color="#000" />
              </View>
            )}
          </Fragment>
        </Body>
      )}
    </>
  )
}

Swap.navigationOptions = navigationHeaderOptions({
  title: 'Swap',
})

export default Swap

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
    marginBottom: 20,
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
