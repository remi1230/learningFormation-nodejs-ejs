// src/pages/BackOffice.jsx.jsx
import UsersList from '../components/UsersList.jsx';
import SchedulesList from '../components/SchedulesList.jsx';
import ServicesList from '../components/ServicesList.jsx';
import { Clock } from "lucide-react";
import { Users } from 'lucide-react';
import { lazy } from 'react';

export default function TabItem({ props }) {
  return (
  <div>
        <label className="tab">
            <input type="radio" name="my_tabs_4" />
                <Users className="text-primary" size={24} />
            <span className="ml-2">{props.title}</span>
        </label>
        <div className="tab-content bg-base-100 border-base-300 p-6">{props.children}</div>
  </div>);
}