import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import _ from 'lodash'
import {
  User,
  BankData,
  Pairs,
  useSwapMultiple,
  FormUI,
  Field,
  CoinFields,
  format,
} from 'lib'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import WithAuth from 'components/layout/WithAuth'
import {
  FormLabel,
  Icon,
  Number,
  CheckBox,
  Button,
  Text,
} from 'components'

import { RootStackParams } from 'types/navigation'

import SelectInputForm from './SelectInputForm'
import { COLOR } from 'consts'
import { useConfirm } from 'hooks/useConfirm'

type Props = StackScreenProps<RootStackParams, 'SwapMultipleCoins'>

const SwapTo = ({ label, groups }: CoinFields): ReactElement => (
  <View>
    <FormLabel text={label} />
    {groups.map(({ denom, input }, index) => {
      return (
        <View key={index}>
          <SelectInputForm selectField={denom} inputField={input} />
        </View>
      )
    })}
  </View>
)

const SwapFrom = ({
  label,
  list,
}: {
  label: string
  list: Field[]
}): ReactElement => {
  return (
    <>
      <FormLabel text={label} />
      <View>
        {list.map((field: Field) => {
          const { attrs, ui } = field
          const { id } = attrs
          const { available, simulated } = ui

          return (
            <View key={id}>
              <View style={styles.swapItem}>
                <View>
                  <CheckBox
                    checked={field.attrs.checked}
                    onPress={(): void => {
                      field.setValue?.(
                        _.toString(!field.attrs.checked)
                      )
                    }}
                    label={field.label}
                    disabled={field.attrs.disabled}
                  />
                </View>

                <View style={styles.swapItemValue}>
                  <Number numberFontStyle={{ fontSize: 12 }}>
                    {available}
                  </Number>

                  {simulated && (
                    <View style={styles.simulated}>
                      <Icon
                        name={'arrow-forward'}
                        color={COLOR.primary._02}
                        style={{ marginRight: 5, marginTop: 2 }}
                      />
                      <Number numberFontStyle={{ fontSize: 12 }}>
                        {simulated}
                      </Number>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )
        })}
      </View>
    </>
  )
}

const RenderForm = ({
  form,
  ui,
  onPressSubmit,
}: {
  form: FormUI
  ui: any
  onPressSubmit: () => void
}): ReactElement => {
  return (
    <>
      <SubHeader theme={'sapphire'} title={form.title} />
      <Body
        theme={'sky'}
        scrollable
        containerStyle={styles.container}
      >
        <View>
          <View style={{ marginBottom: 20 }}>
            <SwapTo {...ui.group} />
          </View>
          <View style={{ marginBottom: 20 }}>
            <SwapFrom {...ui.checkboxes} />
          </View>
          <View style={styles.totalBox}>
            <View style={styles.bottomMask} />
            <View style={styles.rightMask} />
            <View style={styles.leftMask} />
            <Text fontType="medium">Receive </Text>
            <Text fontType="medium">
              {ui.group?.groups[0]?.input?.attrs?.value}{' '}
              {format.denom(ui.group?.groups[0]?.denom?.attrs?.value)}
            </Text>
          </View>
          <Button
            theme={'sapphire'}
            title={form.submitLabel}
            disabled={form.disabled}
            onPress={onPressSubmit}
          />
        </View>
      </Body>
    </>
  )
}

const Render = ({
  user,
  bank,
  pairs,
}: {
  user: User
  bank: BankData
  pairs: Pairs
} & Props): ReactElement => {
  const { form, ui, confirm } = useSwapMultiple(user, { bank, pairs })
  const { navigateToConfirm } = useConfirm()

  const onPressSubmit = (): void => {
    confirm && navigateToConfirm({ confirm })
  }

  return (
    <>
      {form && (
        <RenderForm
          form={form}
          ui={ui}
          onPressSubmit={onPressSubmit}
        />
      )}
    </>
  )
}

const SwapMultipleCoins = (props: Props): ReactElement => {
  const bank = props.route.params.bank
  const pairs = props.route.params.pairs
  return (
    <WithAuth>
      {(user): ReactElement => (
        <>
          {bank && pairs && (
            <Render {...{ ...props, user, bank, pairs }} />
          )}
        </>
      )}
    </WithAuth>
  )
}

SwapMultipleCoins.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default SwapMultipleCoins

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  totalBox: {
    paddingTop: 10,
    paddingBottom: 30,
    borderColor: COLOR.primary._02,
    borderWidth: 1,
    borderRadius: 1,
    borderStyle: 'dashed',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
  },
  bottomMask: {
    height: 3,
    width: 9999,
    backgroundColor: COLOR.sky,
    position: 'absolute',
    bottom: -3,
    left: 0,
  },
  rightMask: {
    height: 9999,
    width: 3,
    backgroundColor: COLOR.sky,
    position: 'absolute',
    top: 0,
    right: -3,
  },
  leftMask: {
    width: 3,
    height: 60,
    backgroundColor: COLOR.sky,
    position: 'absolute',
    top: 0,
    left: -3,
  },
  swapItem: {
    borderTopWidth: 1,
    borderTopColor: '#f2f2f2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    minHeight: 58,
  },
  swapItemValue: {
    alignItems: 'flex-end',
  },
  simulated: {
    flexDirection: 'row',
    marginTop: 2,
  },
})
