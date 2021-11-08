import React, { ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StackScreenProps } from '@react-navigation/stack'

import { COLOR } from 'consts'

import { Text, Button } from 'components'
import StatusBar from 'components/StatusBar'
import Body from 'components/layout/Body'
import { RootStackParams } from 'types'
import { useTopup } from 'hooks/useTopup'

type Props = StackScreenProps<RootStackParams, 'SendTxCompleteView'>

const SendTxCompleteView = (props: Props): ReactElement => {
  const { restoreApp } = useTopup()

  return (
    <>
      <StatusBar theme="white" />
      <Body>
        <View style={style.container}>
          {props.route.params.success === undefined ||
          props.route.params.success === true ? (
            <MaterialCommunityIcon
              size={60}
              color={COLOR.primary._02}
              name={'check-circle-outline'}
            />
          ) : (
            <MaterialCommunityIcon
              size={60}
              color={COLOR.primary._02}
              name={'alert-circle-outline'}
            />
          )}
          <Text style={style.titleText} fontType={'bold'}>
            {props.route.params.title ?? 'Success!'}
          </Text>
          <Text style={style.contentText}>
            {props.route.params.content ??
              'Your transaction has been successfully processed.'}
          </Text>
        </View>
        <Button
          theme={'sapphire'}
          title={props.route.params.button ?? 'Continue'}
          onPress={(): void => {
            restoreApp(props.route.params.returnScheme)
          }}
          containerStyle={style.buttonContainer}
        />
      </Body>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleText: { fontSize: 24, lineHeight: 36, marginVertical: 5 },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  buttonContainer: { marginBottom: 40 },
})

export default SendTxCompleteView
