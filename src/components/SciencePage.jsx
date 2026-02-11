import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export function SciencePage({ isOpen, onClose }) {
  const [lang, setLang] = useState('it')

  const content = {
    it: {
      intro: "MindSeeds nasce dall'integrazione di neuroscienza applicata, psicoacustica e biofeedback respiratorio. L'obiettivo: permetterti di entrare in stati mentali specifici in pochi minuti, in modo ripetibile e controllabile.",
      howTitle: 'Come funziona',
      binauralTitle: 'Battiti Binaurali in Cuffia Stereo',
      binauralText: "Due toni a frequenze leggermente diverse inviati separatamente a ciascun orecchio generano una terza frequenza percepita dal cervello. Questo fenomeno, chiamato brainwave entrainment, sincronizza le tue onde cerebrali su bande precise:",
      delta: '(0.5–4 Hz) → Sonno profondo rigenerante',
      theta: '(4–8 Hz) → Creatività, rilascio subconscio',
      alpha: '(8–12 Hz) → Calma e presenza',
      beta: '(12–30 Hz) → Focus e produttività',
      gamma: '(30–100 Hz) → Insight e apprendimento rapido',
      breathingTitle: 'Pattern di Respirazione Neuro-Regolatrice',
      breathingText: "Ogni stato mentale è associato a un pattern respiratorio scientificamente selezionato (es. 4–7–8 per Delta, Box Breathing per Beta). Questi schemi agiscono sul sistema nervoso autonomo, amplificando l'effetto del suono e stabilizzando lo stato raggiunto.",
      designTitle: 'Design Sonoro Mirato',
      designText: 'Pad armonici, bassi pulsati o droni statici vengono scelti in base alla risposta cerebrale desiderata. Esempio: suoni vellutati e avvolgenti per Delta, texture luminose e ritmiche per Gamma.',
      synergyTitle: 'Effetto Sinergico',
      synergyText: "L'unione di stimolazione acustica e respiratoria crea un ponte diretto tra volontà cosciente e stato cerebrale. Il risultato: passare dal rilassamento profondo alla massima attivazione mentale in modo controllato.",
      whyTitle: 'Perché è diverso',
      why1: 'Niente rituali mistici: solo scienza, suono e volontà.',
      why2: 'Accesso rapido: 5–10 minuti per entrare nello stato target.',
      why3: 'Portabilità totale: funziona ovunque con cuffie stereo.',
      why4: "Ripetibilità: stessi risultati ogni volta, indipendentemente dall'umore o dal contesto.",
      appsTitle: 'Applicazioni',
      apps1: 'Migliorare sonno e recupero.',
      apps2: 'Potenziare concentrazione e produttività.',
      apps3: 'Stimolare creatività e problem solving.',
      apps4: 'Favorire meditazione e riduzione dello stress.',
      apps5: 'Supportare visualizzazione e manifestazione intenzionale.',
      outro: 'Questo è il nostro progetto: svilupparlo e aiutare le persone con esso.',
    },
    en: {
      intro: "MindSeeds emerges from the integration of applied neuroscience, psychoacoustics, and respiratory biofeedback. The goal: allow you to enter specific mental states in a few minutes, in a repeatable and controllable way.",
      howTitle: 'How it works',
      binauralTitle: 'Binaural Beats with Stereo Headphones',
      binauralText: "Two tones at slightly different frequencies sent separately to each ear generate a third frequency perceived by the brain. This phenomenon, called brainwave entrainment, synchronizes your brainwaves to precise bands:",
      delta: '(0.5–4 Hz) → Deep regenerative sleep',
      theta: '(4–8 Hz) → Creativity, subconscious release',
      alpha: '(8–12 Hz) → Calm and presence',
      beta: '(12–30 Hz) → Focus and productivity',
      gamma: '(30–100 Hz) → Insight and rapid learning',
      breathingTitle: 'Neuro-Regulatory Breathing Patterns',
      breathingText: "Each mental state is associated with a scientifically selected breathing pattern (e.g. 4–7–8 for Delta, Box Breathing for Beta). These patterns act on the autonomic nervous system, amplifying the effect of sound and stabilizing the achieved state.",
      designTitle: 'Targeted Sound Design',
      designText: 'Harmonic pads, pulsed bass, or static drones are chosen based on the desired cerebral response. Example: velvety, enveloping sounds for Delta, bright and rhythmic textures for Gamma.',
      synergyTitle: 'Synergistic Effect',
      synergyText: "The combination of acoustic and respiratory stimulation creates a direct bridge between conscious will and brain state. The result: moving from deep relaxation to maximum mental activation in a controlled way.",
      whyTitle: 'Why it\'s different',
      why1: 'No mystical rituals: only science, sound, and will.',
      why2: 'Rapid access: 5–10 minutes to enter the target state.',
      why3: 'Total portability: works anywhere with stereo headphones.',
      why4: 'Repeatability: same results every time, regardless of mood or context.',
      appsTitle: 'Applications',
      apps1: 'Improve sleep and recovery.',
      apps2: 'Enhance concentration and productivity.',
      apps3: 'Stimulate creativity and problem solving.',
      apps4: 'Support meditation and stress reduction.',
      apps5: 'Support visualization and intentional manifestation.',
      outro: 'This is our project: to develop it and help people with it.',
    },
  }

  const t = content[lang]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-4 sm:inset-10 md:inset-16 lg:inset-24 z-[101] bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="sticky top-0 bg-black/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 py-4 z-10">
              <h1 className="text-xl font-semibold text-white">Science</h1>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {lang === 'it' ? 'EN' : 'IT'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Chiudi"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-8 text-white/90 leading-relaxed">
              <p className="text-lg text-white">{t.intro}</p>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">{t.howTitle}</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium text-white/95 mb-2">{t.binauralTitle}</h3>
                    <p>{t.binauralText}</p>
                    <ul className="mt-3 space-y-2 pl-4">
                      <li><strong>Delta</strong> {t.delta}</li>
                      <li><strong>Theta</strong> {t.theta}</li>
                      <li><strong>Alpha</strong> {t.alpha}</li>
                      <li><strong>Beta</strong> {t.beta}</li>
                      <li><strong>Gamma</strong> {t.gamma}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base font-medium text-white/95 mb-2">{t.breathingTitle}</h3>
                    <p>{t.breathingText}</p>
                  </div>

                  <div>
                    <h3 className="text-base font-medium text-white/95 mb-2">{t.designTitle}</h3>
                    <p>{t.designText}</p>
                  </div>

                  <div>
                    <h3 className="text-base font-medium text-white/95 mb-2">{t.synergyTitle}</h3>
                    <p>{t.synergyText}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">{t.whyTitle}</h2>
                <ul className="space-y-2">
                  <li>• {t.why1}</li>
                  <li>• {t.why2}</li>
                  <li>• {t.why3}</li>
                  <li>• {t.why4}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">{t.appsTitle}</h2>
                <ul className="space-y-2">
                  <li>• {t.apps1}</li>
                  <li>• {t.apps2}</li>
                  <li>• {t.apps3}</li>
                  <li>• {t.apps4}</li>
                  <li>• {t.apps5}</li>
                </ul>
              </section>

              <p className="text-white/80 italic">{t.outro}</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
