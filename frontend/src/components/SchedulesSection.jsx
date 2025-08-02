import { useEffect, useState } from "react";
import { fetchSchedules } from "../api";

export default function SchedulesSection() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchSchedules().then(setSchedules).catch(console.error);
  }, []);

  return (
    <section className="flex flex-col text-center mt-6">
      <div className="text-4xl font-bold text-primary mb-2">Horaires d'ouverture</div>
        <div className="overflow-x-auto">
          <table className="table table-lg mt-0 mb-0 text-center">
            <thead className="text-2xl">
              <tr>
                <th>Jour</th>
                <th>Matin</th>
                <th>Après-midi</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                  <tr key={schedule.dayOfWeek}>
                    <th>{schedule.dayOfWeek}</th>
                    <th>{schedule.openTime.slice(0, schedule.openTime.length - 3)}</th>
                    <th>{schedule.closeTime.slice(0, schedule.closeTime.length - 3)}</th>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
    </section>
  );
}