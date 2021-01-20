import React, { ReactElement, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import _ from 'lodash'
import { StackScreenProps } from '@react-navigation/stack'

import { User, useSend, RecentSentUI, FormUI } from 'use-station/src'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import Text from 'components/Text'
import { SendStackParams } from 'types/navigation'
import WithAuth from 'components/layout/WithAuth'
import UseStationForm from 'components/UseStationForm'
import Button from 'components/Button'
import Loading from 'components/Loading'

import FormLabel from 'components/FormLabel'
import SendStore from 'stores/SendStore'
import { useSetRecoilState } from 'recoil'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'

type Props = StackScreenProps<SendStackParams, 'Send'>

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
}: {
  form: FormUI
  ui?: RecentSentUI
}): ReactElement => {
  const { navigate } = useNavigation<
    NavigationProp<SendStackParams>
  >()

  return (
    <>
      <SubHeader theme={'blue'} title={form.title} />
      <Body
        theme={'sky'}
        scrollable
        containerStyle={{
          flex: 1,
          marginBottom: -40,
        }}
      >
        <UseStationForm form={form} />
        {ui && <RenderUi ui={ui} />}
        <Button
          theme={'blue'}
          disabled={form.disabled}
          title={form.submitLabel}
          onPress={(): void => {
            navigate('Confirm')
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
  const denom = route.params.denom
  const setConfirm = useSetRecoilState(SendStore.confirm)

  const { loading, form, ui, submitted, confirm } = useSend(
    user,
    denom
  )
  // console.log(
  //   JSON.stringify({ loading, form, ui, submitted, confirm }, null, 2)
  // )
  useEffect(() => {
    if (confirm) {
      setConfirm(confirm)
    }
  }, [confirm])

  return (
    <>
      {loading ? (
        <Loading />
      ) : !submitted ? (
        <>{form && <RenderForm {...{ form, ui }} />}</>
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
  theme: 'blue',
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
