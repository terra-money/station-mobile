import React, { FC } from 'react'
import { View } from 'react-native'

type Props = { small?: boolean; light?: boolean }

const Table: FC<Props> = ({ children }) => <View>{children}</View>

export default Table
