import React from 'react'
import { Text } from 'react-native'
import Dashboard from './src/screens/dashboard'
import Bank from './src/screens/bank/Bank'
import Staking from './src/screens/staking'
import Market from './src/screens/market/Market'
import Governance from './src/screens/governance'
import Icon from 'react-native-vector-icons/MaterialIcons'
// import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import EStyleSheet from 'react-native-extended-stylesheet';

export const INITIAL = 'Staking' //'Dashboard'

export default [
  {
    name: 'Dashboard',
    component: Dashboard,
    options: {
      tabBarLabel: ({ color }: any) => (
        <Text style={styles.tabbar_text}>
          <Text style={{ color: color }}>DASHBOARD</Text>
        </Text>
      ),
      tabBarIcon: ({ color }: any) => (
        <Icon name="dashboard" color={color} size={26} style={{ marginTop: 5 }} />
      ),
    }
  },
  {
    name: 'Bank',
    component: Bank,
    options: {
      tabBarLabel: ({ color }: any) => (
        <Text style={styles.tabbar_text}>
          <Text style={{ color: color }}>BANK</Text>
        </Text>
      ),
      tabBarIcon: ({ color }: any) => (
        <Icon name="account-balance" color={color} size={28} style={{ marginTop: 5 }} />
      ),
    }
  },
  {
    name: 'Staking',
    component: Staking,
    options: {
      tabBarLabel: ({ color }: any) => (
        <Text style={styles.tabbar_text}>
          <Text style={{ color: color }}>STAKING</Text>
        </Text>
      ),
      tabBarIcon: ({ color }: any) => (
        <Icon name="layers" color={color} size={28} style={{ marginTop: 5 }} />
      ),
    }
  },
  {
    name: 'Market',
    component: Market,
    options: {
      tabBarLabel: ({ color }: any) => (
        <Text style={styles.tabbar_text}>
          <Text style={{ color: color }}>MARKET</Text>
        </Text>
      ),
      tabBarIcon: ({ color }: any) => (
        <Icon name="timeline" color={color} size={28} style={{ marginTop: 5 }} />
      ),
    }
  },
  {
    name: 'Governance',
    component: Governance,
    options: {
      tabBarLabel: ({ color }: any) => (
        <Text style={styles.tabbar_text}>
          <Text style={{ color: color }}>GOVERNANCE</Text>
        </Text>
      ),
      tabBarIcon: ({ color }: any) => (
        <Icon name="how-to-vote" color={color} size={28} style={{ marginTop: 5 }} />
      ),
    }
  },
]

const styles = EStyleSheet.create({
  tabbar_text: {
    fontSize: 8,
    // fontFamily: "TerraCompact-Semibold",
    fontFamily: "$fontGothamBold",
    marginBottom: 3
  }
})
