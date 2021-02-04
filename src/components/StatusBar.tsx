import React, { ReactElement } from 'react'
import { StatusBar as DefaultStatusBar } from 'react-native'
import color from 'styles/color'

const StatusBar = ({
  theme,
}: {
  theme?: 'sapphire' | 'sky' | 'white'
}): ReactElement => {
  return (
    <>
      {theme === 'sapphire' ? (
        <DefaultStatusBar
          barStyle="light-content"
          backgroundColor={color.sapphire}
          translucent={false}
        />
      ) : (
        <DefaultStatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={false}
        />
      )}
    </>
  )
}

export default StatusBar
