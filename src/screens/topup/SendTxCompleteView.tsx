import { Text, Button } from 'components'
import Body from 'components/layout/Body'
import React, { ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'
import color from 'styles/color'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParams } from 'types'

type Props = StackScreenProps<RootStackParams, 'SendTxCompleteView'>

const SendTxCompleteView = (props: Props): ReactElement => {
  return (
    <Body>
      <View style={style.container}>
        {props.route.params.success === undefined ||
        props.route.params.success === true ? (
          <MaterialCommunityIcon
            size={60}
            color={color.sapphire}
            name={'check-circle-outline'}
          />
        ) : (
          <MaterialCommunityIcon
            size={60}
            color={color.sapphire}
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
        onPress={props.route.params.onPress}
        containerStyle={style.buttonContainer}
      />
    </Body>
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
