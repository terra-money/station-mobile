import React, { FC } from 'react'
import { ActivityIndicator, ImageBackgroundComponent, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { API } from '@terra-money/use-native-station'
import Icon from 'react-native-vector-icons/MaterialIcons'
import EStyleSheet from 'react-native-extended-stylesheet';
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace'
import SubPageHeader from '../components/SubPageHeader'

interface Props extends Partial<API<any>> {
  title: string
}

/**
 * TAB Navigation 화면
 * Header View와 ScrollView로 구성
 */
const SubPage: FC<Props> = ({ loading, error, title, children }) => {
  // console.log("Page Load:", {loading, error, title, children})
  const { navigate } = useNavigation()
  
  return (
    <View style={{flex:1}}>
      <SubPageHeader title={title} />
      {error ? (
        <Text>{error.message}</Text>
      ) : loading ? (
        <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
        {/* <Text>Loading</Text> */}
          <ActivityIndicator animating={true} size="large" color="#aaa" />
        </View>
      ) : (
        <ScrollView><View style={{marginBottom: 50}}>{children}</View></ScrollView>
      )}
    </View>
  )
}

export default SubPage

const styles = EStyleSheet.create({
})
