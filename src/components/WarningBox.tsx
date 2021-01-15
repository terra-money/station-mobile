import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import Text from 'components/Text'
import color from 'styles/color'

const WarningBox = ({
  message,
}: {
  message: string | ReactElement
}): ReactElement => {
  return (
    <View style={styles.container}>
      <View style={{ width: 25, paddingTop: 4 }}>
        <MaterialIcons name={'info'} color={color.red} size={16} />
      </View>

      <View style={{ flex: 1 }}>
        {typeof message === 'string' ? (
          <Text style={{ color: color.red }}>{message}</Text>
        ) : (
          message
        )}
      </View>
    </View>
  )
}

export default WarningBox

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: '#ffeff0',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgba(255, 85, 97, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
})
