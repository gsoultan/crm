import { createTheme, rem, type MantineColorsTuple } from '@mantine/core'

const spruce: MantineColorsTuple = [
  '#eaf4f1',
  '#d3e8e1',
  '#a8d1c4',
  '#7bb9a6',
  '#55a58d',
  '#3d977d',
  '#2b8a72',
  '#1f6f5c',
  '#185a4b',
  '#10302a',
]

const amber: MantineColorsTuple = [
  '#fff6e3',
  '#fdebc4',
  '#f8d68e',
  '#f2bf55',
  '#edab28',
  '#e99c0c',
  '#d98e04',
  '#b97600',
  '#926000',
  '#5e3d00',
]

export const theme = createTheme({
  primaryColor: 'spruce',
  primaryShade: 7,
  colors: { spruce, amber },
  fontFamily: "'Instrument Sans Variable', ui-sans-serif, system-ui, sans-serif",
  headings: {
    fontFamily: "'Instrument Sans Variable', ui-sans-serif, system-ui, sans-serif",
    fontWeight: '600',
    sizes: {
      h1: { fontSize: rem(26), lineHeight: '1.2' },
      h2: { fontSize: rem(20), lineHeight: '1.3' },
      h3: { fontSize: rem(16), lineHeight: '1.4' },
    },
  },
  fontSizes: {
    xs: rem(12),
    sm: rem(13.5),
    md: rem(14.5),
    lg: rem(16),
    xl: rem(18),
  },
  defaultRadius: 'md',
  radius: { sm: rem(6), md: rem(8), lg: rem(12) },
  shadows: {
    xs: '0 1px 2px rgba(24, 33, 43, 0.06)',
    sm: '0 1px 3px rgba(24, 33, 43, 0.08), 0 1px 2px rgba(24, 33, 43, 0.04)',
    md: '0 6px 20px rgba(24, 33, 43, 0.10)',
  },
  other: { line: '#e3e8e6', paper: '#f5f7f6' },
  components: {
    Paper: {
      defaultProps: { withBorder: true, shadow: 'none' },
      styles: { root: { borderColor: '#e3e8e6', backgroundColor: '#ffffff' } },
    },
    Card: {
      defaultProps: { withBorder: true, shadow: 'none', padding: 'lg' },
      styles: { root: { borderColor: '#e3e8e6' } },
    },
    Button: { defaultProps: { size: 'sm' }, styles: { root: { fontWeight: 500 } } },
    Badge: {
      defaultProps: { variant: 'light', radius: 'sm', size: 'sm' },
      styles: { root: { textTransform: 'none', fontWeight: 500, letterSpacing: 0 } },
    },
    Table: {
      defaultProps: { verticalSpacing: 'sm', horizontalSpacing: 'md', highlightOnHover: true },
      styles: {
        th: { color: '#5d6b72', fontWeight: 500, fontSize: rem(12.5), whiteSpace: 'nowrap' },
        table: { borderColor: '#e3e8e6' },
      },
    },
    TextInput: { defaultProps: { size: 'sm' } },
    Select: { defaultProps: { size: 'sm' } },
    NumberInput: { defaultProps: { size: 'sm' } },
    Tabs: {
      styles: { tab: { fontWeight: 500 } },
    },
    Tooltip: { defaultProps: { withArrow: false, openDelay: 300 } },
  },
})
