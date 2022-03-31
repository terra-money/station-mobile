import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Text from '../components/Text'
import { useConfig } from 'lib'
import { themes } from 'lib/contexts/useTheme'

const DebugBanner = ({ title }: { title: string }): JSX.Element => {
  const { top: insetTop } = useSafeAreaInsets()
  const { theme } = useConfig()

  return (
    <View
      style={{
        position: 'absolute',
        width: 100,
        height: 21,
        top: 0,
        left: 0,
      }}
      pointerEvents={'none'}
    >
      <View
        style={{
          height: 21,
          backgroundColor: themes?.[theme.current]?.primaryColor,
          alignItems: 'center',
          justifyContent: 'center',
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <Text
          fontType="bold"
          style={{
            fontSize: 10,
            lineHeight: 15,
            letterSpacing: 1,

            color: themes?.[theme.current]?.primaryText,
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
