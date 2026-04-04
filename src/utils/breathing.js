/**
 * Calcola fase e progresso nel ciclo di respiro (per metronomo, pallini, cerchio).
 */
export function getPhaseAndProgress(breathing, elapsed) {
  if (!breathing) return { phase: 'OUT', progress: 0, phaseDuration: 1 }
  const { inhale, hold = 0, exhale, hold2 = 0 } = breathing
  const total = inhale + hold + exhale + hold2
  const t = total > 0 ? elapsed % total : 0

  if (t < inhale) {
    return { phase: 'IN', progress: t, phaseDuration: inhale }
  }
  if (t < inhale + hold) {
    return { phase: 'HOLD', progress: t - inhale, phaseDuration: hold }
  }
  if (t < inhale + hold + exhale) {
    return { phase: 'OUT', progress: t - inhale - hold, phaseDuration: exhale }
  }
  return { phase: 'HOLD2', progress: t - inhale - hold - exhale, phaseDuration: hold2 }
}
