import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollDirector(reducedMotion: boolean) {
  const progress = useRef(0)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const lenis = new Lenis({ duration: reducedMotion ? 0 : 1.05, smoothWheel: !reducedMotion })
    const update = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    const trigger = ScrollTrigger.create({
      trigger: '#journey',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progress.current = self.progress
        document.documentElement.style.setProperty('--journey-progress', `${self.progress}`)
      },
    })

    const observers = [...document.querySelectorAll<HTMLElement>('[data-section]')]
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection((visible.target as HTMLElement).dataset.section ?? 'hero')
      },
      { rootMargin: '-35% 0px -45%', threshold: [0, 0.2, 0.6] },
    )
    observers.forEach((section) => sectionObserver.observe(section))

    const onVisibility = () => document.hidden ? lenis.stop() : lenis.start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      trigger.kill()
      sectionObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      gsap.ticker.remove(update)
      lenis.destroy()
    }
  }, [reducedMotion])

  return { progress, activeSection }
}
