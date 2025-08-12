// src/pages/BackOffice.jsx.jsx
import { useState } from 'react';
import CollabsList from '../components/CollabsList.jsx';
import SchedulesList from '../components/SchedulesList.jsx';
import ServicesList from '../components/ServicesList.jsx';
import PatientsList from '../components/PatientsList.jsx';
import NewsList from '../components/NewsList.jsx';
import AppointmentsList from '../components/AppointmentsList.jsx';
import { Clock } from "lucide-react";
import { Handshake } from 'lucide-react';
import { Users } from 'lucide-react';
import { Package } from 'lucide-react';
import { FileText } from 'lucide-react';
import { CalendarClock } from 'lucide-react';


export default function BackOffice() {
  const [tab, setTab] = useState('collabs');

  return (
    <div className="min-h-screen p-6 bg-base-100">
        <div className="tabs tabs-lift w-140 sm:w-160 md:w-200 lg:w-240">
          <label className="tab">
            <input type="radio" name="tabs" checked={tab==='collabs'} onChange={()=>setTab('collabs')} />
            <Handshake className="text-primary" size={24} />
            <span className="ml-2">Collaborateurs</span>
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6"><CollabsList /></div>

          <label className="tab">
            <input type="radio" name="tabs" checked={tab==='collabs'} onChange={()=>setTab('collabs')} />
            <Users className="h-5 w-5" />
            <span className="ml-2">Patients</span>
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6"><PatientsList /></div>

          <label className="tab">
            <input type="radio" name="tabs" checked={tab==='collabs'} onChange={()=>setTab('collabs')} />
            <Clock className="h-5 w-5" />
            <span className="ml-2">Horaires</span>
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6"><SchedulesList /></div>

          <label className="tab">
            <input type="radio" name="tabs" checked={tab==='collabs'} onChange={()=>setTab('collabs')} />
            <Package className="h-5 w-5" />
            <span className="ml-2">Services</span>
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6"><ServicesList /></div>

          <label className="tab">
            <input type="radio" name="tabs" checked={tab==='collabs'} onChange={()=>setTab('collabs')} />
            <FileText className="h-5 w-5" />
            <span className="ml-2">News</span>
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6"><NewsList /></div>

          <label className="tab">
            <input type="radio" name="tabs" checked={tab==='collabs'} onChange={()=>setTab('collabs')} />
            <CalendarClock className="h-5 w-5" />
            <span className="ml-2">RDV</span>
          </label>
          <div className="tab-content bg-base-100 border-base-300 px-6 pb-6"><AppointmentsList /></div>
        </div>
    </div>
  );
}