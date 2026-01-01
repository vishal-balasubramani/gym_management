import { useState, useEffect } from 'react'
import { 
  FaPlus, 
  FaWeight, 
  FaRuler, 
  FaStickyNote, 
  FaChartLine 
} from 'react-icons/fa'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import api from '../../services/api'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function TraineeProgress() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    notes: ''
  })

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const res = await api.get('/trainee/my-progress')
      setHistory(res.data.history || [])
    } catch (err) {
      console.error('Error loading progress:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.weight || !form.date) {
      alert('Please enter at least date and weight')
      return
    }
    try {
      setSaving(true)
      await api.post('/trainee/my-progress', {
        ...form,
        weight: parseFloat(form.weight) || null,
        chest: form.chest ? parseFloat(form.chest) : null,
        waist: form.waist ? parseFloat(form.waist) : null,
        hips: form.hips ? parseFloat(form.hips) : null
      })
      await fetchHistory()
      setForm(f => ({ ...f, weight: '', chest: '', waist: '', hips: '', notes: '' }))
    } catch (err) {
      console.error('Error saving progress:', err)
      alert('Failed to save progress')
    } finally {
      setSaving(false)
    }
  }

  // ✅ CHART DATA PREP
  const chartData = {
    labels: history.map(entry => 
      new Date(entry.date).toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric'
      })
    ).reverse(), // Reverse for chronological order
    datasets: [
      {
        label: 'Weight (kg)',
        data: history.map(entry => entry.weight).reverse(),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#ffffff',
          font: { size: 14, weight: 'bold' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3B82F6',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Weight: ${context.parsed.y} kg`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255,255,255,0.1)'
        },
        ticks: {
          color: '#9CA3AF'
        }
      },
      y: {
        grid: {
          color: 'rgba(255,255,255,0.1)'
        },
        ticks: {
          color: '#9CA3AF',
          callback: function(value) {
            return value + 'kg'
          }
        },
        beginAtZero: false
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    }
  }

  return (
    <div className="animate-fade-in-up pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <FaChartLine className="text-blue-400 text-xl" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Progress Tracker
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Track your transformation with charts and measurements
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form 
        onSubmit={handleSubmit}
        className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 mb-8 space-y-6"
      >
        {/* Form fields - SAME AS BEFORE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 flex items-center gap-2">
              <FaWeight className="text-blue-400" /> Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 72.5"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 flex items-center gap-2">
              <FaRuler className="text-purple-400" /> Chest (cm)
            </label>
            <input
              type="number"
              step="0.1"
              name="chest"
              value={form.chest}
              onChange={handleChange}
              className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 flex items-center gap-2">
              <FaRuler className="text-emerald-400" /> Waist (cm)
            </label>
            <input
              type="number"
              step="0.1"
              name="waist"
              value={form.waist}
              onChange={handleChange}
              className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Hips (cm)</label>
            <input
              type="number"
              step="0.1"
              name="hips"
              value={form.hips}
              onChange={handleChange}
              className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 flex items-center gap-2">
              <FaStickyNote className="text-yellow-300" /> Notes
            </label>
            <input
              type="text"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="How did you feel today?"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-blue-500/30 disabled:opacity-60"
          >
            <FaPlus />
            {saving ? 'Saving...' : 'Add Entry'}
          </button>
        </div>
      </form>

      {/* ✅ PROGRESS GRAPH */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <FaChartLine className="text-blue-400 text-xl" />
          </div>
          <h3 className="text-xl font-bold text-white">Weight Progress Chart</h3>
        </div>
        
        {history.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <FaChartLine className="text-3xl text-gray-600" />
            </div>
            <p className="text-lg">No data yet</p>
            <p className="text-sm mt-1">Add your first weight entry above to see your progress graph</p>
          </div>
        ) : (
          <div className="h-80 md:h-96 relative">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </div>

      {/* Recent Measurements Table */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Check-ins</h3>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No progress entries yet.
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.slice(0, 10).map((entry, idx) => {
              const prev = history[idx + 1]
              let delta = null
              if (prev && prev.weight && entry.weight) {
                delta = (entry.weight - prev.weight).toFixed(1)
              }

              return (
                <div
                  key={entry.id}
                  className="flex flex-col md:flex-row md:items-center justify-between bg-black/40 rounded-xl px-4 py-3 border border-white/5 hover:bg-black/60 transition-all"
                >
                  <div className="mb-3 md:mb-0 md:w-1/4">
                    <div className="text-sm font-semibold text-white">
                      {new Date(entry.date).toLocaleDateString('en-GB')}
                    </div>
                    <div className="text-xs text-gray-400">
                      {entry.notes || 'No notes'}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs flex-1 justify-end">
                    <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 font-semibold">
                      {entry.weight} kg
                      {delta !== null && (
                        <span className={delta > 0 ? 'text-red-400 ml-1' : 'text-emerald-400 ml-1'}>
                          ({delta > 0 ? '+' : ''}{delta})
                        </span>
                      )}
                    </span>
                    {entry.chest && (
                      <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-300">
                        Chest: {entry.chest} cm
                      </span>
                    )}
                    {entry.waist && (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300">
                        Waist: {entry.waist} cm
                      </span>
                    )}
                    {entry.hips && (
                      <span className="px-3 py-1 rounded-full bg-pink-500/15 text-pink-300">
                        Hips: {entry.hips} cm
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
