import React, { ReactElement, ReactNode, useState } from 'react'
import {
  View,
  StyleProp,
  ViewStyle,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback, // It's for keyboard.dismiss. not works with getgure-handler's
  Keyboard,
} from 'react-native'
import { COLOR } from 'consts'

export type BodyProps = {
  theme?: 'white' | 'sky' | 'sapphire'
  containerStyle?: StyleProp<ViewStyle>
  children: ReactNode
  scrollable?: boolean
  onRefresh?: () => Promise<void>
}

const Body = (props: BodyProps): ReactElement => {
  const { theme, onRefresh } = props
  const [refreshing, setRefreshing] = useState(false)
  const _onRefresh = (): void => {
    if (onRefresh) {
      setRefreshing(true)
      onRefresh().then((): void => {
        setRefreshing(false)
      })
    }
  }

  const containerStyle: StyleProp<ViewStyle> = {
    paddingHorizontal: 20,
  }

  switch (theme) {
    case 'sapphire':
      containerStyle.backgroundColor = COLOR.primary._02
      break
    case 'sky':
      containerStyle.backgroundColor = COLOR.sky
      break
    case 'white':
    default:
      containerStyle.backgroundColor = COLOR.white
      break
  }

  return (
    <>
      {props.scrollable ? (
        <ScrollView
          refreshControl={
            onRefresh && (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={_onRefresh}
              />
            )
          }
          contentContainerStyle={[
            containerStyle,
            props.containerStyle,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {props.children}
        </ScrollView>
      ) : (
        <TouchableWithoutFeedback // It must be from react-native, not gesture-handler's
          style={{ flex: 1 }}
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <View
            style={[
              containerStyle,
              { flex: 1 },
              props.containerStyle,
            ]}
          >
            {props.children}
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  )
}

export default Body
