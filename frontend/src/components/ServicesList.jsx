// src/components/ServicesList.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Pencil } from "lucide-react";
import { Plus } from "lucide-react";
import { Trash2 } from "lucide-react";

export default function ServicesList() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    detail: ''
  });

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await fetch('/api/services-crud', { credentials: 'include' });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (service) => {
      const res = await fetch(
        service.id
          ? `/api/services-crud/${service.id}`
          : '/api/services-crud',
        {
          method: service.id ? 'PUT' : 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(service),
        }
      );
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setFormData({ id: null, name: '', description: '', detail: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/services-crud/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  if (isLoading) return <p>Chargement…</p>;
  if (isError) return <p className="text-red-500">Erreur : {error.message}</p>;

  const services = data.rows ?? data;

  return (
    <div className="space-y-8">
      <form
        className="flex flex-wrap gap-4 items-end"
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate(formData);
        }}
      >
        <div className="form-control grow">
          <label className="label">Désignation</label>
          <input
            className="input input-bordered w-full"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-control grow">
          <label className="label">Description</label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="form-control grow">
          <label className="label">Détails</label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={3}
            value={formData.detail}
            onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
          />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary h-fit">
            {formData.id ? 'Modifier' : <Plus className="w-4 h-4" />}
          </button>
          {formData.id && (
            <button
              type="button"
              className="btn h-fit"
              onClick={() =>
                setFormData({ id: null, name: '', description: '', detail: '' })
              }
            >
              Annuler
            </button>
          )}
        </div>
      </form>


      <div className="overflow-y-auto h-120">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Désignation</th>
              <th>Description</th>
              <th>Détails</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.id}</td>
                <td>{service.name}</td>
                <td>{service.description}</td>
                <td>{service.detail}</td>
                <td className="space-y-2">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setFormData(service)}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => {
                      if (!window.confirm('Supprimer ce service ?')) return;
                      deleteMutation.mutate(service.id);
                    }}
                  >
                    {deleteMutation.isLoading && deleteMutation.variables === service.id
                      ? '…'
                      : <Trash2 className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}