import React, { FC } from 'react'
import { ImageBackgroundComponent, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { API } from '@terra-money/use-native-station'
import Icon from 'react-native-vector-icons/MaterialIcons'
import EStyleSheet from 'react-native-extended-stylesheet';
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace'

interface Props extends Partial<API<any>> {
  title: string
}

/**
 * TAB Navigation 화면
 * Header View와 ScrollView로 구성
 */
const Page: FC<Props> = ({ loading, error, title, children }) => {
  // console.log("Page Load:", {loading, error, title, children})
  const { navigate } = useNavigation()
  
  /**
   * 이 값을 어디서 컨트롤 할 수 있을지 확인 필요함
   */
  const isAuth = false

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          {
            // !auth
            isAuth
            ? null
            : 
            <TouchableOpacity onPress={() => navigate('AuthMenu')} style={styles.user}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                margin: 10,
                borderColor: '#2043b5',
                borderWidth: 2,
                borderRadius: 14,

                paddingHorizontal: 10,
                paddingVertical: 6,
              }}>
                <Icon name="account-balance-wallet" size={14} color="#2043b5" style={{marginRight: 8}} />
                <Text style={styles.connectText}>CONNECT</Text>
                </View>
            </TouchableOpacity>
          }
          
          <TouchableOpacity onPress={()=>{}} style={styles.user}>
            {
              /** 인증이 되지 않았으면 CONNECT와 SETTINGS버튼, 인증 되어 있으면 WALLET버튼 */
              // !auth
              isAuth
              ? <Icon name="account-balance-wallet" size={28} color="#2043b5" />
              : <Icon name="settings" size={24} color="#2043b5" />
            }
          </TouchableOpacity>
        </View>
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
    // marginVertical: 22,
    marginHorizontal: 20,
  },
  title: {
    color: "$primaryColor",
    fontSize: 24,
    // paddingTop: 20,
    // paddingBottom: 10,
    lineHeight: 36,
    // fontFamily: "TerraCompact-Bold"
    fontFamily: "$fontGothamBold",

    alignSelf: 'center',
    // backgroundColor: '#ccc',
  },
  connect: {
    // backgroundColor: '#ccc',
    margin: 10,
    // paddingHorizontal: 20,
    // paddingTop: 20,
  },
  connectText: {
    color: "$primaryColor",
    fontFamily: '$fontGothamMedium',
    fontSize: 10, 
    lineHeight: 15, 
    letterSpacing: -0.4,
  },
  user: {
    // backgroundColor: '#bbb',
    // paddingHorizontal: 20,
    // paddingTop: 20,
  }
})
