import React, { ReactElement, ReactNode, useState } from 'react'
import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from 'react-native'
import { hasNotch } from 'react-native-device-info'

const AppModal = ({ drawer }: { drawer: Drawer }): ReactElement => {
  return (
    <Modal visible={drawer.isOpen} animationType="fade" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,.5)',
        }}
      >
        <TouchableOpacity onPress={drawer.close} style={styles.top} />
        <View style={styles.bottom}>{drawer.content}</View>
      </View>
    </Modal>
  )
}

/* styles */
const styles = StyleSheet.create({
  top: {
    flex: 1,
  },

  bottom: {
    marginHorizontal: 20,
    marginBottom: Platform.OS === 'ios' && hasNotch() ? 54 : 32,
  },
})

/* hooks */
export const useDrawerState = (): Drawer => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ReactNode>(null)

  const open = (content: ReactNode): void => {
    setContent(content)
    setIsOpen(true)
  }

  const close = (): void => {
    setIsOpen(false)
    setContent(null)
  }

  return { isOpen, open, close, content }
}

export default AppModal
