import React, { ReactElement, useState, useCallback } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import _ from 'lodash'
import { AccAddress } from '@terra-money/terra.js'
import { useQuery } from 'react-query'

import { Token } from 'lib'

import color from 'styles/color'
import { Input, Icon, AssetIcon, Row } from 'components'
import Text from 'components/Text'
import useWhitelist from 'lib/cw20/useWhitelist'
import useLCD from 'lib/api/useLCD'
import { QueryKeyEnum } from 'types'
import { truncate } from 'lib/utils/format'
import useFinder from 'lib/hooks/useFinder'
import useLinking from 'hooks/useLinking'
import useTokens from 'hooks/useTokens'

const TokenSelector = ({
  closeModal,
}: {
  closeModal: () => void
}): ReactElement => {
  const { whitelist } = useWhitelist()
  const lcd = useLCD()
  const getLink = useFinder()
  const { openURL } = useLinking()

  const [searchInput, setSearchInput] = useState('')
  const { tokens, addToken, removeToken } = useTokens()

  const { data: filteredList = [] } = useQuery(
    [
      QueryKeyEnum.addToken_filteredList,
      whitelist,
      searchInput,
      tokens,
    ],
    async () => {
      if (searchInput) {
        const fromWhiteList = _.filter(
          whitelist,
          ({ symbol, token }) =>
            symbol
              .toLowerCase()
              .includes(searchInput.toLowerCase()) ||
            (AccAddress.validate(searchInput) &&
              token.includes(searchInput))
        )

        if (fromWhiteList.length > 0) {
          return fromWhiteList
        } else {
          try {
            const info = await lcd.wasm.contractQuery<Token>(
              searchInput,
              {
                token_info: {},
              }
            )

            return [{ ...info, token: searchInput }]
          } catch {}
          // no token searched then empty
          return []
        }
      }

      return _.map(whitelist, (item) => item)
    },
    {
      keepPreviousData: true,
    }
  )

  const renderItem = useCallback(
    (item: Token, index: number): ReactElement => {
      const url = getLink({
        q: 'address',
        v: item.token,
      })

      const added = !!tokens[item.token]

      return (
        <Row key={`items-${index}`} style={styles.item}>
          <Row style={{ alignItems: 'center' }}>
            <AssetIcon uri={item.icon} />
            <View style={{ paddingLeft: 10 }}>
              <Text style={styles.label} fontType={'bold'}>
                {item.symbol}
              </Text>
              <TouchableOpacity
                onPress={(): void => {
                  openURL(url)
                }}
              >
                <Row style={{ alignItems: 'center' }}>
                  <Text style={styles.address_decimal}>
                    {`${truncate(item.token, [6, 6])} (decimals: ${
                      item.decimals || 6
                    })`}
                  </Text>
                  <Icon
                    size={12}
                    color={color.primary._02}
                    name={'open-in-new'}
                  />
                </Row>
              </TouchableOpacity>
            </View>
          </Row>

          <TouchableOpacity
            onPress={(): void => {
              added
                ? removeToken(item.token)
                : addToken({ [item.token]: item })
            }}
            style={styles.buttonView}
          >
            {added ? (
              <View
                style={[
                  styles.addButtonBox,
                  { backgroundColor: color.primary._02 },
                ]}
              >
                <Icon name="done" size={16} color={color.white} />
              </View>
            ) : (
              <View style={styles.addButtonBox}>
                <Icon
                  name="add"
                  size={16}
                  color={color.primary._02}
                />
              </View>
            )}
          </TouchableOpacity>
        </Row>
      )
    },
    [tokens]
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
          <Text fontType="bold">Add tokens</Text>
          <TouchableOpacity onPress={closeModal}>
            <Icon name="close" color={color.sapphire} size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchBox}>
          <Input
            placeholder={'Search symbol or address'}
            value={searchInput}
            onChangeText={setSearchInput}
          />
        </View>
        {_.some(filteredList) ? (
          <ScrollView
            style={{
              paddingHorizontal: 20,
              marginBottom: 20,
            }}
          >
            <View>{_.map(filteredList, renderItem)}</View>
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

export default TokenSelector

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
  item: {
    height: 62,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBox: {
    paddingHorizontal: 20,
    paddingBottom: 30,
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
    color: color.primary._02,
  },
  buttonView: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: '100%',
    flex: 1,
  },
  addButtonBox: {
    padding: 6,
    backgroundColor: color.primary._04,
    borderRadius: 100,
  },
})
