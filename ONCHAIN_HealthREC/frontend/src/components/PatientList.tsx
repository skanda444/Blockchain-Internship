import React from 'react';
import { User, Calendar, UserCheck, Building2, Clock, FileText } from 'lucide-react';
import type { Patient } from '../services/canisterService';

interface PatientListProps {
  patients: Patient[];
  loading: boolean;
}

const PatientList: React.FC<PatientListProps> = ({ patients, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading patients...</span>
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
        <p className="text-gray-600">Add your first patient to get started with health record management.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {patients.map((patient, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <UserCheck className="h-4 w-4" />
                      <span>Dr. {patient.doctor}</span>
                    </div>
                  </div>
                </div>

                {patient.history && (
                  <div className="flex items-start space-x-3">
                    <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 line-clamp-2">{patient.history}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start lg:items-end xl:items-center space-y-2 sm:space-y-0 sm:space-x-6 lg:space-x-0 lg:space-y-2 xl:space-y-0 xl:space-x-6">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{formatDate(patient.appointment)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {patient.inClinic ? (
                    <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      <Building2 className="h-4 w-4" />
                      <span className="text-xs font-medium">In Clinic</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-medium">Scheduled</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientList;