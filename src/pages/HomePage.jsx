import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaArrowRight, FaCheck, FaInstagram, FaTwitter, 
  FaFacebookF, FaBars, FaTimes, FaBolt, FaDumbbell, 
  FaShieldAlt, FaAward, FaBullseye, FaUsers, FaStar 
} from 'react-icons/fa' // ✅ Changed FaTarget to FaBullseye

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Section Refs for Smooth Scrolling
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const trainersRef = useRef(null);
  const pricingRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (elementRef) => {
    setMobileMenuOpen(false);
    const offset = 80; // Navbar height
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = elementRef.current.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  // Membership Plans from Database
  const plans = [
    {
      name: 'Monthly Starter',
      price: '29.99',
      duration: '1 Month',
      features: ['Access to Gym', 'Locker Access', '1 Trainer Consultation'],
      highlight: false
    },
    {
      name: 'Quarterly Pro',
      price: '79.99',
      duration: '3 Months',
      features: ['Access to Gym', 'Locker Access', 'Diet Plan', 'Weekly Check-ins', '1 Trainer Consultation'],
      highlight: true
    },
    {
      name: 'Yearly Elite',
      price: '249.99',
      duration: '12 Months',
      features: ['Access to Gym', 'Locker Access', 'Diet Plan', 'Weekly Check-ins', 'Personal Trainer', 'Unlimited Classes', 'Free Merch'],
      highlight: false
    }
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/5 py-6' : 'bg-transparent py-10'}`}>
        <div className="max-w-7xl mx-auto px-10 flex items-center justify-between">
          {/* Scaled Up Logo */}
          <button 
            onClick={() => scrollToSection(homeRef)} 
            className="text-4xl font-bold tracking-tighter italic transition-transform hover:scale-105"
          >
            FIT<span className="text-red-600">HUB</span>
          </button>

          {/* Scaled Up Navigation Links */}
          <div className="hidden md:flex items-center gap-12 text-[13px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <button onClick={() => scrollToSection(homeRef)} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => scrollToSection(aboutRef)} className="hover:text-white transition-colors">About</button>
            <button onClick={() => scrollToSection(trainersRef)} className="hover:text-white transition-colors">Trainers</button>
            <button onClick={() => scrollToSection(pricingRef)} className="hover:text-white transition-colors">Membership</button>
          </div>

          {/* Action Buttons with Increased Padding */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/signin" className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Login</Link>
            <Link 
              to="/signup" 
              className="bg-red-600 hover:bg-red-500 text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-red-600/30"
            >
              Join Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-3xl text-white">
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section ref={homeRef} className="relative h-screen flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070" className="w-full h-full object-cover opacity-30 grayscale" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]"></div>
        </div>
        <div className="relative z-10 max-w-5xl space-y-6">
          <p className="text-red-500 font-bold text-xs uppercase tracking-[0.4em] animate-pulse">Evolution starts here</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter uppercase italic">
            TRANSFORM YOUR <span className="text-red-600">BODY</span><br />
            RECLAIM YOUR POWER
          </h1>
          <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto font-normal leading-relaxed opacity-80">
            Stop making excuses. Start making progress. Experience the elite standard of fitness coaching.
          </p>
          <button onClick={() => scrollToSection(pricingRef)} className="bg-red-600 hover:bg-red-500 text-white px-12 py-5 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-2xl shadow-red-600/40 mx-auto flex items-center gap-3">
            Start Training Now <FaArrowRight />
          </button>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section ref={aboutRef} className="py-32 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group overflow-hidden rounded-[2rem]">
            <div className="absolute -inset-4 bg-red-600/10 rounded-[2rem] blur-2xl group-hover:bg-red-600/20 transition-all duration-700"></div>
            <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000" className="relative rounded-[2rem] border border-white/5 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 shadow-2xl" alt="About" />
          </div>
          <div className="space-y-8">
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight uppercase italic">More Than Just <br /><span className="text-red-600">A Gym.</span></h3>
            <p className="text-gray-400 leading-relaxed font-normal">Founded in 2026, FitHub was built on the principle that elite training should be accessible to everyone. We provide the atmosphere, coaching, and community required for a total life transformation.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <FaBullseye className="text-red-600 text-2xl" />
                <div>
                  <h4 className="font-bold uppercase text-xs mb-1">Our Mission</h4>
                  <p className="text-gray-500 text-[11px]">Science-backed training to push your boundaries.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <FaUsers className="text-red-600 text-2xl" />
                <div>
                  <h4 className="font-bold uppercase text-xs mb-1">The Community</h4>
                  <p className="text-gray-500 text-[11px]">Like-minded individuals dedicated to discipline.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRAINERS SECTION --- */}
      <section ref={trainersRef} className="py-32 px-6 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-red-600 font-bold text-sm uppercase tracking-[0.4em] mb-4">Expert Coaches</h2>
          <h3 className="text-4xl md:text-5xl font-bold uppercase italic tracking-tighter">Meet The <span className="text-red-600">Elite</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { name: 'Marcus', spec: 'Bodybuilding', img: 'https://www.npta.ca/cdn/shop/files/Everything_You_Need_to_Know.jpg?v=1745621834&width=1100' },
            { name: 'Sara sha', spec: 'Weight Loss', img: 'https://img.freepik.com/premium-photo/young-female-fitness-personal-trainer-with-notepad-standing-gym-with-thumb-up_146671-31563.jpg' },
            { name: 'David ', spec: 'Athleticism', img: 'https://as1.ftcdn.net/v2/jpg/05/24/37/84/1000_F_524378456_7iH4roEgy8t8351zKypjRumlIbRfwhIO.jpg' }
          ].map((trainer, i) => (
            <div key={i} className="group relative bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-red-600/30 transition-all duration-500 shadow-xl">
              <img src={trainer.img} className="w-full h-80 object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt={trainer.name} />
              <div className="p-8 relative z-10 bg-[#111]">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-bold uppercase tracking-tight">{trainer.name}</h4>
                  <div className="flex text-red-600 text-[10px]"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                </div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{trainer.spec}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section ref={pricingRef} className="py-32 px-6 bg-[#080808] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold uppercase italic mb-20 tracking-tighter">Membership Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-gray-900/60 backdrop-blur-2xl rounded-[2.5rem] p-12 border transition-all duration-500 hover:-translate-y-4 ${plan.highlight ? 'border-red-600 scale-105 shadow-2xl shadow-red-600/10' : 'border-white/5'}`}>
                {plan.highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-6 py-2 rounded-full uppercase tracking-widest">Best Value</div>}
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-4">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2 mb-8">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-gray-500 font-bold text-xs uppercase">/{plan.duration}</span>
                </div>
                <ul className="space-y-5 mb-12 text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-4 text-xs font-medium text-gray-300">
                      <FaCheck className="text-red-600 flex-shrink-0" /> {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className={`block w-full text-center py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all ${plan.highlight ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-white text-black hover:bg-gray-200'}`}>Join Mission</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 px-6 border-t border-white/5 bg-black">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Boxed Content Area */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold tracking-tighter italic mb-0.5">
              FIT<span className="text-red-600">HUB</span>
            </h2>
            <p className="text-gray-600 text-[9px] font-medium uppercase tracking-[0.2em]">
              © 2026 Forge Your Destiny. All rights reserved.
            </p>
          </div>

          {/* Social Links Box */}
          <div className="flex gap-5 text-gray-500">
            <FaInstagram className="hover:text-red-600 transition-colors cursor-pointer text-sm" />
            <FaTwitter className="hover:text-blue-400 transition-colors cursor-pointer text-sm" />
            <FaFacebookF className="hover:text-blue-600 transition-colors cursor-pointer text-sm" />
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage