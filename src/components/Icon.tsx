import React, { ReactElement } from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

const Icon = ({ name }: { name: string }): ReactElement => (
  <MaterialIcon name={name} />
)

export default Icon
