import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'iks-theme'

function getStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // The theme still changes for this session when storage is unavailable.
  }
}

function getInitialTheme(): Theme {
  if (typeof document !== 'undefined') {
    const theme = document.documentElement.dataset.theme
    if (theme === 'light' || theme === 'dark') return theme
  }
  return 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0B0E14' : '#EEE7D8')
  }, [theme])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-color-scheme: dark)')
    const followSystem = (event: MediaQueryListEvent) => {
      if (!getStoredTheme()) setTheme(event.matches ? 'dark' : 'light')
    }
    preference.addEventListener('change', followSystem)
    return () => preference.removeEventListener('change', followSystem)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      storeTheme(next)
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
