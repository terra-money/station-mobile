import React, { ReactElement } from 'react'
import { View, Image, StyleSheet } from 'react-native'

import { Option } from 'lib'
import color from 'styles/color'

import { isNativeDenom } from 'utils/util'

import Terra from 'assets/svg/Terra'
import layout from 'styles/layout'

const ICON_SIZE = 18

const AssetIcon = ({ option }: { option: Option }): ReactElement => {
  const uri = option.icon
  const isToken = false === isNativeDenom(option.value)

  return uri ? (
    <View
      style={[
        styles.assetIcon,
        {
          backgroundColor: isToken ? '#131A2F' : 'transparent',
          padding: isToken ? 2 : 0,
          width: ICON_SIZE,
          height: ICON_SIZE,
        },
      ]}
    >
      <Image
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  ) : (
    <Terra width={ICON_SIZE} height={ICON_SIZE} />
  )
}

export default AssetIcon

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    paddingTop: 25,
    paddingBottom: layout.getNotchCoverPaddingBottom,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  item: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    paddingLeft: 17,
  },
  assetIcon: {
    borderRadius: 100,
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
