const APP_SETTINGS_KEY = 'mindseeds:settings'

export function loadSettings() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(APP_SETTINGS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveSettings(settings) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    // Storage can fail in private mode or restricted environments.
    void error
  }
}
