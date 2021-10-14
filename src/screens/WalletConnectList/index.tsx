import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import _ from 'lodash'
import WalletConnect from '@walletconnect/client'
import { useRecoilValue } from 'recoil'

import { COLOR, LAYOUT } from 'consts'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import { Button, Icon, Text } from 'components'
import SubHeader from 'components/layout/SubHeader'

import WalletConnectStore from 'stores/WalletConnectStore'
import useWalletConnect from 'hooks/useWalletConnect'
import { useAlert } from 'hooks/useAlert'
import useTopNoti from 'hooks/useTopNoti'
import { useModal } from 'hooks/useModal'

import ConnectorSettingModal from './ConnectorSettingModal'

const Render = (): ReactElement => {
  // after connected then set connector
  const walletConnectors = useRecoilValue(
    WalletConnectStore.walletConnectors
  )

  const { modal } = useModal()
  const { showNoti } = useTopNoti()
  const { confirm } = useAlert()
  const {
    disconnectWalletConnect,
    removeWalletConnect,
    disconnectAllWalletConnect,
  } = useWalletConnect()

  const disconnect = (connector: WalletConnect): void => {
    const { handshakeTopic } = connector
    disconnectWalletConnect(handshakeTopic)
    removeWalletConnect(handshakeTopic)
    showNoti({
      message: `${connector.peerMeta?.name} is disconnected`,
      type: 'danger',
    })
    modal.close()
  }

  const List = (): ReactElement => {
    return (
      <View>
        {_.map(walletConnectors, (connector) => {
          const peerMeta = connector.session.peerMeta
          return (
            <TouchableOpacity
              style={styles.connectItemBox}
              onPress={(): void => {
                modal.open(
                  ConnectorSettingModal({
                    modal,
                    disconnectWalletConnect: (): void => {
                      disconnect(connector)
                    },
                  })
                )
              }}
              key={`connectors-${connector.handshakeTopic}`}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle} fontType="medium">
                  {peerMeta?.name}
                </Text>

                <Text style={styles.itemSubtitle}>
                  {peerMeta?.url}
                </Text>
              </View>
              <View>
                <Icon
                  name="chevron-right"
                  size={20}
                  color={COLOR.primary._02}
                  style={{ paddingLeft: 20 }}
                />
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  return (
    <>
      <SubHeader theme={'sapphire'} title={'WalletConnect'} />
      <Body
        theme={'sky'}
        containerStyle={{
          paddingTop: 20,
          justifyContent: 'space-between',
          flexGrow: 1,
          paddingBottom: LAYOUT.getNotchCoverPaddingBottom,
        }}
        scrollable
      >
        {_.some(walletConnectors) ? (
          <>
            <List />
            <Button
              onPress={(): void => {
                confirm({
                  desc: 'Disconnect all sessions? ',
                  onPressConfirm: () => {
                    disconnectAllWalletConnect()
                  },
                })
              }}
              theme="red"
              title="Disconnect all sessions"
            />
          </>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Text>There are no connected services.</Text>
          </View>
        )}
      </Body>
    </>
  )
}

const WalletConnectList = (): ReactElement => {
  return <Render />
}

WalletConnectList.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default WalletConnectList

const styles = StyleSheet.create({
  connectItemBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ebeff8',
  },
  itemTitle: {
    fontSize: 14,
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    color: COLOR.primary._02,
    marginBottom: 8,
  },
  itemSubtitle: {
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
  },
})
