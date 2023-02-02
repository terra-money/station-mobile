import React from 'react'
import { NativeBaseProvider } from 'native-base'

import { NavigationContainer } from '@core/services/navigation'
import theme from '@core/theme'

const MainApp = () => {
  return (
    <>
      <NavigationContainer />
      {/* Add here modals, layovers, etc. */}
    </>
  )
}

const App = () => (
  <NativeBaseProvider theme={theme}>
    <MainApp />
  </NativeBaseProvider>
)

export default App
