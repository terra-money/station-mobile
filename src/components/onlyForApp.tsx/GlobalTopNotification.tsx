import React, { ReactElement } from 'react'
import FlashMessage, { hideMessage } from 'react-native-flash-message'

import TopNotification from 'components/TopNotification'

const GlobalTopNotification = (): ReactElement => {
  return (
    <FlashMessage
      position="top"
      MessageComponent={(props): ReactElement => (
        <TopNotification {...props} hideMessage={hideMessage} />
      )}
    />
  )
}

export default GlobalTopNotification
