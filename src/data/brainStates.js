/**
 * Brain states data for MindSeeds
 * Each state: name, symbol, color, frequency range, binaural freq, base freq, description, breathing pattern, icon
 */
export const brainStates = {
  delta: {
    key: 'delta',
    name: 'Delta',
    symbol: 'δ',
    color: '#3B82F6',
    frequency: '0.5–4 Hz',
    binauralFreq: 2,
    baseFreq: 150,
    description: 'Sonno Profondo',
    breathing: { inhale: 4, hold: 7, exhale: 8 },
    icon: 'moon',
  },
  theta: {
    key: 'theta',
    name: 'Theta',
    symbol: 'θ',
    color: '#10B981',
    frequency: '4–8 Hz',
    binauralFreq: 6,
    baseFreq: 200,
    description: 'Creatività',
    breathing: { inhale: 5.5, exhale: 5.5 },
    icon: 'wave',
  },
  alpha: {
    key: 'alpha',
    name: 'Alpha',
    symbol: 'α',
    color: '#F59E0B',
    frequency: '8–12 Hz',
    binauralFreq: 10,
    baseFreq: 250,
    description: 'Calma Attiva',
    breathing: { inhale: 4, hold: 4, exhale: 4, hold2: 4 },
    icon: 'sun',
  },
  beta: {
    key: 'beta',
    name: 'Beta',
    symbol: 'β',
    color: '#EF4444',
    frequency: '12–30 Hz',
    binauralFreq: 18,
    baseFreq: 300,
    description: 'Focus Intenso',
    breathing: { inhale: 4, hold: 4, exhale: 4, hold2: 4 },
    icon: 'bolt',
  },
  gamma: {
    key: 'gamma',
    name: 'Gamma',
    symbol: 'γ',
    color: '#8B5CF6',
    frequency: '30–100 Hz',
    binauralFreq: 40,
    baseFreq: 400,
    description: 'Peak Performance',
    breathing: { inhale: 2, hold: 1, exhale: 4 },
    icon: 'sparkles',
  },
}

export const brainStatesOrder = ['delta', 'theta', 'alpha', 'beta', 'gamma']
