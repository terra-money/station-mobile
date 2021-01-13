import { useNavigation } from '@react-navigation/native'
import React, { ReactElement, useRef, useState } from 'react'
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Platform,
  LogBox,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Swiper from 'react-native-swiper'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { setSkipOnboarding } from '../utils/storage'

import images from 'assets/images'

LogBox.ignoreLogs([
  // https://reactjs.org/blog/2020/02/26/react-v16.13.0.html#warnings-for-some-updates-during-render
  'Warning: Cannot update a component from inside the function body of a different component.',
])

// H. REQ i18n
const PagerContents = [
  {
    image: images.on_boarding_0,
    title: 'Welcome Abroad',
    description:
      'Terra Station is where you can experience through Terra network.',
  },
  {
    image: images.on_boarding_1,
    title: 'Manage Assets',
    description:
      'Send and receive Terra coins from anyone around the world, or even swap among the coins.',
  },
  {
    image: images.on_boarding_2,
    title: 'Get More',
    description:
      'Delegate your coins to Terra Validators to earn even more coins.',
  },
  {
    image: images.on_boarding_3,
    title: 'Get Involved',
    description:
      'Vote and participate in proposals to develop the Terra Ecosystem.',
  },
  {
    image: images.on_boarding_4,
    title: 'Start Exploring',
    description:
      'There are even more useful features. Start Exploring Terra Station',
  },
]

interface RenderSwiperProps {
  refSwipe: React.RefObject<Swiper>
  setLastPage: (b: boolean) => any
}

const RenderSwiper = ({
  refSwipe,
  setLastPage,
}: RenderSwiperProps): ReactElement => (
  <Swiper
    ref={refSwipe}
    style={
      {
        // backgroundColor: '#eee',
      }
    }
    onIndexChanged={(index): void =>
      setLastPage(index + 1 === PagerContents.length)
    }
    loop={false}
    dot={<View style={styles.SwiperDot} />}
    activeDot={<View style={styles.SwiperDotActive} />}
    paginationStyle={{
      bottom: -15,
    }}
  >
    {PagerContents.map((v, i) => (
      <View key={i} style={styles.SwiperContent}>
        <Image source={v.image} style={styles.SwiperContentImage} />
        <View>
          <Text style={styles.SwiperContentTitle}>{v.title}</Text>
          <Text style={styles.SwiperContentDesc}>
            {v.description}
          </Text>
        </View>
      </View>
    ))}
  </Swiper>
)

const RenderButton = ({
  refSwipe,
  navigation,
  isLastPage,
}: {
  refSwipe: React.RefObject<Swiper>
  navigation: any
  isLastPage: boolean
}): ReactElement => (
  <View style={styles.SwiperButtonContainer}>
    {!isLastPage ? (
      <>
        <TouchableOpacity
          style={styles.SwiperButtonSkip}
          onPress={(): void => enterTabs({ navigation })}
        >
          <Text style={styles.SwiperButtonSkipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.SwiperButtonNext}
          onPress={(): void => refSwipe.current?.scrollBy(1)}
        >
          <Icon
            name="arrow-right"
            size={20}
            color="rgb(255,255,255)"
          />
        </TouchableOpacity>
      </>
    ) : (
      <>
        <TouchableOpacity
          style={styles.SwiperButtonStart}
          onPress={(): void => enterTabs({ navigation })}
        >
          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              color: 'rgb(255,255,255)',
            }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      </>
    )}
  </View>
)

const RenderLanguageButton = (): ReactElement => (
  <View style={styles.SelectLanguageContainer}>
    <TouchableOpacity style={styles.SelectLanguageButton}>
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

const enterTabs = ({ navigation }: { navigation: any }): void => {
  setSkipOnboarding(true)
  navigation.navigate('Tabs')
}

const OnBoarding = (): ReactElement => {
  const [lastPage, setLastPage] = useState(false)
  const refSwipe = useRef<Swiper>(undefined!)
  const navigation = useNavigation()

  return (
    <>
      <RenderLanguageButton />
      <RenderSwiper refSwipe={refSwipe} setLastPage={setLastPage} />
      <RenderButton
        refSwipe={refSwipe}
        navigation={navigation}
        isLastPage={lastPage}
      />
    </>
  )
}

const styles = EStyleSheet.create({
  SelectLanguageContainer: {
    alignItems: 'flex-end',
    // backgroundColor: '#ccc',;
    marginTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    padding: 10,
  },
  SelectLanguageButton: {
    padding: 10,
    flexDirection: 'row',
    //   backgroundColor: '#bbb'
  },
  SelectLanguageButtonText: {
    color: '$primaryColor',
  },
  SelectLanguageButtonCaret: {
    margin: 5,
  },

  SwiperDot: {
    backgroundColor: '$primaryColorOp20',
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 7,
  },
  SwiperDotActive: {
    backgroundColor: '$primaryColor',
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 7,
  },

  SwiperContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  SwiperContentImage: {
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  SwiperContentTitle: {
    fontSize: 24,
    lineHeight: 36,
    color: '$primaryColor',
    textAlign: 'center',
    marginBottom: 5,
    marginHorizontal: 30,
  },
  SwiperContentDesc: {
    fontSize: 16,
    lineHeight: 24,
    color: '$primaryColor',
    textAlign: 'center',
    marginHorizontal: 30,
  },

  SwiperButtonContainer: {
    marginVertical: 30,
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
    backgroundColor: '$primaryColorOp10',
    alignItems: 'center',
  },
  SwiperButtonSkipText: {
    color: '$primaryColor',
    fontSize: 16,
    lineHeight: 24,
  },
  SwiperButtonNext: {
    width: 150,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 58,
    paddingVertical: 13,
    backgroundColor: '$primaryColor',
    alignItems: 'center',
  },
  SwiperButtonStart: {
    width: 315,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 58,
    paddingVertical: 13,
    backgroundColor: '$primaryColor',
    alignItems: 'center',
  },
})

export default OnBoarding
