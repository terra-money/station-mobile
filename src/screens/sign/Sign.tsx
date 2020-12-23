import { CommonActions } from '@react-navigation/native'
import React from 'react'
import { View, Text, Button, Linking } from 'react-native'
import { Buffer } from 'buffer'

interface Props {
  navigation: any
  route: { 
    params: { 
      arg?: string 
    } 
  }
}

const RETURN_APP_SCHEME = 'mirrorapp://'

export default (props: Props) => {
  const arg = props.route.params.arg === undefined 
    ? 'undefined' 
    : Buffer.from(props.route.params.arg, 'base64').toString()

  return (
    <View style={{ flex: 1, }}>
      <Text>{`arg: ${arg}`}</Text>
      <Button title='RETURN APP' onPress={() => {
        Linking.openURL(RETURN_APP_SCHEME)
      }} />
      <Button title='RETURN DASHBOARD' onPress={() => {
        props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: 'Tabs' },
            ]
          })
        )
      }} />
    </View>
  )
}