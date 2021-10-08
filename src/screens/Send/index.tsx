import React, { ReactElement, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'

import { User, useSend, FormUI, ConfirmProps } from 'lib'
import useTokenBalance from 'lib/cw20/useTokenBalance'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import { ExtLink, Icon, Text } from 'components'
import { RootStackParams } from 'types/navigation'
import WithAuth from 'components/layout/WithAuth'
import UseStationForm from 'components/UseStationForm'
import Button from 'components/Button'
import Loading from 'components/Loading'

import { useConfirm } from 'hooks/useConfirm'
import color from 'styles/color'

type Props = StackScreenProps<RootStackParams, 'Send'>

const CrossChainInfo = (): ReactElement => {
  return (
    <View style={styles.crossChainInfoBox}>
      <Icon
        name="info"
        size={17}
        style={{ paddingRight: 6, color: color.primary._02 }}
      />
      <Text style={styles.crossChainInfoText} fontType="book">
        {'Use '}
      </Text>
      <ExtLink
        url={'https://bridge.terra.money/'}
        title={
          <Text
            style={[
              styles.crossChainInfoText,
              {
                color: color.primary._03,
                borderBottomWidth: 1,
                borderBottomColor: color.primary._03,
              },
            ]}
            fontType="medium"
          >
            Terra Bridge
          </Text>
        }
        textStyle={{
          fontSize: 10,
        }}
      />
      <Text style={styles.crossChainInfoText} fontType="book">
        {' for cross-chain transfers'}
      </Text>
    </View>
  )
}

const RenderForm = ({
  form,
  confirm,
  defaultToAddress,
  defaultMemo,
  defaultAmount,
}: {
  form: FormUI
  confirm?: ConfirmProps
  defaultToAddress?: string
  defaultMemo?: string
  defaultAmount?: string
}): ReactElement => {
  const { navigateToConfirm } = useConfirm()

  const toAddress = form.fields.find(({ attrs }) => attrs.id === 'to')
  const memo = form.fields.find(({ attrs }) => attrs.id === 'memo')
  const amount = form.fields.find(({ attrs }) => attrs.id === 'input')

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
          <CrossChainInfo />
          <UseStationForm form={form} />
        </View>

        <Button
          theme={'sapphire'}
          disabled={form.disabled}
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

  const { loading, form, submitted, confirm } = useSend(
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
  crossChainInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: 'rgb(238,240,250)',
  },
  crossChainInfoText: {
    fontSize: 12,
    lineHeight: 18,
  },
})
