interface App {
  drawer: Drawer
  modal: AppModal
}

interface Drawer {
  isOpen: boolean
  open: (content: ReactNode) => void
  close: () => void
  content: ReactNode
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
