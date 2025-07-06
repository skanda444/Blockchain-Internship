import React, { useState } from 'react';
import { User, FileText, UserCheck, Calendar, Building2, Save, X } from 'lucide-react';
import type { Patient } from '../services/canisterService';

interface PatientFormProps {
  onSubmit: (patient: Omit<Patient, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    history: '',
    doctor: '',
    appointment: '',
    inClinic: false
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.doctor.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        history: '',
        doctor: '',
        appointment: '',
        inClinic: false
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <User className="h-5 w-5 text-blue-600" />
          <span>Add New Patient</span>
        </h3>
        <p className="text-sm text-gray-600 mt-1">Enter patient information to create a new record</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>Patient Name *</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter patient's full name"
            />
          </div>

          {/* Doctor */}
          <div className="space-y-2">
            <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-gray-500" />
              <span>Attending Doctor *</span>
            </label>
            <input
              type="text"
              id="doctor"
              name="doctor"
              required
              value={formData.doctor}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter doctor's name"
            />
          </div>
        </div>

        {/* Medical History */}
        <div className="mt-6 space-y-2">
          <label htmlFor="history" className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span>Medical History</span>
          </label>
          <textarea
            id="history"
            name="history"
            value={formData.history}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
            placeholder="Enter patient's medical history, current conditions, medications, etc."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Appointment */}
          <div className="space-y-2">
            <label htmlFor="appointment" className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Appointment Date</span>
            </label>
            <input
              type="datetime-local"
              id="appointment"
              name="appointment"
              value={formData.appointment}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          {/* In Clinic Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span>Patient Status</span>
            </label>
            <div className="flex items-center space-x-3 pt-3">
              <input
                type="checkbox"
                id="inClinic"
                name="inClinic"
                checked={formData.inClinic}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="inClinic" className="text-sm text-gray-700">
                Currently in clinic
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            disabled={submitting || !formData.name.trim() || !formData.doctor.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{submitting ? 'Saving...' : 'Save Patient'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;