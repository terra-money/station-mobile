import React, { ReactElement } from 'react'
import { useInfo } from '@terra-money/use-native-station'
import Info from './Info'

const Loading = (): ReactElement => {
  const { LOADING } = useInfo()
  return <Info {...LOADING} />
}

export default Loading
