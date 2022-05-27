import React, { ReactElement, useEffect, useState } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native'
import _ from 'lodash'
import { StackScreenProps } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'

import { COLOR } from 'consts'

import { RootStackParams } from 'types'
import {
  useAssets,
  AssetsUI,
  User,
  VestingUI,
  Card,
  AvailableItem,
  TerraNativeUI,
  useCurrentChainName,
} from 'lib'
import { Text, Icon, Row, Button } from 'components'

import Preferences, {
  PreferencesEnum,
} from 'nativeModules/preferences'
import CardComp from 'components/Card'

import VestingItem from './VestingItem'
import TokenSelector from './TokenSelector'
import TokenManager from './TokenManager'
import AssetItem from '../../components/wallet/AssetItem'
import { useIsClassic } from "lib/contexts/ConfigContext";

type Props = StackScreenProps<RootStackParams, 'Wallet'>

const AvailableList = ({
  list,
}: {
  list: AvailableItem[]
}): ReactElement => {
  return (
    <View>
      {_.map(list, (item, index) => (
        <AssetItem key={`AvailableList-${index}`} item={item} />
      ))}
    </View>
  )
}

const VestingList = ({ list, title }: VestingUI): ReactElement => {
  return (
    <View>
      {_.map(list, (item, index) => (
        <VestingItem
          key={`VestingList-${index}`}
          item={item}
          title={title}
        />
      ))}
    </View>
  )
}

const EmptyWallet = ({ card }: { card?: Card }): ReactElement => {
  return card ? (
    <View style={styles.emptyWalletCard}>
      <Row
        style={{
          marginBottom: 5,
          alignItems: 'center',
        }}
      >
        <Icon
          name={'info-outline'}
          size={20}
          color={COLOR.primary._02}
        />
        <Text style={styles.emptyWalletCardTitle} fontType={'bold'}>
          {card.title}
        </Text>
      </Row>
      <Text
        style={{ lineHeight: 21 }}
      >{`This wallet does not hold any coins.`}</Text>
    </View>
  ) : (
    <View />
  )
}

const TerraNativeHideSmallCheckBox = ({
  available,
}: {
  available?: TerraNativeUI
}): ReactElement => {
  return (
    <>
      {available && (
        <TouchableOpacity
          onPress={async (): Promise<void> => {
            Preferences.setString(
              PreferencesEnum.walletHideSmall,
              available.hideSmall.checked ? 'show' : 'hide'
            )
            available.hideSmall.toggle()
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={styles.hideSmallLabel}>
            {available.hideSmall.label}
          </Text>
          <View style={styles.hideSmallCheckBox}>
            {!!available.hideSmall.checked && (
              <View style={styles.hideSmallChecked} />
            )}
          </View>
        </TouchableOpacity>
      )}
    </>
  )
}

const AvailableAssets = ({
  user,
  navigation,
  localHideSmall,
  setlocalHideSmall,
  refreshingKey,
}: {
  user: User
  localHideSmall?: boolean
  setlocalHideSmall: (value: boolean) => void
  refreshingKey: number
} & Props): ReactElement => {
  const { ui, load, setHideSmall } = useAssets(user, {
    hideSmall: localHideSmall,
  })
  const [isVisibleModal, setIsVisibleModal] = useState<
    'add' | 'manage' | false
  >(false)
  const { addListener, removeListener } = useNavigation()

  const chainName = useCurrentChainName()
  const isClassic = useIsClassic()

  // If list length is 0 on hiding small-balance-assets, then show small-balance-assets.
  useEffect(() => {
    if (
      localHideSmall &&
      ui?.available?.list &&
      ui.available.list.length < 1
    ) {
      setHideSmall(false)
      setlocalHideSmall(false)
    }
  }, [ui?.available])

  useEffect(() => {
    refreshingKey && load()
  }, [refreshingKey])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      load()
    })

    addListener('blur', (): void => {
      setIsVisibleModal(false)
    })

    return (): void => {
      unsubscribe()
      removeListener('blur', (): void => {
        setIsVisibleModal(false)
      })
    }
  }, [chainName])

  const render = ({
    available,
    ibc,
    tokens,
    vesting,
    card,
  }: AssetsUI): ReactElement => {
    return tokens || available || vesting || ibc ? (
      <>
        <View style={styles.section}>
          {card && (
            <CardComp {...card} style={{ marginHorizontal: 0 }} />
          )}
          {(available || vesting) && (
            <Row
              style={{
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <Text style={styles.assetListTitle} fontType="bold">
                {available?.title}
              </Text>
              <TerraNativeHideSmallCheckBox available={available} />
            </Row>
          )}
          {available && <AvailableList {...available} />}
          {vesting && <VestingList {...vesting} />}
        </View>

        {ibc && (
          <View style={styles.section}>
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.assetListTitle} fontType="bold">
                {ibc.title}
              </Text>
            </View>
            <AvailableList {...ibc} />
          </View>
        )}

        {tokens?.list?.length > 0 && (
          <View style={styles.section}>
            <Row
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <Text style={styles.assetListTitle} fontType="bold">
                {tokens.title}
              </Text>
              <TouchableOpacity
                onPress={(): void => {
                  setIsVisibleModal('manage')
                }}
              >
                <Icon
                  name={'settings'}
                  size={20}
                  color={COLOR.primary._02}
                  style={{ padding: 4 }}
                />
              </TouchableOpacity>
            </Row>
            <AvailableList {...tokens} />
          </View>
        )}
        {
          isClassic && (
            <Button
              onPress={(): void => {
                setIsVisibleModal('add')
              }}
              size="sm"
              title={
                <Row style={{ alignItems: 'center' }}>
                  <Icon name="add" size={16} color={COLOR.primary._02} />
                  <Text
                    style={{ color: COLOR.primary._02 }}
                    fontType="medium"
                  >
                    Add Token
                  </Text>
                </Row>
              }
              containerStyle={{
                marginBottom: 30,
                backgroundColor: '#E8EEFC',
              }}
            />
          )
        }
        <Modal
          onRequestClose={(): void => {
            setIsVisibleModal(false)
          }}
          transparent
          visible={!!isVisibleModal}
        >
          {isVisibleModal === 'add' ? (
            <TokenSelector
              closeModal={(): void => {
                setIsVisibleModal(false)
              }}
            />
          ) : (
            <TokenManager
              closeModal={(): void => {
                setIsVisibleModal(false)
              }}
            />
          )}
        </Modal>
      </>
    ) : (
      <EmptyWallet card={card} />
    )
  }

  return <>{ui ? render(ui) : null}</>
}

export default AvailableAssets

const styles = StyleSheet.create({
  section: { marginBottom: 10 },
  assetListTitle: {
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
  },
  emptyWalletCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 35,
    shadowOpacity: 1,
  },
  emptyWalletCardTitle: {
    marginLeft: 7,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    color: COLOR.primary._02,
  },
  hideSmallLabel: {
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
  },
  hideSmallCheckBox: {
    marginHorizontal: 5,
    width: 16,
    height: 16,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cfd8ea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hideSmallChecked: {
    width: 8,
    height: 8,
    borderRadius: 1,
    backgroundColor: '#0c3694',
  },
})
