interface App {
  drawer: Drawer
}

interface Drawer {
  isOpen: boolean
  open: (content: ReactNode) => void
  close: () => void
  content: ReactNode
}
