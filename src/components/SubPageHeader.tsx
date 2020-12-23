import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
  StatusBar
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons'


interface HeaderProps {
  title?: string
  headerTop?: HeaderTopProps
}

interface HeaderTopProps {
  icName?: string;
  icSize?: number;
}

interface HeaderBottomProps {
  title: string;
}

const HeaderSafeArea = () => {
  const insets = useSafeAreaInsets()
  console.log('insets.top', insets.top)
  console.log('insets.bottom', insets.bottom)

  return (
    <>
      {
        Platform.OS === 'ios'
          ? <View style={{ backgroundColor: 'rgba(32, 67, 181, 1)', height: insets.top }} />
          : null
      }
    </>
  )
}

const HeaderTop = ({ icName: iconName, icSize: iconSize }: HeaderTopProps) => {
  const navigation = useNavigation();
  console.log('canGoBack', navigation.canGoBack())

  return (
    <>
      <HeaderSafeArea />
      {
        navigation.canGoBack()
          ?
          <View style={[styles.headerChild, styles.headerChildFixedHeight]}>
            <TouchableOpacity onPress={() => {
              navigation.canGoBack() && navigation.goBack()
            }}>
              <Icon name={iconName ?? 'chevron-left'} size={iconSize ?? 28} color='#fff' />
            </TouchableOpacity>
          </View>
          :
          <View style={[styles.headerChild, { paddingTop: 20 }]} />
      }
    </>
  );
}

const HeaderBottom = ({ title }: HeaderBottomProps) => {
  return (
    <View style={[styles.headerChild,]}>
      <Text style={{ fontSize: 26, lineHeight: 39, color: '#fff' }}>{title}</Text>
    </View>
  );
}

const SubPageHeader = ({ title, headerTop }: HeaderProps) => {
  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor='rgba(32, 67, 181, 1)' />
    <View style={styles.headerContainer}>
      <HeaderTop {...headerTop} />
      <HeaderBottom title={title} />
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  /**
   * 기본 container style
   */
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(32, 67, 181, 1)'
  },
  /**
   * Header top, bottom 공통 style
   */
  headerChild: {
    width: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  /**
   * BackButton에 사용되는 추가 style, 60으로 높이 고정
   */
  headerChildFixedHeight: {
    height: 60,
  },
});

export default SubPageHeader