'use client'

// @mui
import { useMemo } from 'react'
import PropTypes from 'prop-types'
import CssBaseline from '@mui/material/CssBaseline'
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles'
import merge from 'lodash/merge'
// components
import { useSettingsContext } from 'src/components/settings'
// locales
import { useLocales } from 'src/locales'

import { customShadows } from './custom-shadows'
import { contrast } from './options/contrast'
import { darkMode } from './options/dark-mode'
// options
import { presets } from './options/presets'
import RTL, { direction } from './options/right-to-left'
import { componentsOverrides } from './overrides'
// system
import { palette } from './palette'
import { shadows } from './shadows'
import { typography } from './typography'

// ----------------------------------------------------------------------

export default function ThemeProvider({ children }) {
  const { currentLang } = useLocales()

  const settings = useSettingsContext()

  const darkModeOption = darkMode(settings.themeMode)

  const presetsOption = presets(settings.themeColorPresets)

  const contrastOption = contrast(
    settings.themeContrast === 'bold',
    settings.themeMode
  )

  const directionOption = direction(settings.themeDirection)

  const baseOption = useMemo(
    () => ({
      palette: palette('light'),
      shadows: shadows('light'),
      customShadows: customShadows('light'),
      typography,
      shape: { borderRadius: 8 },
    }),

    []
  )

  const memoizedValue = useMemo(
    () =>
      merge(
        // Base
        baseOption,
        // Direction: remove if not in use
        directionOption,
        // Dark mode: remove if not in use
        darkModeOption,
        // Presets: remove if not in use
        presetsOption,
        // Contrast: remove if not in use
        contrastOption.theme
      ),
    [
      baseOption,
      directionOption,
      darkModeOption,
      presetsOption,
      contrastOption.theme,
    ]
  )

  const theme = createTheme(memoizedValue)

  theme.components = merge(
    componentsOverrides(theme),
    contrastOption.components
  )

  const themeWithLocale = useMemo(
    () => createTheme(theme, currentLang.systemValue),
    [currentLang.systemValue, theme]
  )

  return (
    <MuiThemeProvider theme={themeWithLocale}>
      <RTL themeDirection={settings.themeDirection}>
        <CssBaseline />
        {children}
      </RTL>
    </MuiThemeProvider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
}
