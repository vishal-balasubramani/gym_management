import { FaUsers, FaDumbbell, FaClock, FaTrophy } from 'react-icons/fa'

const Stats = () => {
  const stats = [
    { 
      icon: <FaUsers className="text-5xl" />, 
      number: '5000+', 
      label: 'Members',
      color: 'text-electric-blue'
    },
    { 
      icon: <FaDumbbell className="text-5xl" />, 
      number: '500+', 
      label: 'Expert Trainers',
      color: 'text-fiery-orange'
    },
    { 
      icon: <FaClock className="text-5xl" />, 
      number: '20+', 
      label: 'Years Experience',
      color: 'text-deep-purple'
    },
    { 
      icon: <FaTrophy className="text-5xl" />, 
      number: '1000+', 
      label: 'Success Stories',
      color: 'text-hot-magenta'
    }
  ]

  return (
    <section className="py-20 bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-center text-electric-blue mb-16">
          CHOOSE YOUR MEMBERSHIP PLAN
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-dark-card p-8 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all text-center"
            >
              <div className={`${stat.color} mb-4 flex justify-center`}>
                {stat.icon}
              </div>
              <h3 className={`text-4xl font-bold ${stat.color} mb-2`}>
                {stat.number}
              </h3>
              <p className="text-gray-400 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
