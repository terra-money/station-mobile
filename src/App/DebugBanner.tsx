import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { COLOR } from 'consts'
import Text from '../components/Text'

const DebugBanner = ({ title }: { title: string }): JSX.Element => {
  const { top: insetTop } = useSafeAreaInsets()

  return (
    <View
      style={{
        position: 'absolute',
        width: 100,
        height: 21,
        top: insetTop > 0 ? insetTop - 5 : 5,
        right: 0,
      }}
      pointerEvents={'none'}
    >
      <View
        style={{
          height: 21,
          backgroundColor: COLOR.primary._03,
          alignItems: 'center',
          justifyContent: 'center',
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
        }}
      >
        <Text
          fontType="bold"
          style={{
            fontSize: 10,
            lineHeight: 15,
            letterSpacing: 1,

            color: '#fff',
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  )
}

export default DebugBanner
