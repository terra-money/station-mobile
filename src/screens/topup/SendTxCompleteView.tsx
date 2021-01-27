import { Text, Button } from 'components'
import Body from 'components/layout/Body'
import React, { ReactElement } from 'react'
import { View } from 'react-native'
import color from 'styles/color'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

interface Props {
  navigation: any
  route: {
    params: {
      success?: boolean
      title?: string
      content?: string
      button?: string
      onPress: () => void
    }
  }
}
const SendTxCompleteView = (props: Props): ReactElement => {
  return (
    <Body>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
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
        <Text
          style={{ fontSize: 24, lineHeight: 36 }}
          fontType={'bold'}
        >
          {props.route.params.title ?? 'Success!'}
        </Text>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            textAlign: 'center',
          }}
        >
          {props.route.params.content ??
            'Your transaction has been successfully processed.'}
        </Text>
      </View>
      <Button
        theme={'sapphire'}
        title={props.route.params.button ?? 'Continue'}
        onPress={props.route.params.onPress}
        containerStyle={{ marginBottom: 40 }}
      />
    </Body>
  )
}

export default SendTxCompleteView
