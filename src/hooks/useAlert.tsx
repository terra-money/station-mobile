import React, { ReactElement } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Text from '../components/Text'
import { useApp } from '../App/useApp'
import color from 'styles/color'

type AlertProps = {
  title?: string
  desc: string
  onPressConfirmText?: string
  onPressConfirm?: () => void
}
type ConfirmProps = {
  onPressCancelText?: string
  onPressCancel?: () => void
} & AlertProps

const AlertScreen = (
  props:
    | {
        alertViewProps: AlertView
        alertType: 'confirm'
        alertProps: ConfirmProps
      }
    | {
        alertViewProps: AlertView
        alertType: 'alert'
        alertProps: AlertProps
      }
): ReactElement => {
  const { alertViewProps, alertProps } = props
  const onPressConfirm = (): void => {
    alertViewProps.close()
    alertProps.onPressConfirm && alertProps.onPressConfirm()
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
        {props.alertType === 'confirm' && (
          <TouchableOpacity
            style={[
              styles.buttonBox,
              { borderRightWidth: 1, borderColor: '#CED6F1' },
            ]}
            onPress={(): void => {
              alertViewProps.close()
              props.alertProps.onPressCancel &&
                props.alertProps.onPressCancel()
            }}
          >
            <Text style={styles.buttonText} fontType={'medium'}>
              {props.alertProps.onPressCancelText || 'Cancel'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.buttonBox}
          onPress={onPressConfirm}
        >
          <Text style={styles.buttonText} fontType={'medium'}>
            {alertProps.onPressConfirmText || 'Ok'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    marginHorizontal: 40,
  },
  textBox: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: 'center',
    marginBottom: 5,
  },
  desc: {
    fontSize: 15,
    lineHeight: 23,
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
  const { alertViewProps } = useApp()

  const alert = (props: AlertProps): void => {
    alertViewProps.open(
      AlertScreen({
        alertViewProps,
        alertType: 'alert',
        alertProps: props,
      })
    )
  }
  const confirm = (props: ConfirmProps): void => {
    alertViewProps.open(
      AlertScreen({
        alertViewProps,
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
