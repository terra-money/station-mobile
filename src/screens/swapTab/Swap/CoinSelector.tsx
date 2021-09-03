import React, { ReactElement, useState } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import _ from 'lodash'

import { format, Option, Options } from 'lib'

import color from 'styles/color'
import { Input, Icon, Number } from 'components'
import Text from 'components/Text'

import AssetIcon from './AssetIcon'
import { isNativeDenom } from 'utils/util'

const CoinSelector = ({
  closeModal,
  list,
  onSelect,
}: {
  closeModal: () => void

  list: Options
  onSelect: (option: Option) => void
}): ReactElement => {
  const [searchInput, setSearchInput] = useState('')
  const searchFiltered = list.filter((x) =>
    x?.children.toLowerCase().includes(searchInput.toLowerCase())
  )
  const nativeTokenList = searchFiltered.filter((x) =>
    isNativeDenom(x.value)
  )
  const contractTokenList = searchFiltered.filter(
    (x) => false === isNativeDenom(x.value)
  )

  const renderItem = (item: Option, index: number): ReactElement => {
    return (
      <TouchableOpacity
        key={`items-${index}`}
        onPress={(): void => {
          onSelect(item)
          closeModal()
        }}
        activeOpacity={item.disabled ? 1 : undefined}
        style={styles.item}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <AssetIcon option={item} />
          <Text style={styles.label} fontType={'medium'}>
            {item.children}
          </Text>
        </View>

        <Number
          numberFontStyle={{ fontSize: 14, textAlign: 'left' }}
          decimalFontStyle={{ fontSize: 10.5 }}
          value={format.amount(item.balance || '0')}
        />
      </TouchableOpacity>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.5)',
      }}
    >
      <TouchableOpacity
        onPress={closeModal}
        style={{ height: 160 }}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text fontType="bold">Select a coin</Text>
          <TouchableOpacity onPress={closeModal}>
            <Icon name="close" color={color.sapphire} size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchBox}>
          <Input
            placeholder={'Search name'}
            value={searchInput}
            onChangeText={setSearchInput}
          />
        </View>
        {_.some(nativeTokenList) || _.some(contractTokenList) ? (
          <ScrollView
            style={{ paddingHorizontal: 20, marginBottom: 20 }}
          >
            {_.some(nativeTokenList) && (
              <>
                <Text style={styles.listTitle} fontType="medium">
                  NATIVE
                </Text>
                <View style={styles.listBox}>
                  {_.map(nativeTokenList, renderItem)}
                </View>
              </>
            )}

            {_.some(contractTokenList) && (
              <>
                <Text style={styles.listTitle} fontType="medium">
                  TOKEN
                </Text>
                <View style={styles.listBox}>
                  {_.map(contractTokenList, renderItem)}
                </View>
              </>
            )}
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: '10%',
            }}
          >
            <Icon
              name="inbox"
              size={56}
              color={color.primary._02}
              style={{ marginBottom: 8 }}
            />
            <Text fontType="medium">No results found.</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default CoinSelector

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    paddingTop: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  listTitle: {
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
    paddingBottom: 10,
    paddingTop: 20,
  },
  listBox: {
    borderTopWidth: 1,
    borderTopColor: '#edf1f7',
  },
  item: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBox: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    paddingLeft: 10,
  },
})
