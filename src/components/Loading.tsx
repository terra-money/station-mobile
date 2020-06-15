import React from 'react'
import { useInfo } from '@terra-money/use-native-station'
import Info from './Info'

const Loading = () => {
  const { LOADING } = useInfo()
  return <Info {...LOADING} />
}

export default Loading
