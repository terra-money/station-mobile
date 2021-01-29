import React, { ReactElement, useRef, useState } from 'react'
import {
  Image,
  View,
  TouchableOpacity,
  LogBox,
  StyleSheet,
} from 'react-native'

import Swiper from 'react-native-swiper'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { setSkipOnboarding } from '../utils/storage'

import { Text } from 'components'
import images from 'assets/images'
import color from 'styles/color'

LogBox.ignoreLogs([
  // https://reactjs.org/blog/2020/02/26/react-v16.13.0.html#warnings-for-some-updates-during-render
  'Warning: Cannot update a component from inside the function body of a different component.',
])

const PagerContents = [
  {
    image: images.on_boarding_0,
    title: 'Welcome aboard',
    description:
      'Terra Station is where you can experience through Terra network.',
  },
  {
    image: images.on_boarding_1,
    title: 'Manage assets',
    description:
      'Send and receive Terra coins from anyone around the world, or even swap among the coins.',
  },
  {
    image: images.on_boarding_2,
    title: 'Get rewards',
    description:
      'Delegate your coins to Terra Validators to earn even more coins.',
  },
  {
    image: images.on_boarding_4,
    title: 'Start exploring',
    description:
      'There are even more useful features. Start Exploring Terra Station.',
  },
]

interface RenderSwiperProps {
  refSwipe: React.RefObject<Swiper>
  setLastPage: (b: boolean) => void
}

const RenderSwiper = ({
  refSwipe,
  setLastPage,
}: RenderSwiperProps): ReactElement => (
  <Swiper
    ref={refSwipe}
    onIndexChanged={(index): void =>
      setLastPage(index + 1 === PagerContents.length)
    }
    loop={false}
    dot={<View style={styles.SwiperDot} />}
    activeDot={<View style={styles.SwiperDotActive} />}
    containerStyle={{ marginBottom: 65 }}
    paginationStyle={{ marginBottom: -30 }}
  >
    {PagerContents.map((v, i) => (
      <View key={i} style={styles.SwiperContent}>
        <Image source={v.image} style={styles.SwiperContentImage} />
        <View style={{ height: 163 }}>
          <Text style={styles.SwiperContentTitle} fontType={'bold'}>
            {v.title}
          </Text>
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
  setshowOnBoarding,
  isLastPage,
}: {
  refSwipe: React.RefObject<Swiper>
  setshowOnBoarding: React.Dispatch<React.SetStateAction<boolean>>
  isLastPage: boolean
}): ReactElement => {
  const enterTabs = (): void => {
    setSkipOnboarding(true)
    setshowOnBoarding(false)
  }

  return (
    <View style={styles.SwiperButtonContainer}>
      {!isLastPage ? (
        <>
          <TouchableOpacity
            style={styles.SwiperButtonSkip}
            onPress={enterTabs}
          >
            <Text
              style={styles.SwiperButtonSkipText}
              fontType={'bold'}
            >
              Skip
            </Text>
          </TouchableOpacity>
          <View style={{ width: 15 }} />
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
            onPress={enterTabs}
          >
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                color: 'rgb(255,255,255)',
              }}
              fontType={'bold'}
            >
              Get Started
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

const OnBoarding = ({
  setshowOnBoarding,
}: {
  setshowOnBoarding: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement => {
  const [lastPage, setLastPage] = useState(false)
  const refSwipe = useRef<Swiper>(null)

  return (
    <>
      <RenderSwiper refSwipe={refSwipe} setLastPage={setLastPage} />
      <RenderButton
        refSwipe={refSwipe}
        setshowOnBoarding={setshowOnBoarding}
        isLastPage={lastPage}
      />
    </>
  )
}

const styles = StyleSheet.create({
  SwiperDot: {
    backgroundColor: 'rgba(32, 67, 181, 0.2)',
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 7,
  },
  SwiperDotActive: {
    backgroundColor: color.sapphire,
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 7,
  },

  SwiperContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  SwiperContentImage: {
    resizeMode: 'contain',
    alignSelf: 'center',
    flex: 1,
  },
  SwiperContentTitle: {
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: 'center',
  },
  SwiperContentDesc: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
  },
  SwiperButtonContainer: {
    marginBottom: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  SwiperButtonSkip: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    paddingVertical: 13,
    backgroundColor: 'rgba(32, 67, 181, 0.2)',
    alignItems: 'center',
  },
  SwiperButtonSkipText: {
    color: color.sapphire,
    fontSize: 16,
    lineHeight: 24,
  },
  SwiperButtonNext: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    paddingVertical: 13,
    backgroundColor: color.sapphire,
    alignItems: 'center',
  },
  SwiperButtonStart: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 58,
    paddingVertical: 13,
    backgroundColor: color.sapphire,
    alignItems: 'center',
  },
})

export default OnBoarding
