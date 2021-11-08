import React, { ReactElement } from 'react'
import {
  ActivityIndicator,
  ActivityIndicatorProps,
} from 'react-native'

import { COLOR } from 'consts'

const LoadingIcon = (props: ActivityIndicatorProps): ReactElement => {
  const { color, size, ...rest } = props
  return (
    <ActivityIndicator
      color={color || COLOR.primary._02}
      size={size || 24}
      {...rest}
    />
  )
}

export default LoadingIcon
