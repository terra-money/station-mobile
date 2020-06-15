import React, { ReactNode } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { API } from '@terra-money/use-native-station'

interface Props extends Partial<API<any>> {
  title?: string
  badge?: string
  action?: ReactNode
  onPress?: () => void
  content?: string
  children?: ReactNode
  dark?: boolean
}

const Card = ({ title, badge, action, content, children, ...rest }: Props) => {
  const { onPress, dark, error, loading } = rest
  const textStyle = [styles.text, dark && darkStyles.text]

  const render = () => (
    <View style={[styles.card, dark ? darkStyles.card : lightStyles.card]}>
      {title && (
        <View style={styles.header}>
          <Text style={[textStyle, styles.title]}>{title}</Text>
          {action ?? (badge && <Text style={textStyle}>{badge}</Text>)}
        </View>
      )}

      {error ? (
        <Text style={textStyle}>{error.message}</Text>
      ) : loading ? (
        <Text style={textStyle}>Loading...</Text>
      ) : (
        children ?? <Text style={textStyle}>{content}</Text>
      )}
    </View>
  )

  return onPress ? (
    <TouchableOpacity onPress={onPress}>
      {render()}
    </TouchableOpacity>
  ) : (
    render()
  )
}

export default Card

/* styles */
const styles = StyleSheet.create({
  text: {
    color: '#2043b5',
  },

  card: {
    borderRadius: 20,
    margin: 20,
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  title: {
    fontWeight: 'bold',
  },
})

const lightStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
  },
})

const darkStyles = StyleSheet.create({
  text: { color: 'white' },
  card: { backgroundColor: '#2043b5' },
})
