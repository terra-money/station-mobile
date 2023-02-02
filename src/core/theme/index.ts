import { extendTheme, ITagProps, ITextProps } from 'native-base'

const newColorTheme = {
  background: {
    100: '#232327',
    400: '#29292E',
    700: '#35353A',
    800: '#47474D',
  },
  primary: '#4672ED',
  text: {
    100: '#FFFFFF',
    300: '#F3F3F3',
    500: '#8D8D8D',
    positive: '#4672ED',
    negative: '#ED4646',
  },
}

const theme = extendTheme({
  colors: newColorTheme,
  space: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
  fontConfig: {
    Gotham: {
      400: { normal: 'Gotham-Book' },
      500: { normal: 'Gotham-Medium' },
      600: { normal: 'Gotham-SemiBold' },
      700: { normal: 'Gotham-Bold' },
      800: { normal: 'Gotham-ExtraBold' },
    },
  },
  fonts: {
    h1: 'Gotham',
    h2: 'Gotham',
    h3: 'Gotham',
    subtitle: 'Gotham',
    body: 'Gotham',
    captionLm: 'Gotham',
    captionSm: 'Gotham',
    captionXs: 'Gotham',
  },
  components: {
    Pressable: {
      variants: {
        content: () => ({}),
        contentDanger: () => ({}),
        danger: () => ({}),
        ghost: () => ({}),
        normal: () => ({}),
      },
    },
    Text: {
      baseStyle: () => ({
        _dark: { color: '#fffff' },
        color: '#ffffff',
      }),
      variants: {
        display: (): ITagProps => ({
          fontSize: 28,
          lineHeight: 34,
          fontWeight: 'medium',
        }),
        subtitle: (): ITextProps => ({
          fontSize: 14,
          color: '#8D8D8D',
          lineHeight: 18,
        }),
        body2: (): ITextProps => ({
          fontSize: 12,
          color: '#8D8D8D',
          lineHeight: 18,
        }),
      },
    },
    Button: {
      variants: {
        normal: () => ({
          bg: newColorTheme.background[700],
          borderRadius: 16,
          height: 50,
        }),
        primary: () => ({
          bg: newColorTheme.primary,
          borderRadius: 16,
          height: 50,
        }),
      },
    },
    Input: {
      defaultProps: {
        bg: 'background.400',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'background.700',
        color: 'text.300',
        fontSize: 14,
        fontWeight: 'medium',
        placeholderTextColor: 'text.500',
        px: 6,
        py: 5,
        selectionColor: 'text.300',
        _disabled: {
          bg: 'background.200',
        },
      },
    },
  },
})

export type ThemeType = typeof theme
declare module 'native-base' {
  interface ICustomTheme extends ThemeType {}
}

export default theme
