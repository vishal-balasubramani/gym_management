import { useState, useEffect } from 'react'
import { FaCheck, FaCrown, FaStar, FaBolt } from 'react-icons/fa'
import api from '../../services/api'

// ✅ Helper function to load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function TraineePayment() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/trainee/plans')
        setPlans(res.data)
      } catch (err) {
        console.error("Error fetching plans:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  const handlePayment = async (plan) => {
    // 1. Load Razorpay Script first
    const isScriptLoaded = await loadRazorpayScript()
    if (!isScriptLoaded) {
      alert("Failed to load payment SDK. Please check your internet connection.")
      return
    }

    try {
      // 2. Create Order (Backend)
      const orderRes = await api.post('/trainee/create-order', { planId: plan.id })
      const order = orderRes.data

      // 3. Open Razorpay Popup
      const options = {
        key: "rzp_test_rN3ysbintURr2f", // ⚠️ REPLACE THIS WITH ACTUAL KEY OR import.meta.env.VITE_RAZORPAY_KEY
        amount: order.amount,
        currency: order.currency,
        name: "FitHub Gym",
        description: `Membership: ${plan.name}`,
        order_id: order.id,
        // image: "", // ❌ REMOVED to prevent net::ERR_INVALID_URL error
        
        handler: async function (response) {
           try {
             const verifyRes = await api.post('/trainee/verify-payment', {
               razorpay_order_id: response.razorpay_order_id,
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_signature: response.razorpay_signature,
               plan_id: plan.id
             })
             
             if(verifyRes.data.status === 'success') {
               alert("🎉 Payment Successful! Membership Activated.")
               window.location.reload()
             }
           } catch (err) {
             console.error(err)
             alert("Payment verification failed. Please contact support.")
           }
        },
        prefill: {
            name: "Trainee Name", // Update dynamically if you have user context
            email: "trainee@example.com",
            contact: "9999999999"
        },
        theme: {
            color: "#3B82F6"
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response){
        console.error("Payment Failed Error:", response.error)
        alert(`Payment Failed: ${response.error.description}`)
      })
      
      rzp.open()

    } catch (err) {
      console.error("Payment Init Error:", err)
      alert("Could not initiate payment. Please try again.")
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  return (
    <div className="animate-fade-in-up pb-10">
      <div className="text-center mb-12">
         <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
            Choose Your Membership
         </h2>
         <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Unlock your full potential with our premium plans. Access expert trainers, personalized diet plans, and exclusive equipment.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
         {plans.map((plan, idx) => {
            const isPopular = plan.name.toLowerCase().includes('pro') || idx === 1
            
            return (
               <div key={plan.id} className={`
                  relative bg-gray-900/60 backdrop-blur-md border rounded-3xl p-8 flex flex-col transition-all duration-300 hover:scale-[1.02]
                  ${isPopular 
                      ? 'border-blue-500 shadow-blue-500/20 shadow-2xl scale-105 z-10' 
                      : 'border-white/10 hover:border-white/20'
                  }
               `}>
                  
                  {isPopular && (
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                        <FaStar className="text-yellow-300" /> Most Popular
                     </div>
                  )}

                  <div className="mb-6 text-center md:text-left">
                     <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                     <div className="flex items-end justify-center md:justify-start gap-1">
                        <span className="text-4xl font-black text-white">₹{plan.price}</span>
                        <span className="text-gray-500 mb-1 font-medium">/ {plan.duration_months} mo</span>
                     </div>
                  </div>

                  <div className="flex-1 space-y-4 mb-8">
                     {plan.features ? plan.features.split(',').map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                           <div className={`mt-0.5 p-1 rounded-full shrink-0 ${isPopular ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-500'}`}>
                              <FaCheck size={10} />
                           </div>
                           <span className="leading-snug">{feature.trim()}</span>
                        </div>
                     )) : (
                        <p className="text-gray-500 text-sm">Standard gym access included.</p>
                     )}
                  </div>

                  <button 
                     onClick={() => handlePayment(plan)}
                     className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg
                     ${isPopular 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white hover:shadow-blue-500/25' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                     }`}
                  >
                     {isPopular ? <FaCrown /> : <FaBolt />} 
                     Select Plan
                  </button>
               </div>
            )
         })}
      </div>
    </div>
  )
}
