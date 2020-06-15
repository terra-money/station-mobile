import React, { FC, ReactNode } from 'react'
import { ErrorBoundary as Component } from '@terra-money/use-native-station'
import { useText } from '@terra-money/use-native-station'

interface Props {
  fallback?: ReactNode
}

const ErrorBoundary: FC<Props> = ({ fallback, children }) => {
  const { OOPS } = useText()

  const handleError = (error: Error, errorInfo: object) => {
    // TODO: report
  }

  return (
    <Component fallback={fallback ?? OOPS} handleError={handleError}>
      {children}
    </Component>
  )
}

export default ErrorBoundary
