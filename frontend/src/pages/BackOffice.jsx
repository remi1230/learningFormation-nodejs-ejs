// src/pages/BackOffice.jsx.jsx
import { useState } from 'react';
import CollabsList from '../components/CollabsList.jsx';
import SchedulesList from '../components/SchedulesList.jsx';
import ServicesList from '../components/ServicesList.jsx';
import PatientsList from '../components/PatientsList.jsx';
import NewsList from '../components/NewsList.jsx';
import AppointmentsList from '../components/AppointmentsList.jsx';
import { Clock, Handshake, Users, Package, FileText, CalendarClock } from "lucide-react";


export default function BackOffice() {
  const [tab, setTab] = useState('collabs');

return (
    <div className="min-h-screen p-6 bg-base-100">
      <div className="tabs tabs-lift w-140 sm:w-160 md:w-200 lg:w-240">
        {/* Collaborateurs */}
        <label className="tab">
          <input type="radio" name="tabs" checked={tab === 'collabs'} onChange={() => setTab('collabs')} />
          <Handshake className="text-primary" size={24} />
          <span className="ml-2">Collaborateurs</span>
        </label>
        {tab === 'collabs' && (
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <CollabsList />
          </div>
        )}

        {/* Patients */}
        <label className="tab">
          <input type="radio" name="tabs" checked={tab === 'patients'} onChange={() => setTab('patients')} />
          <Users className="h-5 w-5" />
          <span className="ml-2">Patients</span>
        </label>
        {tab === 'patients' && (
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <PatientsList />
          </div>
        )}

        {/* Horaires */}
        <label className="tab">
          <input type="radio" name="tabs" checked={tab === 'schedules'} onChange={() => setTab('schedules')} />
          <Clock className="h-5 w-5" />
          <span className="ml-2">Horaires</span>
        </label>
        {tab === 'schedules' && (
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <SchedulesList />
          </div>
        )}

        {/* Services */}
        <label className="tab">
          <input type="radio" name="tabs" checked={tab === 'services'} onChange={() => setTab('services')} />
          <Package className="h-5 w-5" />
          <span className="ml-2">Services</span>
        </label>
        {tab === 'services' && (
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <ServicesList />
          </div>
        )}

        {/* News */}
        <label className="tab">
          <input type="radio" name="tabs" checked={tab === 'news'} onChange={() => setTab('news')} />
          <FileText className="h-5 w-5" />
          <span className="ml-2">News</span>
        </label>
        {tab === 'news' && (
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <NewsList />
          </div>
        )}

        {/* RDV */}
        <label className="tab">
          <input type="radio" name="tabs" checked={tab === 'rdv'} onChange={() => setTab('rdv')} />
          <CalendarClock className="h-5 w-5" />
          <span className="ml-2">RDV</span>
        </label>
        {tab === 'rdv' && (
          <div className="tab-content bg-base-100 border-base-300 px-6 pb-6">
            <AppointmentsList />
          </div>
        )}
      </div>
    </div>
  );
}