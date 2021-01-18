import React, { ReactElement, useState } from 'react'
import {
  useMenu,
  useGovernance,
  ProposalItemUI,
} from '@terra-money/use-native-station'

import Icon from 'react-native-vector-icons/MaterialIcons'

import { View, StatusBar } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import EStyleSheet from 'react-native-extended-stylesheet'

import ProposalItem from './ProposalItem'
import Text from 'components/Text'
import Info from 'components/Info'
import Page from 'components/Page'
import dev from 'utils/dev'

const Governance = (): ReactElement => {
  const { Governance: title } = useMenu()
  const { ui, ...api } = useGovernance({ status: '' })

  dev.log(JSON.stringify(ui))

  const renderItem = (item: ProposalItemUI): ReactElement => (
    <ProposalItem {...item} key={item.id + item.status} />
  )

  // const RenderFooter = (params: GovernanceParamUI[]|undefined) => {
  //   console.log(params)

  //   return ( params === null ? null :
  //     <View>
  //       <Text>{params}</Text>
  //       <Text>{params[0].title}</Text>
  //       <Text>{params[0].content}</Text>
  //       <Text>{params[1].title}</Text>
  //       <Text>{params[1].displays?.[0].value}</Text>
  //       <Text>{params[1].displays?.[0].unit}</Text>
  //       <Text>{params[2].title}</Text>
  //       <Text>{params[2].content}</Text>
  //     </View>
  //   )
  // }

  const [paramVisibility, setParamVisibility] = useState(true)

  return (
    <Page {...api} title={title}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      {ui?.message ? (
        <Info card>{ui.message}</Info>
      ) : (
        <>
          {ui?.list?.map(renderItem)}

          {/* <RenderFooter params={ui?.params} /> */}

          {/* 하단 Parameters */}
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 24,
              marginHorizontal: 20,
              marginVertical: 10,
              padding: 20,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Icon
                  name="info-outline"
                  size={12}
                  color="rgb(32,67,181)"
                  style={{ alignSelf: 'center' }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 21,
                    color: 'rgb(32,67,181)',
                  }}
                >
                  Parameters
                </Text>
              </View>
              <TouchableOpacity
                style={{}}
                onPress={(): void => {
                  setParamVisibility(!paramVisibility)
                }}
              >
                <Icon
                  name={
                    paramVisibility ? 'expand-less' : 'expand-more'
                  }
                  size={12}
                  color="rgb(32,67,181)"
                />
              </TouchableOpacity>
            </View>
            {!paramVisibility ? null : (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 16,
                    marginBottom: 5,
                  }}
                >
                  <Text style={styles.ParametersItemText}>
                    {ui?.params[0].title}
                  </Text>
                  <Text style={styles.ParametersItemText}>
                    {ui?.params[0].content}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 5,
                  }}
                >
                  <Text style={styles.ParametersItemText}>
                    {ui?.params[1].title}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.ParametersItemText}>
                      {ui?.params[1].displays?.[0].value}
                    </Text>
                    <Text style={styles.ParametersItemText}>
                      &nbsp;
                    </Text>
                    <Text style={styles.ParametersItemText}>
                      {ui?.params[1].displays?.[0].unit}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={styles.ParametersItemText}>
                    {ui?.params[2].title}
                  </Text>
                  <Text style={styles.ParametersItemText}>
                    {ui?.params[2].content}
                  </Text>
                </View>
              </>
            )}
          </View>
        </>
      )}
    </Page>
  )
}

const styles = EStyleSheet.create({
  ParametersItemText: {
    fontSize: 13,
    color: '$primaryColor',
  },
})

export default Governance
