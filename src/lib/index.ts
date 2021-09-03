import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './lang/en'
import es from './lang/es.json'
import zh from './lang/zh.json'
import fr from './lang/fr.json'
import ru from './lang/ru.json'
import pl from './lang/pl.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      zh: { translation: zh },
      fr: { translation: fr },
      ru: { translation: ru },
      pl: { translation: pl },
    },
    lng: 'en',
    keySeparator: ':',
  })

/* types */
export * from './types'

/* component */
export { default as useForm } from './hooks/useForm'

/* utility */
export * from './utils'
export { default as useText } from './lang/useText'
export { default as useInfo } from './lang/useInfo'
export { Trans } from 'react-i18next'

/* contexts */
export * from './contexts/ConfigContext'
export * from './contexts/AuthContext'
export { default as createContext } from './contexts/createContext'
export { default as useHeight } from './contexts/useHeight'
export { Languages, getLang } from './contexts/useLang'

/* hooks:api */
export { default as fcd } from './api/fcd'
export { default as useBank } from './api/useBank'
export { default as useActiveDenoms } from './api/useActiveDenoms'

/* hooks:auth */
export { default as useManageAccounts } from './auth/useManageAccounts'
export { default as useChangePassword } from './auth/useChangePassword'

/* hooks:pages */
export { default as useMenu } from './pages/useMenu'
export { default as useShare } from './pages/useShare'
export { default as useDashboard } from './pages/dashboard/useDashboard'
export { default as useChart } from './pages/dashboard/useChart'
export { default as useChartCard } from './pages/dashboard/useChartCard'
export { default as useAssets } from './pages/bank/useAssets'
export { default as useTxs } from './pages/txs/useTxs'
export { default as useStaking } from './pages/staking/useStaking'
export { default as useValidator } from './pages/staking/useValidator'
export { default as useMarket } from './pages/market/useMarket'
export { default as usePrice } from './pages/market/usePrice'
export { default as useRate } from './pages/market/useRate'
export { default as useGovernance } from './pages/governance/useGovernance'
export { useProposalStatus } from './pages/governance/useGovernance'
export { default as useProposal } from './pages/governance/useProposal'
export { default as useContracts } from './pages/contracts/useContracts'
export { default as useContract } from './pages/contracts/useContract'
export { default as useQuery } from './pages/contracts/useQuery'

/* hooks:post */
export { default as useConfirm } from './post/useConfirm'
export { default as useSend } from './post/useSend'
export { default as useDelegate } from './post/useDelegate'
export { default as useWithdraw } from './post/useWithdraw'
export { default as useSwap } from './post/useSwap'
export { default as useSwapMultiple } from './post/useSwapMultiple'
export { default as useDeposit } from './post/useDeposit'
export { default as useInteract } from './post/useInteract'
