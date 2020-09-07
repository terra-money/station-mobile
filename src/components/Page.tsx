import React, { FC } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { API } from '@terra-money/use-native-station'
import Icon from 'react-native-vector-icons/MaterialIcons'
import EStyleSheet from 'react-native-extended-stylesheet';

interface Props extends Partial<API<any>> {
  title: string
}

const Page: FC<Props> = ({ loading, error, title, children }) => {
  const { navigate } = useNavigation()
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={() => navigate('AuthMenu')} style={styles.user}>
          <Icon name="account-circle" size={34} color="#2043b5" />
        </TouchableOpacity>
      </View>

      {error ? (
        <Text>{error.message}</Text>
      ) : loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView><View style={{marginBottom: 50}}>{children}</View></ScrollView>
      )}
    </SafeAreaView>
  )
}

export default Page

const styles = EStyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: "$primaryColor",
    fontSize: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    lineHeight: 42,
    fontFamily: "TerraCompact-Bold"
  },
  user: {
    paddingHorizontal: 20,
    paddingTop: 24,
  }
})
