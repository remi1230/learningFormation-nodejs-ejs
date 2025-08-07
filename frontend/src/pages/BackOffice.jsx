// src/pages/BackOffice.jsx.jsx
import UsersList from '../components/UsersList.jsx';
import SchedulesList from '../components/SchedulesList.jsx';
import ServicesList from '../components/ServicesList.jsx';
import { Clock } from "lucide-react";
import { Handshake } from 'lucide-react';
import { Package } from 'lucide-react';


export default function BackOffice() {
  return (
    <div className="min-h-screen p-6 bg-base-100">
        <div className="tabs tabs-lift w-140 sm:w-160 md:w-200 lg:w-240">
          <label className="tab">
            <input type="radio" name="my_tabs_4" />
            <Handshake className="text-primary" size={24} />
            <span className="ml-2">Collaborateurs</span>
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6"><UsersList /></div>

          <label className="tab">
            <input type="radio" name="my_tabs_4" defaultChecked />
            <Clock className="h-5 w-5" />
            <span className="ml-2">Horaires</span>
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6"><SchedulesList /></div>

          <label className="tab">
            <input type="radio" name="my_tabs_4" defaultChecked />
            <Package className="h-5 w-5" />
            <span className="ml-2">Services</span>
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6"><ServicesList /></div>
        </div>
    </div>
  );
}