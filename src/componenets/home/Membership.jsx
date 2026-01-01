import { FaCheck } from 'react-icons/fa'

const MembershipPlans = () => {
  const plans = [
    {
      name: 'Basic',
      price: '1,499',
      strikePrice: '151515',
      features: [
        'Access to equipment',
        'Limited classes',
        'Locker facilities',
        'Flexible timing'
      ],
      buttonColor: 'bg-electric-blue hover:bg-electric-blue/90',
      borderColor: 'border-electric-blue',
      popular: false
    },
    {
      name: 'Elite',
      price: '2,999',
      strikePrice: null,
      features: [
        'All pro features',
        'Unlimited personal training',
        'VIP area access',
        'Exclusive workshops and events'
      ],
      buttonColor: 'bg-crimson hover:bg-crimson/90',
      borderColor: 'border-crimson',
      popular: true,
      badge: 'POPULAR'
    },
    {
      name: 'Pro',
      price: '2,299',
      strikePrice: '151515',
      features: [
        'Full gymm access 24/7',
        'Complete class range',
        'Limited personal training',
        'Nutrition guidance and tracking'
      ],
      buttonColor: 'bg-deep-purple hover:bg-deep-purple/90',
      borderColor: 'border-deep-purple',
      popular: false
    }
  ]

  return (
    <section className="py-20 bg-dark-primary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-dark-card rounded-2xl p-8 border-2 ${plan.borderColor} ${
                plan.popular ? 'transform md:scale-105 shadow-2xl' : ''
              } transition-all hover:shadow-xl`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 right-8">
                  <span className="bg-crimson text-white px-4 py-1 rounded-full text-sm font-bold">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-3xl font-bold text-white mb-6">{plan.name}</h3>

              {/* Price */}
              <div className="mb-6">
                {plan.strikePrice && (
                  <span className="text-gray-500 line-through text-lg">₹{plan.strikePrice}</span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">₹{plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <FaCheck className="text-white mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button 
                className={`w-full ${plan.buttonColor} text-white py-4 rounded-full font-bold text-lg transition-all`}
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MembershipPlans
