import React, { ReactElement, useCallback } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import _ from 'lodash'

import { Token } from 'lib'

import { COLOR } from 'consts'
import { Icon, AssetIcon, Row } from 'components'
import Text from 'components/Text'
import { truncate } from 'lib/utils/format'
import useFinder from 'lib/hooks/useFinder'
import useLinking from 'hooks/useLinking'
import useTokens from 'hooks/useTokens'
import useWhitelist from 'lib/cw20/useWhitelist'

const TokenManager = ({
  closeModal,
}: {
  closeModal: () => void
}): ReactElement => {
  const getLink = useFinder()
  const { openURL } = useLinking()

  const { tokens, removeToken } = useTokens()
  const { whitelist } = useWhitelist()

  const renderItem = useCallback(
    (item: Token, index: number): ReactElement => {
      if (!whitelist?.hasOwnProperty(item.token)) return

      const url = getLink({
        q: 'address',
        v: item?.token,
      })

      return (
        <Row key={`items-${index}`} style={styles.item}>
          <Row style={{ alignItems: 'center' }}>
            <AssetIcon uri={item?.icon} />
            <View style={{ paddingLeft: 10 }}>
              <Text style={styles.label} fontType={'bold'}>
                {item?.symbol || item?.name}
              </Text>
              <TouchableOpacity
                onPress={(): void => {
                  openURL(url)
                }}
              >
                <Row style={{ alignItems: 'center' }}>
                  <Text style={styles.address_decimal}>
                    {`${truncate(item?.token, [6, 6])} (decimals: ${
                      item?.decimals || 6
                    })`}
                  </Text>
                  <Icon
                    size={12}
                    color={COLOR.primary._02}
                    name={'open-in-new'}
                  />
                </Row>
              </TouchableOpacity>
            </View>
          </Row>

          <TouchableOpacity
            onPress={(): void => {
              removeToken(item?.token)
            }}
            style={styles.buttonView}
          >
            <View style={styles.addButtonBox}>
              <Icon
                name="delete"
                size={16}
                color={COLOR.primary._02}
              />
            </View>
          </TouchableOpacity>
        </Row>
      )
    },
    [tokens, whitelist]
  )

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
          <Text fontType="bold">Added tokens</Text>
          <TouchableOpacity onPress={closeModal}>
            <Icon name="close" color={COLOR.primary._02} size={24} />
          </TouchableOpacity>
        </View>
        {_.some(tokens) ? (
          <ScrollView
            style={{
              paddingHorizontal: 20,
              marginBottom: 20,
            }}
          >
            <View>{_.map(tokens, renderItem)}</View>
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
              color={COLOR.primary._02}
              style={{ marginBottom: 8 }}
            />
            <Text fontType="medium">No results found.</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default TokenManager

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
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
  item: {
    height: 62,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
  },
  address_decimal: {
    fontSize: 11,
    lineHeight: 16.5,
    letterSpacing: 0,
    color: COLOR.primary._02,
  },
  buttonView: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: '100%',
    flex: 1,
  },
  addButtonBox: {
    padding: 6,
    backgroundColor: COLOR.primary._04,
    borderRadius: 100,
  },
})
