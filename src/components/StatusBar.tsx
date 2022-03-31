import React, { ReactElement } from 'react'
import { StatusBar as DefaultStatusBar } from 'react-native'

import { COLOR } from 'consts'

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
          backgroundColor={COLOR.primary._02}
          translucent={false}
        />
      ) : (
        <DefaultStatusBar
          barStyle="dark-content"
          backgroundColor="black"
          translucent={false}
        />
      )}
    </>
  )
}

export default StatusBar
