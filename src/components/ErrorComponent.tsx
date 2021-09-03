import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { useInfo } from 'lib'

import Icon from './Icon'
import Text from './Text'

const ErrorComponent = (): ReactElement => {
  const { ERROR } = useInfo()

  return (
    <View>
      <Icon
        name={'sentiment-very-dissatisfied'}
        size={50}
        color="#2043B5"
        style={{ alignSelf: 'center' }}
      />
      <Text
        style={{
          textAlign: 'center',
          marginTop: 3,
          fontSize: 17,
          lineHeight: 24,
        }}
        fontType="bold"
      >
        {ERROR.title}
      </Text>
      <Text
        style={{
          textAlign: 'center',
          marginTop: 3,
          fontSize: 14,
          lineHeight: 21,
        }}
      >
        {ERROR.content}
      </Text>
    </View>
  )
}

export default ErrorComponent
