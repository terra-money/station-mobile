import React, { ReactNode } from 'react'
import useKeys from './useKeys'

interface Props {
  render: (params: { names: string[]; keys: Key[] }) => ReactNode
}

const WithKeys = ({ render }: Props) => {
  const { names, keys } = useKeys()
  return <>{!!(names && keys) ? render({ names, keys }) : null}</>
}

export default WithKeys
