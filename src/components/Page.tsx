import React, { FC } from 'react'
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { API } from '@terra-money/use-native-station'

interface Props extends Partial<API<any>> {
  title: string
}

const Page: FC<Props> = ({ loading, error, title, children }) => {
  const { navigate } = useNavigation()
  return (
    <SafeAreaView>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={() => navigate('Auth')}>
        <Text>Settings</Text>
      </TouchableOpacity>

      {error ? (
        <Text>{error.message}</Text>
      ) : loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView>{children}</ScrollView>
      )}
    </SafeAreaView>
  )
}

export default Page

const styles = StyleSheet.create({
  title: {
    color: '#2043b5',
    fontSize: 28,
    fontWeight: 'bold',
    padding: 20,
  },
})
