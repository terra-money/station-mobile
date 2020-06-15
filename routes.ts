import Dashboard from './src/screens/dashboard'
import Bank from './src/screens/bank/Bank'
import Staking from './src/screens/staking'
import Market from './src/screens/market/Market'
import Governance from './src/screens/governance'

export const INITIAL = 'Dashboard'

export default [
  { name: 'Dashboard', component: Dashboard },
  { name: 'Bank', component: Bank },
  { name: 'Staking', component: Staking },
  { name: 'Market', component: Market },
  { name: 'Governance', component: Governance },
]
