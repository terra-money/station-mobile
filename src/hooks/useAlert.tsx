import React, { ReactElement } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'components'
import { useApp } from './useApp'
import color from 'styles/color'

type AlertProps = {
  title?: string
  desc: string
  onPressConfirmText?: string
  onPressConfirm: () => void
}
type ConfirmProps = {
  onPressCancelText?: string
  onPressCancel?: () => void
} & AlertProps

const AlertScreen = (
  props:
    | {
        alertModal: AlertModal
        alertType: 'confirm'
        alertProps: ConfirmProps
      }
    | {
        alertModal: AlertModal
        alertType: 'alert'
        alertProps: AlertProps
      }
): ReactElement => {
  const { alertModal, alertProps } = props
  const onPressConfirm = (): void => {
    alertModal.close()
    alertProps.onPressConfirm()
  }

  return (
    <View style={styles.container}>
      <View style={styles.textBox}>
        {alertProps.title && (
          <Text style={styles.title} fontType={'bold'}>
            {alertProps.title}
          </Text>
        )}
        <Text style={styles.desc}>{alertProps.desc}</Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.buttonBox}
          onPress={onPressConfirm}
        >
          <Text style={styles.buttonText} fontType={'bold'}>
            {alertProps.onPressConfirmText || 'Ok'}
          </Text>
        </TouchableOpacity>
        {props.alertType === 'confirm' && (
          <TouchableOpacity
            style={[
              styles.buttonBox,
              { borderLeftWidth: 1, borderColor: '#ddd' },
            ]}
            onPress={(): void => {
              alertModal.close()
              props.alertProps.onPressCancel &&
                props.alertProps.onPressCancel()
            }}
          >
            <Text style={styles.buttonText} fontType={'bold'}>
              {props.alertProps.onPressCancelText || 'Cancel'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 40,
    paddingTop: 20,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  textBox: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    backgroundColor: color.gray,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  buttonBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
  },
})

export const useAlert = (): {
  alert: (props: AlertProps) => void
  confirm: (props: ConfirmProps) => void
} => {
  const { alertModal } = useApp()

  const alert = (props: AlertProps): void => {
    alertModal.open(
      AlertScreen({
        alertModal,
        alertType: 'alert',
        alertProps: props,
      })
    )
  }
  const confirm = (props: ConfirmProps): void => {
    alertModal.open(
      AlertScreen({
        alertModal,
        alertType: 'confirm',
        alertProps: props,
      })
    )
  }
  return {
    alert,
    confirm,
  }
}
