import React, { ReactElement } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'

import { Button } from 'components'

import { COLOR } from 'consts'
import layout from 'styles/layout'

const ConnectorSettingModal = ({
  modal,
  disconnectWalletConnect,
}: {
  modal: AppModal
  disconnectWalletConnect: () => void
}): ReactElement => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.5)',
      }}
    >
      <TouchableOpacity onPress={modal.close} style={{ flex: 1 }} />
      <View style={styles.container}>
        <Button
          theme="red"
          title="Disconnect"
          onPress={disconnectWalletConnect}
          containerStyle={{ marginBottom: 10 }}
        />
        <Button theme="gray" title="Cancel" onPress={modal.close} />
      </View>
    </View>
  )
}

export default ConnectorSettingModal

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: layout.getNotchCoverPaddingBottom,
    backgroundColor: COLOR.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
})
