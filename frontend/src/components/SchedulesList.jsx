import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Pencil, Plus, Trash2 } from "lucide-react";

const API_BASE = `${import.meta.env.BASE_URL}api`;

export default function SchedulesList() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    id: null,
    dayOfWeek: '',
    openTime: '',
    closeTime: '',
    order: null,
  });

  const [scheduleToDelete, setScheduleToDelete] = useState(null); // Pour stocker le créneau à supprimer

  const daysOfWeek = [
    { label: 'Lundi', value: 'Lundi', order: 1 },
    { label: 'Mardi', value: 'Mardi', order: 2 },
    { label: 'Mercredi', value: 'Mercredi', order: 3 },
    { label: 'Jeudi', value: 'Jeudi', order: 4 },
    { label: 'Vendredi', value: 'Vendredi', order: 5 },
    { label: 'Samedi', value: 'Samedi', order: 6 },
  ];

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/schedules-crud`, { credentials: 'include' });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id
        ? `${API_BASE}/schedules-crud/${formData.id}`
        : `${API_BASE}/schedules-crud`;
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setFormData({ id: null, dayOfWeek: '', openTime: '', closeTime: '', order: null });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_BASE}/schedules-crud/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setScheduleToDelete(null);
    },
  });

  if (isLoading) return <p>Chargement…</p>;
  if (isError) return <p className="text-red-500">Erreur : {error.message}</p>;

  const schedules = data.rows ?? data.sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      {/* FORMULAIRE */}
      <form
        className="flex flex-row flex-wrap items-end gap-4 justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate(formData);
        }}
      >
        <div className="form-control">
          <label className="label"><span className="label-text">Jour</span></label>
          <select
            className="select select-bordered"
            value={formData.dayOfWeek}
            onChange={(e) => {
              const selectedDay = daysOfWeek.find(d => d.value === e.target.value);
              setFormData({
                ...formData,
                dayOfWeek: selectedDay.value,
                order: selectedDay.order,
              });
            }}
            required
          >
            <option value="">-- Sélectionner --</option>
            {daysOfWeek.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Ouverture</span></label>
          <input
            type="time"
            className="input input-bordered"
            value={formData.openTime}
            onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
            required
          />
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Fermeture</span></label>
          <input
            type="time"
            className="input input-bordered"
            value={formData.closeTime}
            onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
            required
          />
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">&nbsp;</span></label>
          <button type="submit" className="btn btn-primary">
            {formData.id ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {/* TABLEAU */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Jour</th>
              <th>Ouverture</th>
              <th>Fermeture</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.dayOfWeek}</td>
                <td>{s.openTime}</td>
                <td>{s.closeTime}</td>
                <td className="space-x-2">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() =>
                      setFormData({
                        id: s.id,
                        dayOfWeek: s.dayOfWeek,
                        openTime: s.openTime,
                        closeTime: s.closeTime,
                        order: s.order,
                      })
                    }
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => setScheduleToDelete(s.id)}
                  >
                    {deleteMutation.isLoading && deleteMutation.variables === s.id
                      ? '...'
                      : <Trash2 className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DAISYUI */}
      {scheduleToDelete && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Supprimer cet horaire ?</h3>
            <p className="py-4">Cette action est irréversible.</p>
            <div className="modal-action">
              <form method="dialog" className="flex gap-2">
                <button className="btn" onClick={() => setScheduleToDelete(null)}>
                  Annuler
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => deleteMutation.mutate(scheduleToDelete)}
                >
                  Supprimer
                </button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}