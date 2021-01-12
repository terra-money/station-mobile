import React, { FC } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { API } from '@terra-money/use-native-station'
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

  return (
    <View style={{ flex: 1 }}>
      <SubPageHeader title={title} />
      {error ? (
        <Text>{error.message}</Text>
      ) : loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* <Text>Loading</Text> */}
          <ActivityIndicator animating size="large" color="#aaa" />
        </View>
      ) : (
        <ScrollView>
          <View style={{ marginBottom: 50 }}>{children}</View>
        </ScrollView>
      )}
    </View>
  )
}

export default SubPage
