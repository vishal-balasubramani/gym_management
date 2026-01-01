import { FaArrowUp, FaChartLine } from 'react-icons/fa'

const DashboardPreview = () => {
  return (
    <section className="py-20 bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-center text-white mb-4">
          POWERFUL DASHBOARDS FOR EVERYONE
        </h2>
        <p className="text-xl text-gray-400 text-center mb-16">
          Manage your fitness journey with intuitive dashboards
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admin Dashboard Preview */}
          <div className="bg-dark-card rounded-2xl p-8 border border-crimson/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Admin Control Panel</h3>
              <span className="text-crimson">●</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-dark-primary p-6 rounded-xl border border-electric-blue/30">
                <p className="text-gray-400 text-sm mb-2">Total Members</p>
                <p className="text-4xl font-bold text-electric-blue mb-2">1,237</p>
                <p className="text-electric-blue text-sm flex items-center gap-2">
                  <FaArrowUp /> +12
                </p>
              </div>

              <div className="bg-dark-primary p-6 rounded-xl border border-fiery-orange/30">
                <p className="text-gray-400 text-sm mb-2">Active Trainers</p>
                <p className="text-4xl font-bold text-fiery-orange mb-2">24</p>
                <p className="text-fiery-orange text-sm">Active</p>
              </div>

              <div className="bg-dark-primary p-6 rounded-xl border border-hot-magenta/30">
                <p className="text-gray-400 text-sm mb-2">Monthly Revenue</p>
                <p className="text-3xl font-bold text-hot-magenta mb-2">₹45,230</p>
                <p className="text-hot-magenta text-sm flex items-center gap-2">
                  <FaChartLine /> doubled
                </p>
              </div>

              <div className="bg-dark-primary p-6 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm mb-2">Monthly Revenue</p>
                <p className="text-3xl font-bold text-white mb-2">₹45,230</p>
                <p className="text-electric-blue text-sm flex items-center gap-2">
                  <FaArrowUp />
                </p>
              </div>
            </div>
          </div>

          {/* Trainer Dashboard Preview */}
          <div className="bg-dark-card rounded-2xl p-8 border border-electric-blue/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Trainer Dashboard</h3>
              <span className="text-electric-blue">●</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-dark-primary p-6 rounded-xl">
                <p className="text-gray-400 text-sm mb-2">Assigned Trainees</p>
                <p className="text-4xl font-bold text-fiery-orange mb-2">32</p>
                <p className="text-fiery-orange text-sm">+2 Assigned</p>
              </div>

              <div className="bg-dark-primary p-6 rounded-xl">
                <p className="text-gray-400 text-sm mb-2">Today Sessions</p>
                <p className="text-4xl font-bold text-electric-blue mb-2">8</p>
                <p className="text-electric-blue text-sm">Todays Sessions</p>
              </div>
            </div>

            <div className="bg-dark-primary p-4 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">Recent Sessions</h4>
                <span className="bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-bold">
                  upcoming
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white">Vishnu - Weight Loss Program</p>
                    <p className="text-yellow-500 text-sm">2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white">Vasu - Fitness maintenance</p>
                    <p className="text-green-500 text-sm">10:00 AM</p>
                  </div>
                  <span className="bg-green-500 text-black text-xs px-3 py-1 rounded-full font-bold">
                    completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardPreview
