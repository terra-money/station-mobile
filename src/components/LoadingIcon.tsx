import React, { ReactElement } from 'react'
import {
  ActivityIndicator,
  ActivityIndicatorProps,
} from 'react-native'
import styledColor from 'styles/color'

const LoadingIcon = (props: ActivityIndicatorProps): ReactElement => {
  const { color, size, ...rest } = props
  return (
    <ActivityIndicator
      color={color || styledColor.sapphire}
      size={size || 24}
      {...rest}
    />
  )
}

export default LoadingIcon
