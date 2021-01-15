interface App {
  drawer: Drawer
  modal: Modal
}

interface Drawer {
  isOpen: boolean
  open: (content: ReactNode) => void
  close: () => void
  content: ReactNode
}

interface Modal {
  isOpen: boolean
  open: (content: ReactNode) => void
  close: () => void
  content: ReactNode
}
