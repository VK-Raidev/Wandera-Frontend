import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, BadgeCheck, BadgeDollarSign, BedDouble, Check, Compass, Headset, HeartHandshake, MapPin, MessageSquareText, Pause, Plane, Play, Route, SlidersHorizontal, Van } from 'lucide-react'
import { Link } from 'react-router-dom'
import FeaturedDestinations from '../components/FeaturedDestinations'
import FaqSection from '../components/FaqSection'
import TestimonialsSection from '../components/TestimonialsSection'
import TripSearchPanel from '../components/TripSearchPanel'
import TravelGallery from '../components/TravelGallery'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import api from '../services/api'

const travelBenefits = [
  { icon: SlidersHorizontal, title: 'Customized Packages', description: 'Shape the pace, places, and little details around you.' },
  { icon: BadgeDollarSign, title: 'Best Price', description: 'Clear quotes that respect the budget you set.' },
  { icon: BadgeCheck, title: 'Verified Hotels', description: 'Stay options checked for comfort, location, and fit.' },
  { icon: Van, title: 'Reliable Transport', description: 'Well-planned transfers, so the journey feels easy.' },
  { icon: Compass, title: 'Experienced Experts', description: 'Thoughtful advice from people who know the route.' },
  { icon: Headset, title: '24/7 Support', description: 'A real team to help when plans shift along the way.' },
]

const tripSteps = [
  { icon: MessageSquareText, title: 'Tell us what you love', description: 'Share your dates, budget, and the kind of trip you want.' },
  { icon: Route, title: 'We shape the route', description: 'A travel expert builds an itinerary around your priorities.' },
  { icon: BedDouble, title: 'Fine-tune the details', description: 'Choose stays and experiences, then confirm your plan.' },
  { icon: Plane, title: 'Take the trip', description: 'Travel with your plans in place and support close by.' },
]

const journeyPromises = [
  { icon: BadgeCheck, label: 'Plans built around you' },
  { icon: HeartHandshake, label: 'Real people, here to help' },
  { icon: Compass, label: 'Room for the unexpected' },
]

const heroSlides = [
  { place: 'Dolomites, Italy', quote: 'Somewhere between the peaks, you find a little more of yourself.', photo: 'photo-1519681393784-d120267933ba' },
  { place: 'The quiet coast', quote: 'Let the tide set the pace. You have nowhere else to be.', photo: 'photo-1507525428034-b723cf961d3e' },
  { place: 'Alpine mornings', quote: 'Wake up where the mountains make everything feel possible.', photo: 'photo-1470770841072-f978cf4d019e' },
  { place: 'A road through nowhere', quote: 'Take the long way. It is often where the story begins.', photo: 'photo-1500530855697-b586d89ba3ee' },
  { place: 'The lakeside pause', quote: 'Trade the rush for a view that asks you to stay a while.', photo: 'photo-1493246507139-91e8fad9978e' },
  { place: 'A little island time', quote: 'Salt in your hair. No plans until the sun goes down.', photo: 'photo-1506929562872-bb421503ef21' },
  { place: 'Into the highlands', quote: 'Find your kind of wild, one winding trail at a time.', photo: 'photo-1464822759023-fed622ff2c3b' },
  { place: 'Somewhere tropical', quote: 'The best souvenir is a day you wish would last longer.', photo: 'photo-1519046904884-53103b34b206' },
  { place: 'Desert golden hour', quote: 'Follow the warm light. Let the rest wait until tomorrow.', photo: 'photo-1509316785289-025f5b846b35' },
  { place: 'A cabin in the woods', quote: 'A slower morning can change the shape of your whole trip.', photo: 'photo-1449158743715-0a90ebb6d2d8' },
  { place: 'Above the clouds', quote: 'Go a little higher. See how small your worries become.', photo: 'photo-1464278533981-50106e6176b1' },
  { place: 'The blue beyond', quote: 'Make room for the kind of quiet you can only find at sea.', photo: 'photo-1518837695005-2083093ee35b' },
  { place: 'A new city, on foot', quote: 'Turn down a side street. Your favourite place may be there.', photo: 'photo-1519608487953-e999c86e7455' },
  { place: 'The morning trail', quote: 'A fresh trail. A deep breath. A day that belongs to you.', photo: 'photo-1470252649378-9c29740c9fa8' },
  { place: 'The faraway shore', quote: 'Go where the map ends and your curiosity takes over.', photo: 'photo-1501785888041-af3ef285b470' },
  { place: 'A valley in bloom', quote: 'There is a season for everything. This one is for going.', photo: 'photo-1476514525535-07fb3b4ae5f1' },
  { place: 'The great outdoors', quote: 'Leave a little space in your plans for a beautiful surprise.', photo: 'photo-1469474968028-56623f02e42e' },
  { place: 'A golden escape', quote: 'Chase the horizon, not the checklist.', photo: 'photo-1473116763249-2faaef81ccda' },
  { place: 'Where rivers wander', quote: 'Follow the water. See where a day without hurry leads.', photo: 'photo-1433086966358-54859d0ed716' },
  { place: 'Your next somewhere', quote: 'There is more world waiting than you can imagine.', photo: 'photo-1500534314209-a25ddb2bd429' },
].map((slide) => ({
  ...slide,
  image: `https://images.unsplash.com/${slide.photo}?auto=format&fit=crop&w=1920&q=78`,
}))

function Home() {
  const [heroDestination, setHeroDestination] = useState(null)
  const [slideIndex, setSlideIndex] = useState(() => Math.floor(Math.random() * heroSlides.length))
  const [outgoingSlide, setOutgoingSlide] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [allowReducedMotionAutoplay, setAllowReducedMotionAutoplay] = useState(false)
  const outgoingTimerRef = useRef(null)
  const currentSlide = heroSlides[slideIndex]
  useDocumentTitle('Home', 'Browse destinations, thoughtful travel packages, and custom trip ideas with YatraHub.')

  function changeSlide(nextIndex) {
    if (nextIndex === slideIndex) return
    setOutgoingSlide(currentSlide)
    setSlideIndex(nextIndex)
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)
    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    if (isPaused || (prefersReducedMotion && !allowReducedMotionAutoplay)) return undefined

    const randomOffset = 1 + Math.floor(Math.random() * (heroSlides.length - 1))
    const nextSlideIndex = (slideIndex + randomOffset) % heroSlides.length
    const nextImage = new Image()
    nextImage.src = heroSlides[nextSlideIndex].image
    const timeoutId = window.setTimeout(() => {
      setOutgoingSlide(currentSlide)
      setSlideIndex(nextSlideIndex)
    }, 4500)

    return () => window.clearTimeout(timeoutId)
  }, [allowReducedMotionAutoplay, currentSlide, isPaused, prefersReducedMotion, slideIndex])

  useEffect(() => {
    if (!outgoingSlide) return undefined

    outgoingTimerRef.current = window.setTimeout(() => {
      setOutgoingSlide(null)
      outgoingTimerRef.current = null
    }, 1450)

    return () => {
      if (outgoingTimerRef.current) window.clearTimeout(outgoingTimerRef.current)
    }
  }, [outgoingSlide])

  useEffect(() => {
    let isCurrentRequest = true
    api.get('/destinations')
      .then(({ data: response }) => {
        if (isCurrentRequest) setHeroDestination(Array.isArray(response.data) ? response.data[0] || null : null)
      })
      .catch(() => {})
    return () => { isCurrentRequest = false }
  }, [])

  return (
    <>
      <section className="home-hero">
        {outgoingSlide && (
          <img
            className="home-hero-image is-outgoing"
            key={`${outgoingSlide.photo}-outgoing`}
            src={outgoingSlide.image}
            alt=""
            aria-hidden="true"
          />
        )}
        <img
          className="home-hero-image is-current"
          key={currentSlide.photo}
          src={currentSlide.image}
          alt={`Travel inspiration: ${currentSlide.place}`}
          fetchPriority="high"
        />
        <div className="hero-copy">
          <div className="hero-kicker-stack" aria-live="polite" aria-atomic="true">
            {outgoingSlide && (
              <p className="hero-kicker is-outgoing" aria-hidden="true"><MapPin size={15} /> {outgoingSlide.place}</p>
            )}
            <p className="hero-kicker is-current" key={`${currentSlide.photo}-place`}><MapPin size={15} /> {currentSlide.place}</p>
          </div>
          <h1>YatraHub</h1>
          <div className="hero-quote-stack" aria-live="polite" aria-atomic="true">
            {outgoingSlide && (
              <p className="hero-description hero-slide-quote is-outgoing" aria-hidden="true">&ldquo;{outgoingSlide.quote}&rdquo;</p>
            )}
            <p className="hero-description hero-slide-quote is-current" key={`${currentSlide.photo}-quote`}>&ldquo;{currentSlide.quote}&rdquo;</p>
          </div>
          <div className="hero-actions">
            <Link className="button button-coral" to="/destinations">Find your journey <ArrowRight size={17} /></Link>
            <Link className="hero-text-link" to="/custom-trip">Plan something personal</Link>
          </div>
        </div>
        <a className="hero-scroll" href="#featured" aria-label="Scroll to featured journeys"><ArrowDown size={17} /></a>
        <div className="hero-slide-controls" aria-label="Travel inspiration slideshow controls">
          <span className="hero-slide-count" aria-label={`Slide ${slideIndex + 1} of ${heroSlides.length}`}>
            {String(slideIndex + 1).padStart(2, '0')} <span>/ {String(heroSlides.length).padStart(2, '0')}</span>
          </span>
          <button type="button" aria-label="Previous travel inspiration" onClick={() => changeSlide((slideIndex + heroSlides.length - 1) % heroSlides.length)}>
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            aria-label={isPaused || (prefersReducedMotion && !allowReducedMotionAutoplay) ? 'Play travel inspiration slideshow' : 'Pause travel inspiration slideshow'}
            onClick={() => {
              if (prefersReducedMotion && !allowReducedMotionAutoplay) {
                setAllowReducedMotionAutoplay(true)
                return
              }
              setIsPaused((paused) => !paused)
            }}
          >
            {isPaused || (prefersReducedMotion && !allowReducedMotionAutoplay) ? <Play size={15} /> : <Pause size={15} />}
          </button>
          <button type="button" aria-label="Next travel inspiration" onClick={() => changeSlide((slideIndex + 1) % heroSlides.length)}>
            <ArrowRight size={16} />
          </button>
        </div>
        <div className={`hero-slide-progress${isPaused || (prefersReducedMotion && !allowReducedMotionAutoplay) ? ' is-paused' : ''}`} aria-hidden="true">
          <span key={slideIndex} />
        </div>
      </section>

      <TripSearchPanel />

      <section className="journey-promises" aria-label="The YatraHub difference">
        {journeyPromises.map(({ icon: Icon, label }) => (
          <div className="journey-promise" key={label}>
            <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="content-section featured-section" id="featured">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">A good place to begin</p>
            <h2>Somewhere special is calling.</h2>
          </div>
          <Link className="quiet-link" to="/destinations">All destinations <ArrowRight size={16} /></Link>
        </div>
        <FeaturedDestinations />
      </section>

      <section className="home-note">
        <div className="note-number">01 <span>/ 03</span></div>
        <p>Go further than the itinerary. Find the small moments that make a place stay with you.</p>
        <Link to="/about" aria-label="Read our story"><ArrowRight size={20} /></Link>
      </section>

      <section className="why-section">
        <div className="why-inner">
          <div className="why-heading">
            <p className="eyebrow">Good people. Thoughtful details.</p>
            <h2>Why travel with us</h2>
            <p>Less time juggling logistics. More room for the parts of a trip that stay with you.</p>
          </div>
          <div className="benefit-grid">
            {travelBenefits.map(({ icon: Icon, title, description }, index) => (
              <article className="benefit-item" key={title}>
                <div className="benefit-icon"><Icon size={21} strokeWidth={1.8} /></div>
                <span className="benefit-index">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="how-inner">
          <div className="how-heading">
            <p className="eyebrow">From first thought to takeoff</p>
            <h2>How it works</h2>
          </div>
          <div className="steps-grid">
            {tripSteps.map(({ icon: Icon, title, description }, index) => (
              <article className="trip-step" key={title}>
                <div className="step-marker"><span>0{index + 1}</span><Icon size={20} strokeWidth={1.8} /></div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <TravelGallery />
      <FaqSection />

      <section className="custom-trip-cta">
        <div className="custom-trip-copy">
          <p className="custom-trip-kicker">Made around you</p>
          <h2>Your Trip.<br />Your Budget.<br /><em>Your Way.</em></h2>
          <p className="custom-trip-description">A good trip starts with what matters to you. We'll help bring the pieces together.</p>
          <ul className="customization-list">
            <li><Check size={14} /> The places you want to see</li>
            <li><Check size={14} /> Your pace and travel dates</li>
            <li><Check size={14} /> Stays, transport, and experiences</li>
            <li><Check size={14} /> A budget that feels right</li>
          </ul>
          <Link className="custom-trip-button" to="/custom-trip">Build My Trip <ArrowRight size={17} /></Link>
        </div>
        <div className="custom-trip-image">
          {heroDestination?.image && <img src={heroDestination.image} alt={`Scenery in ${heroDestination.name}`} loading="lazy" />}
        </div>
      </section>
    </>
  )
}

export default Home