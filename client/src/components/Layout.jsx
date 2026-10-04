import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

function Layout() {
  const location = useLocation()
  const progressRef = useRef(null)

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0
      progressRef.current?.style.setProperty('--scroll-progress', String(progress))
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  useEffect(() => {
    const selector = '.destination-card, .package-card, .testimonial-card, .benefit-item, .trip-step, .section-heading-row, .home-section-heading, .faq-item, .story-strip, .inquiry-panel, .contact-sidebar-block, .trip-form'
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canObserve = 'IntersectionObserver' in window && !reduceMotion
    const observed = new WeakSet()
    let staggerIndex = 0
    const revealObserver = canObserve
      ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          revealObserver.unobserve(entry.target)
        })
      }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' })
      : null

    function observeTargets(root) {
      const targets = []
      if (root instanceof Element && root.matches(selector)) targets.push(root)
      if ('querySelectorAll' in root) targets.push(...root.querySelectorAll(selector))

      targets.forEach((target) => {
        if (observed.has(target)) return
        observed.add(target)
        if (!revealObserver) {
          target.classList.add('is-revealed')
          return
        }
        target.style.setProperty('--reveal-delay', `${Math.min(staggerIndex % 6, 5) * 55}ms`)
        staggerIndex += 1
        target.classList.add('reveal-ready')
        revealObserver.observe(target)
      })
    }

    observeTargets(document.querySelector('main') || document)
    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof Element) observeTargets(node)
      }))
    })
    mutationObserver.observe(document.querySelector('main') || document.body, { childList: true, subtree: true })

    return () => {
      mutationObserver.disconnect()
      revealObserver?.disconnect()
    }
  }, [location.pathname])

  return (
    <div className="app-layout">
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout