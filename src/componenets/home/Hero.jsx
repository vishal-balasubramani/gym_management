import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070')",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
          TRANSFORM YOUR LIFE
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12">
          World-class facilities and expert coaching
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            to="/signup"
            className="bg-crimson hover:bg-crimson/90 text-white px-10 py-4 rounded-full text-lg font-bold transition-all shadow-glow-red"
          >
            Start Free Trial
          </Link>
          <Link 
            to="/classes"
            className="border-2 border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white px-10 py-4 rounded-full text-lg font-bold transition-all"
          >
            View Classes
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
