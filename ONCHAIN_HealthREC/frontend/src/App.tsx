import React, { useState, useEffect } from 'react';
import { Heart, Users, Plus, Search, RefreshCw, Calendar, UserCheck, Building2 } from 'lucide-react';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import StatsCard from './components/StatsCard';
import { loadPatients, addPatient, type Patient } from './services/canisterService';

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleLoadPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const patientList = await loadPatients();
      setPatients(patientList);
    } catch (err) {
      setError('Failed to load patients. Please try again.');
      console.error('Error loading patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (patientData: Omit<Patient, 'id'>) => {
    setError(null);
    try {
      await addPatient(patientData);
      setShowForm(false);
      await handleLoadPatients(); // Refresh the list
    } catch (err) {
      setError('Failed to add patient. Please try again.');
      console.error('Error adding patient:', err);
    }
  };

  useEffect(() => {
    handleLoadPatients();
  }, []);

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalPatients: patients.length,
    inClinicToday: patients.filter(p => p.inClinic).length,
    upcomingAppointments: patients.filter(p => p.appointment && new Date(p.appointment) > new Date()).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-xl shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HealthChain</h1>
                <p className="text-sm text-gray-600">Decentralized Health Records</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Patient</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="h-5 w-5 text-red-400">⚠️</div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="In Clinic Today"
            value={stats.inClinicToday}
            icon={Building2}
            color="green"
          />
          <StatsCard
            title="Upcoming Appointments"
            value={stats.upcomingAppointments}
            icon={Calendar}
            color="purple"
          />
        </div>

        {/* Add Patient Form */}
        {showForm && (
          <div className="mb-8">
            <PatientForm
              onSubmit={handleAddPatient}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Patient Management Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <span>Patient Records</span>
                </h2>
                <p className="text-sm text-gray-600 mt-1">Manage and view all patient information</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search patients or doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
                <button
                  onClick={handleLoadPatients}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <PatientList patients={filteredPatients} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;