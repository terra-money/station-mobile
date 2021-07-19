import React, { ReactElement } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import { MessageComponentProps } from 'react-native-flash-message'
import _ from 'lodash'

import Icon from './Icon'
import Text from './Text'
import color from 'styles/color'

const TopNotification = ({
  message,
  hideMessage,
}: MessageComponentProps & { hideMessage(): void }): ReactElement => {
  const { type, description, message: title } = message

  return (
    <SafeAreaView>
      <View
        style={[
          styles.container,
          type === 'danger' && {
            backgroundColor: '#ffeff0',
            borderColor: color.red,
          },
        ]}
      >
        <View
          style={[
            styles.titleBox,
            type === 'danger' && { backgroundColor: color.red },
            _.some(description) && {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          ]}
        >
          <View style={styles.titleTextBox}>
            <Icon
              name={
                type === 'danger'
                  ? 'error-outline'
                  : 'check-circle-outline'
              }
              color={color.white}
              size={24}
            />
            <Text
              style={{
                color: color.white,
                paddingHorizontal: 5,
                flex: 1,
              }}
            >
              {title}
            </Text>
          </View>
          <TouchableOpacity onPress={hideMessage}>
            <Icon
              name="close"
              color={color.white}
              size={24}
              style={{ opacity: 0.5 }}
            />
          </TouchableOpacity>
        </View>
        {_.some(description) && (
          <View style={styles.descBox}>
            <Text
              style={[
                styles.descText,
                type === 'danger' && {
                  color: color.red,
                },
              ]}
              fontType="bold"
            >
              {description}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

export default TopNotification

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: '#f1f6ff',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#5d94fd',
  },
  titleBox: {
    borderRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#6096ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleTextBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  descBox: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  descText: {
    color: '#6096ff',
    fontSize: 14,
    fontStyle: 'normal',
    lineHeight: 21,
    letterSpacing: 0,
  },
})
