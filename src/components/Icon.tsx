import React, { ReactElement } from 'react'
import { IconProps } from 'react-native-vector-icons/Icon'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

// https://material.io/resources/icons/?icon=open_in_new&style=baseline
const Icon = (props: IconProps): ReactElement => (
  <MaterialIcon {...props} />
)

export default Icon
