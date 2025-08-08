// src/components/ServicesList.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import RichEditor from './ui-kit/RichEditor'
import RichTextView from './ui-kit/RichTextView';

export default function ServicesList() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    detail: ''
  });

  const [serviceToDelete, setServiceToDelete] = useState(null); // 🆕 stocke l'id du service à supprimer

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
        service.id ? `/api/services-crud/${service.id}` : '/api/services-crud',
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
      setServiceToDelete(null);
    },
  });

  if (isLoading) return <p>Chargement…</p>;
  if (isError) return <p className="text-red-500">Erreur : {error.message}</p>;

  const services = data.rows ?? data;

  return (
    <div className="space-y-8">
      {/* 🔽 Formulaire */}
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate(formData);
        }}
      >
        <div className="flex flex-row gap-4">
          <div className="basis-1/3 form-control grow">
            <label className="label">Désignation</label>
            <input
              className="input input-bordered w-full"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="basis-2/3 form-control grow">
            <label className="label">Description</label>
            <input
              className="input input-bordered w-full"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-control grow">
          <label className="label">Détails</label>
          <RichEditor
            value={formData.detail || ''}
            onChange={(html) => setFormData({ ...formData, detail: html })}
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

      {/* 🔽 Tableau */}
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
                <td>
                  <div className="line-clamp-3">
                    <RichTextView html={service.detail} />
                  </div>
              </td>
                <td className="space-y-2">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setFormData(service)}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => setServiceToDelete(service.id)}
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

      {/* 🔽 Modal DaisyUI de confirmation */}
      {serviceToDelete && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmer la suppression</h3>
            <p className="py-4">Voulez-vous vraiment supprimer ce service ?</p>
            <div className="modal-action">
              <form method="dialog" className="flex gap-2">
                <button className="btn" onClick={() => setServiceToDelete(null)}>
                  Annuler
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => deleteMutation.mutate(serviceToDelete)}
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