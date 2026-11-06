import { useEffect, useRef } from 'react'
import { ExperienceCanvas } from './three/ExperienceCanvas'
import { useReducedMotion } from './hooks/useReducedMotion'

export default function App() {
  const progress = useRef(0)
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    const update = () => {
      const active = document.querySelector('.present-active')
      const chapters = [...document.querySelectorAll('.chapter')]
      if (active) {
        progress.current = (chapters.indexOf(active) + 0.25) / chapters.length
      } else {
        let chapterIndex = 0
        chapters.forEach((chapter, index) => {
          if (chapter.getBoundingClientRect().top <= window.innerHeight * 0.42) chapterIndex = index
        })
        const bounds = chapters[chapterIndex].getBoundingClientRect()
        const fraction = Math.min(1, Math.max(0, (window.innerHeight * 0.42 - bounds.top) / bounds.height))
        progress.current = (chapterIndex + fraction) / chapters.length
      }
    }
    const observer = new MutationObserver(update)
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] })
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => { observer.disconnect(); window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  return <ExperienceCanvas progress={progress} reducedMotion={reducedMotion} darkMode={false} />
}
