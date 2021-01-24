import React, { ReactElement } from 'react'
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
import { Text } from 'components'
import { RootStackParams } from 'types/navigation'
import WithAuth from 'components/layout/WithAuth'
import UseStationForm from 'components/UseStationForm'
import Button from 'components/Button'
import Loading from 'components/Loading'

import FormLabel from 'components/FormLabel'
import { useConfirm } from 'hooks/useConfirm'

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
              <Text style={styles.recentTxTh}>{content.title}</Text>
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
}: {
  form: FormUI
  ui?: RecentSentUI
  confirm?: ConfirmProps
}): ReactElement => {
  const { navigateToConfirm } = useConfirm()

  return (
    <>
      <SubHeader theme={'sapphire'} title={form.title} />
      <Body
        theme={'sky'}
        containerStyle={{
          flex: 1,
          marginBottom: 40,
          justifyContent: 'space-between',
        }}
      >
        <View>
          <UseStationForm form={form} />
          {ui && <RenderUi ui={ui} />}
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

  const { loading, form, ui, submitted, confirm } = useSend(
    user,
    denom
  )

  return (
    <>
      {loading ? (
        <Loading />
      ) : !submitted ? (
        <>{form && <RenderForm {...{ form, ui, confirm }} />}</>
      ) : null}
    </>
  )
}

const Screen = (props: Props): ReactElement => {
  return (
    <WithAuth>
      {(user): ReactElement => <Render {...{ ...props, user }} />}
    </WithAuth>
  )
}

Screen.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default Screen

const styles = StyleSheet.create({
  recentTxBox: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: 'rgb(238,240,250)',
  },
  recentTxRow: {
    flexDirection: 'row',
  },
  recentTxTh: {
    minWidth: 70,
  },
  recentTxTd: {
    flex: 1,
  },
})
