import React, { ReactElement } from 'react'
import { View } from 'react-native'

import Icon from './Icon'
import Text from './Text'

const Error = ({title, content} : { title?: string, content?: string }): ReactElement => {
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
        {title || 'Oops! Something went wrong'}
      </Text>
      <Text
        style={{
          textAlign: 'center',
          marginTop: 3,
          fontSize: 14,
          lineHeight: 21,
        }}
      >
        {content || 'You have encountered an error'}
      </Text>
    </View>
  )
}

export default Error
