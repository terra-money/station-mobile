import React from 'react'
import { View, Text } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import SubPageHeader from '../components/SubPageHeader'

interface SettingItemProps {
  k: string // key
  v: string // value
}

interface ButtonItemProps {
  name: string
  icon: string
}

interface SeparatorProps {
  height: number | string
}

const Setting = () => {
  const SettingItem = ({k, v}: SettingItemProps) => (
    <>
      <TouchableOpacity style={styles.settingContainer}>
        <Text style={styles.settingKey}>{k}</Text>
        <Text style={styles.settingValue}>{v}</Text>
      </TouchableOpacity>
    </>
  )
  const ButtonItem = ({name, icon}: ButtonItemProps) => (
    <>
      <TouchableOpacity style={[styles.settingContainer, {justifyContent: 'center'}]}>
        <Icon name="wallet" color='rgb(32,67,181)' size={24} style={{ marginRight: 5 }} />
        <Text style={styles.buttonText}>Connect</Text>
      </TouchableOpacity>
    </>
  )
  
  const Separator = ({height}: SeparatorProps) => (
    <View style={{
      height:height, 
      width:'100%', 
      backgroundColor:'transparent'
    }} />
  )

  return (
    <View style={{backgroundColor:'rgb(249, 250, 255)'}}>
      <SubPageHeader title="settings" />
      {
        // 로그인 이후 나올 설정
      }
      {
        // 로그인 이전 나올 설정
        <>
        <SettingItem k='Lauguage' v='English' />
        <Separator height={1} />
        <SettingItem k='Currency' v='UST' />
        <Separator height={1} />
        <SettingItem k='Network' v='Columbus-4' />
        <Separator height={20} />
        <ButtonItem name='Connect' icon='wallet' />
        </>
      }
      {
      }
    </View>
  )
}

const styles = EStyleSheet.create({
  settingContainer: {
    backgroundColor: 'white',
    flexDirection: 'row', 
    justifyContent:'space-between',
    padding: 20,
  },
  settingKey: {
    fontSize: 16,
    lineHeight: 24,
    color: "$primaryColor",
  },
  settingValue: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgb(84, 147, 247)',
  },
  buttonText: {
    fontSize:16,
    lineHeight:24,
    color: "$primaryColor",
  }
})

export default Setting