import React, { ReactElement, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import _ from 'lodash'
import { StackScreenProps } from '@react-navigation/stack'

import {
  User,
  useSend,
  RecentSentUI,
  FormUI,
  ConfirmProps,
} from 'use-station/src'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import { Text, WarningBox } from 'components'
import { RootStackParams } from 'types/navigation'
import WithAuth from 'components/layout/WithAuth'
import UseStationForm from 'components/UseStationForm'
import Button from 'components/Button'
import Loading from 'components/Loading'

import FormLabel from 'components/FormLabel'
import { useConfirm } from 'hooks/useConfirm'
import useTokenBalance from 'use-station/src/cw20/useTokenBalance'

type Props = StackScreenProps<RootStackParams, 'Send'>

// this display recent transactions
const RenderUi = ({ ui }: { ui: RecentSentUI }): ReactElement => {
  return (
    <View>
      <FormLabel text={ui.title} />
      {_.map(ui.contents, ({ contents, onClick }, i) => (
        <TouchableOpacity
          key={`ui.contents-${i}`}
          style={styles.recentTxBox}
          onPress={onClick}
        >
          {_.map(contents, (content, j) => (
            <View
              key={`ui.contents-contents-${j}`}
              style={styles.recentTxRow}
            >
              <Text style={styles.recentTxTh} fontType="medium">
                {content.title}
              </Text>
              <Text style={styles.recentTxTd} numberOfLines={1}>
                {content.content}
              </Text>
            </View>
          ))}
        </TouchableOpacity>
      ))}
    </View>
  )
}

const RenderForm = ({
  form,
  ui,
  confirm,
  defaultToAddress,
  defaultMemo,
  defaultAmount,
}: {
  form: FormUI
  ui?: RecentSentUI
  confirm?: ConfirmProps
  defaultToAddress?: string
  defaultMemo?: string
  defaultAmount?: string
}): ReactElement => {
  const { navigateToConfirm } = useConfirm()
  const network = form.fields.find(
    ({ attrs }) => attrs.id === 'network'
  )
  const toAddress = form.fields.find(({ attrs }) => attrs.id === 'to')
  const memo = form.fields.find(({ attrs }) => attrs.id === 'memo')
  const amount = form.fields.find(({ attrs }) => attrs.id === 'input')

  const networkSelectable =
    network?.options &&
    network.options.filter((x) => x.disabled === false).length > 0

  useEffect(() => {
    defaultToAddress && toAddress?.setValue?.(defaultToAddress)
    defaultMemo && memo?.setValue?.(defaultMemo)
    defaultAmount && amount?.setValue?.(defaultAmount)
  }, [])

  return (
    <>
      <SubHeader theme={'sapphire'} title={form.title} />
      <Body
        theme={'sky'}
        scrollable
        containerStyle={{
          paddingBottom: 40,
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        <View>
          <UseStationForm form={form} />
          {ui && <RenderUi ui={ui} />}
          {false === networkSelectable && (
            <WarningBox
              message={`${network?.attrs.value} doesn't support ${amount?.unit}`}
            />
          )}
        </View>

        <Button
          theme={'sapphire'}
          disabled={form.disabled || false === networkSelectable}
          title={form.submitLabel}
          onPress={(): void => {
            confirm &&
              navigateToConfirm({
                confirm,
              })
          }}
          containerStyle={{ marginTop: 20 }}
        />
      </Body>
    </>
  )
}

const Render = ({
  user,
  route,
}: { user: User } & Props): ReactElement => {
  const denom = route.params.denomOrToken
  const defaultToAddress = route.params?.toAddress
  const defaultMemo = route.params?.memo
  const defaultAmount = route.params?.amount

  const tokenBalance = useTokenBalance(user.address)

  const { loading, form, ui, submitted, confirm } = useSend(
    user,
    denom,
    tokenBalance
  )

  return (
    <>
      {loading ? (
        <Loading />
      ) : !submitted ? (
        <>
          {form && (
            <RenderForm
              {...{
                form,
                ui,
                confirm,
                denom,
                defaultToAddress,
                defaultMemo,
                defaultAmount,
              }}
            />
          )}
        </>
      ) : null}
    </>
  )
}

const Send = (props: Props): ReactElement => {
  return (
    <WithAuth>
      {(user): ReactElement => <Render {...{ ...props, user }} />}
    </WithAuth>
  )
}

Send.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default Send

const styles = StyleSheet.create({
  recentTxBox: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: 'rgb(238,240,250)',
  },
  recentTxRow: {
    flexDirection: 'row',
  },
  recentTxTh: {
    minWidth: 70,
    fontSize: 10,
    lineHeight: 20,
  },
  recentTxTd: {
    flex: 1,
    fontSize: 10,
    lineHeight: 20,
  },
})
