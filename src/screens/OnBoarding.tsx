import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { 
    Image, 
    View, 
    Text, 
    TouchableOpacity, 
    Platform,
    LogBox
 } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome5';

LogBox.ignoreLogs([
    // 다른 컴포넌트에서 State를 변경할 경우 발생되는 문제를 막기 위해 사용
    // https://reactjs.org/blog/2020/02/26/react-v16.13.0.html#warnings-for-some-updates-during-render
    'Warning: Cannot update a component from inside the function body of a different component.'
])

// H. REQ i18n
const PagerContents = [
    {
        image: require('../../assets/on_boarding_0.png'),
        title: 'Welcome Abroad',
        description: 'Terra Station is where you can experience through Terra network.',
    },
    {
        image: require('../../assets/on_boarding_1.png'),
        title: 'Manage Assets',
        description: 'Send and receive Terra coins from anyone around the world, or even swap among the coins.',
    },
    {
        image: require('../../assets/on_boarding_2.png'),
        title: 'Get More',
        description: 'Delegate your coins to Terra Validators to earn even more coins.',
    },
    {
        image: require('../../assets/on_boarding_3.png'),
        title: 'Get Involved',
        description: 'Vote and participate in proposals to develop the Terra Ecosystem.',
    },
    {
        image: require('../../assets/on_boarding_4.png'),
        title: 'Start Exploring',
        description: 'There are even more useful features. Start Exploring Terra Station',
    },
]


interface RenderSwiperProps {
    refSwipe: Swiper
    setLastPage: (b: boolean) => any
  }
  
const RenderSwiper = ({refSwipe, setLastPage}: RenderSwiperProps) => (
<Swiper
    ref={refSwipe}
    style={{
    // backgroundColor: '#eee',
    }}
    onIndexChanged={(index) => setLastPage( (index+1) === PagerContents.length )}
    loop={false}
    dot={ <View style={styles.SwiperDot} /> }
    activeDot={ <View style={styles.SwiperDotActive} /> }
    paginationStyle={{
    bottom: -15,
    }}>
    {PagerContents.map((v, i) => (
        <View key={i} style={styles.SwiperContent}>
            <Image source={v.image}  style={styles.SwiperContentImage} />
            <View>
            <Text style={styles.SwiperContentTitle}>{v.title}</Text>
            <Text style={styles.SwiperContentDesc}>{v.description}</Text>
            </View>
        </View>
        ))}
</Swiper>
)

interface RenderButtonProps {
refSwipe: Swiper
isLastPage: boolean
}

const RenderButton = ({refSwipe, navigation, isLastPage}) => (
<View style={styles.SwiperButtonContainer}>
    {
    !isLastPage
    ?
    <>
    <TouchableOpacity style={styles.SwiperButtonSkip}
        onPress={()=>enterTabs({navigation})}>
        <Text style={styles.SwiperButtonSkipText}>
        Skip
        </Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.SwiperButtonNext}
        onPress={()=>refSwipe.current.scrollBy(1)}>
        <Icon name="arrow-right" size={20} color="rgb(255,255,255)" />
    </TouchableOpacity>
    </>
    :
    <>
    <TouchableOpacity style={styles.SwiperButtonStart}
        onPress={()=>enterTabs({navigation})}>
        <Text style={{ fontSize:16, lineHeight:24, color:'rgb(255,255,255)'}}>Get Started</Text>
    </TouchableOpacity>
    </>
    }
</View>
)

const RenderLanguageButton = () => (
<View style={styles.SelectLanguageContainer}>
    <TouchableOpacity
    style={styles.SelectLanguageButton}>
    <Text style={styles.SelectLanguageButtonText}>English</Text>
    <Icon
        name="caret-down"
        size={10}
        color="rgb(32,67,181)"
        style={styles.SelectLanguageButtonCaret}
    />
    </TouchableOpacity>
</View>
)

const enterTabs = ({navigation}) => {
    setShowOnboarding()
    navigation.navigate("Tabs")
}

const ONBOARDING_KEY = 'skip_onboarding' // 다 만들고 위로 빼도록..
const setShowOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true')
}

const OnBoarding = () => {
    const [lastPage, setLastPage] = useState(false)
    const refSwipe = useRef<Swiper>(undefined!)
    const navigation = useNavigation()

    return (
        <>
            <RenderLanguageButton />
            <RenderSwiper refSwipe={refSwipe} setLastPage={setLastPage} />
            <RenderButton refSwipe={refSwipe} navigation={navigation} isLastPage={lastPage} />
        </>
    )
}

const styles = EStyleSheet.create({
    SelectLanguageContainer: {
      alignItems: 'flex-end',
      // backgroundColor: '#ccc',;
      marginTop: Platform.OS === 'ios' ? 40 : 0,
      padding: 10,
    },
    SelectLanguageButton: {
      padding: 10, 
      flexDirection: 'row',
    //   backgroundColor: '#bbb'
    },
    SelectLanguageButtonText: {
      color: 'rgb(32,67,181)'
    },
    SelectLanguageButtonCaret: {
      margin: 5,
    },
  
    SwiperDot: {
      backgroundColor: 'rgba(32, 67, 181, .2)',
      width: 6,
      height: 6,
      borderRadius: 3,
      margin: 7,
    },
    SwiperDotActive: {
      backgroundColor: 'rgba(32, 67, 181, 1)',
      width: 10,
      height: 10,
      borderRadius: 5,
      margin: 7,
    },
  
    SwiperContent: { 
      flex:1, 
      flexDirection:'column', 
      justifyContent:'space-around'
    },
    SwiperContentImage: {
      resizeMode:'contain',
      alignSelf: 'center',
    },
    SwiperContentTitle: {
      fontSize:24,
      lineHeight:36,
      color:'rgb(32,67,181)',
      textAlign:'center',
      marginBottom:5, 
      marginHorizontal:30,
    },
    SwiperContentDesc: {
      fontSize:16,
      lineHeight:24,
      color:'rgb(32,67,181)',
      textAlign:'center',
      marginHorizontal:30,
    },
  
    SwiperButtonContainer: {
      marginVertical: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    SwiperButtonSkip: {
      width: 150,
      height: 50,
      borderRadius: 25,
      paddingHorizontal: 58,
      paddingVertical: 13,
      backgroundColor: 'rgba(32,67,181,.1)',
      alignItems: 'center',
    },
    SwiperButtonSkipText: {
      color: 'rgba(32,67,181,1)',
      fontSize: 16,
      lineHeight: 24,
    },
    SwiperButtonNext: {
      width: 150,
      height: 50,
      borderRadius: 25,
      paddingHorizontal: 58,
      paddingVertical: 13,
      backgroundColor: 'rgba(32,67,181,1)',
      alignItems: 'center',
    },
    SwiperButtonStart: {
      width: 315,
      height: 50,
      borderRadius: 25,
      paddingHorizontal: 58,
      paddingVertical: 13,
      backgroundColor: 'rgba(32,67,181,1)',
      alignItems: 'center',
    },
    
  });

export default OnBoarding;