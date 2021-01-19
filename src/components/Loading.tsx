import React, { ReactElement } from 'react'
import { useInfo } from 'use-station/src'
import Info from './Info'

const Loading = (): ReactElement => {
  const { LOADING } = useInfo()
  return <Info {...LOADING} />
}

export default Loading
