interface App {
  modal: AppModal
  alertViewProps: AlertView
}

type AppModalConfig = {
  onRequestClose?: () => void
}
interface AppModal {
  isOpen: boolean
  open: (content: ReactNode, config?: AppModalConfig) => void
  close: () => void
  content: ReactNode
  onRequestClose: () => void
}

interface AlertView {
  isOpen: boolean
  open: (content: ReactNode) => void
  close: () => void
  content: ReactNode
}
