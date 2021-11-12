import React, { ReactElement } from 'react'
import { Loading } from 'components'

const TopupLoadingIndicator = (): ReactElement => (
  <Loading
    style={{
      position: 'absolute',
      flex: 1,
      width: '100%',
      height: '100%',
      alignContent: 'center',
      justifyContent: 'center',
    }}
  />
)

export default TopupLoadingIndicator
