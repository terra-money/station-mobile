import { useTranslation } from 'react-i18next'

export default (): {
  OOPS: string
  SIGN_IN: string
  CONNECT: string
  COPY: string
  COPIED: string
} => {
  const { t } = useTranslation()

  return {
    OOPS: t('Common:Error:Oops! Something went wrong'),
    SIGN_IN: t('Auth:Menu:Select wallet'),
    CONNECT: t('Auth:Common:Connect'),
    COPY: t('Common:Copy'),
    COPIED: t('Common:Copied'),
  }
}
