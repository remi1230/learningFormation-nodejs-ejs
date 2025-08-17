// src/pages/TakeAppointment.jsx
import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import moment from 'moment/min/moment-with-locales'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { diffYMD } from '../utils/dateFormat'
import { capitalizeFirstLetter } from '../utils/stringFormat'
import { Clock3, XCircle, ThumbsUp } from 'lucide-react'

moment.locale('fr')
const localizer = momentLocalizer(moment)

const dayIndex = {
  Dimanche: 0,
  Lundi:    1,
  Mardi:    2,
  Mercredi: 3,
  Jeudi:    4,
  Vendredi: 5,
  Samedi:   6
}

const STATUS_LABELS = {
  approved: 'Approuvé',
  pending: 'En attente',
  declined: 'Annulé',
}

const STATUS_OPTIONS = [
  { value: '',         label: 'Tous les statuts' },
  { value: 'approved', label: STATUS_LABELS.approved, icon: <ThumbsUp className="mr-1.5 h-3.5 w-3.5 shrink-0" aria-label={STATUS_LABELS.approved} title={STATUS_LABELS.approved} /> },
  { value: 'pending',  label: STATUS_LABELS.pending, icon: <Clock3 className="mr-1.5 h-3.5 w-3.5 shrink-0" aria-label={STATUS_LABELS.pending} title={STATUS_LABELS.pending} /> },
  { value: 'declined', label: STATUS_LABELS.declined, icon: <XCircle className="mr-1.5 h-3.5 w-3.5 shrink-0" aria-label={STATUS_LABELS.declined} title={STATUS_LABELS.declined} /> },
]

export default function TakeAppointment() {
  const [services, setServices] = useState([])
  const [scheduleList, setScheduleList] = useState([])
  const [dailyHours, setDailyHours] = useState({})

  const [selectedService, setSelectedService] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  const [rawEvents, setRawEvents] = useState([]) // données brutes des fetch
  const [events, setEvents] = useState([])       // données filtrées à afficher

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [statusChoice, setStatusChoice] = useState('pending')

  // Map serviceId -> {name,color}
  const serviceById = useMemo(() => {
    const map = new Map()
    services.forEach(s => map.set(Number(s.id), { name: s.name, color: s.color }))
    return map
  }, [services])

  // --- Charger services
  useEffect(() => {
    fetch('/api/services-crud', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error('Erreur services:', err))
  }, [])

  // --- Charger horaires (plage et jours visibles)
  useEffect(() => {
    fetch('/api/schedules-crud', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setScheduleList(data))
      .catch(console.error)
  }, [])

  // --- Construire dailyHours
  useEffect(() => {
    if (!scheduleList.length) return
    const map = {}
    scheduleList.forEach(({ order, openTime, closeTime }) => {
      const [openH, openM] = openTime.split(':').map(Number)
      const [closeH, closeM] = closeTime.split(':').map(Number)
      map[order % 7] = {
        open: { h: openH, m: openM },
        close: { h: closeH, m: closeM }
      }
    })
    setDailyHours(map)
  }, [scheduleList])

  // --- Calcul min/max + jours visibles
  let min, max, firstDayIdx, lastDayIdx
  if (scheduleList.length) {
    const opens = scheduleList.map(s => s.openTime.split(':').reduce((acc, val, i) => acc + Number(val) * (i === 0 ? 60 : 1), 0))
    const closes = scheduleList.map(s => s.closeTime.split(':').reduce((acc, val, i) => acc + Number(val) * (i === 0 ? 60 : 1), 0))
    const minMin = Math.min(...opens)
    const maxMin = Math.max(...closes)
    min = new Date(); min.setHours(Math.floor(minMin / 60), minMin % 60, 0, 0)
    max = new Date(); max.setHours(Math.floor(maxMin / 60), maxMin % 60, 0, 0)

    const days = scheduleList.map(s => dayIndex[s.dayOfWeek] ?? 0)
    firstDayIdx = Math.min(...days)
    lastDayIdx = Math.max(...days)
  }

  const dayPropGetter = date => {
    if (!scheduleList.length) return {}
    const idx = date.getDay()
    if (idx < firstDayIdx || idx > lastDayIdx) {
      return { style: { display: 'none' } }
    }
    return {}
  }

  const slotPropGetter = date => {
    const day = date.getDay()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const config = dailyHours[day]
    if (!config) return {}

    const start = config.open.h + config.open.m / 60
    const end = config.close.h + config.close.m / 60
    const current = hour + minute / 60

    if (current < start || current >= end) {
      return { style: { pointerEvents: 'none' } }
    }
    return {}
  }

  // --- Charger RDV (selon selectedService côté API si dispo)
  useEffect(() => {
    // Attendre d'avoir les services (utile pour color/name via serviceId)
    if (!services.length) return

    const url = selectedService
      ? `/api/appointments-by-service?serviceId=${selectedService}`
      : `/api/appointments-by-service`

    fetch(url, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(rdv => {
          const iso = `${rdv.date.split('T')[0]}T${rdv.time}`
          const start = new Date(iso)
          const end = new Date(start.getTime() + 30 * 60 * 1000)

          // Résolution service (sans dépendre d'un include côté API)
          const svc = serviceById.get(Number(rdv.serviceId)) || {}
          const color = svc.color || '#e11d48'
          const serviceName = svc.name || '—'

          return {
            id: rdv.id,
            title: rdv.User?.lastName || 'Réservé',
            firstName: rdv.User?.firstName,
            lastName: rdv.User?.lastName,
            createdAt: diffYMD(rdv.User?.createdAt),
            status: rdv.status,            // 'pending' | 'approved' | 'declined'
            start,
            end,
            color,
            service: serviceName,
            serviceId: rdv.serviceId,
          }
        })
        setRawEvents(formatted)
      })
      .catch(console.error)
  }, [selectedService, services, serviceById])

  // --- Appliquer filtre statut côté front
  useEffect(() => {
    let next = rawEvents
    if (selectedStatus) {
      next = next.filter(e => e.status === selectedStatus)
    }
    setEvents(next)
  }, [rawEvents, selectedStatus])

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color,
      color: 'white',
      border: 'none',
      padding: 0,
      margin: 0,
      width: '100%',
      height: '100%',
      borderRadius: 0
    }
  })

  function showToast(message) {
    const container = document.getElementById('toast-container')
    if (!container) return
    const toast = document.createElement('div')
    toast.className = 'alert alert-warning'
    toast.innerHTML = `<span>${message}</span>`
    container.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  function StatusIcon({ status, mr = '1.5' }) {
    // Icônes statiques (pas d’animate-spin)
    if (status === 'pending') {
      return <Clock3 className={`mr-${mr} h-3.5 w-3.5 shrink-0`} aria-label={STATUS_LABELS[status]} title={STATUS_LABELS[status]} />
    }
    if (status === 'declined') {
      return <XCircle className="mr-1.5 h-3.5 w-3.5 shrink-0" aria-label={STATUS_LABELS[status]} title={STATUS_LABELS[status]} />
    }
    if (status === 'approved') {
      return <ThumbsUp className="mr-1.5 h-3.5 w-3.5 shrink-0" aria-label={STATUS_LABELS[status]} title={STATUS_LABELS[status]} />
    }
    return null
  }

  function EventCell({ event }) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white text-xs font-medium">
        <StatusIcon status={event.status} />
        <span className="truncate">{event.title ?? 'Réservé'}</span>
        <div className="tooltip">
          <div className="tooltip-content" data-tip={`${event.title}`}>
            <span className="truncate">{event.title ?? 'Réservé'}</span>
          </div>
        </div>
      </div>
    );
  }

function EventWrapper({ children }) {
  // Vérifie si children est un React Element avant de cloner
  return React.isValidElement(children)
    ? React.cloneElement(children, { title: '' })
    : children;
}

  async function updateStatus() {
    if (!selectedEvent) return
    try {
      const res = await fetch(`/api/appointments-crud/${selectedEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusChoice }),
        credentials: 'include',
      })

      if (!res.ok) throw new Error('bad status')

      // MAJ optimiste dans rawEvents puis re-filtrage auto par l'effet
      setRawEvents(prev =>
        prev.map(e => e.id === selectedEvent.id ? { ...e, status: statusChoice } : e)
      )

      showToast('Statut mis à jour.')
      setShowEventModal(false)
      setSelectedEvent(null)
    } catch (e) {
      showToast('Erreur lors de la mise à jour du statut.')
    }
  }

  return (
    <div>
      <div className="toast toast-top toast-center z-50" id="toast-container"></div>

      <div className="flex flex-col gap-12 mt-6">
        <div className="flex-[1/3] flex flex-row gap-12 justify-between">
          <div className="flex flex-col justify-center gap-4">
            {/* --- Sélecteur Service --- */}
            <div className="form-control">
              <div className="dropdown">
                <label tabIndex={0} className="btn btn-outline w-64 flex justify-between items-center">
                  {selectedService
                    ? (
                      <>
                        <span
                          className="w-4 h-4 rounded-full inline-block mr-2"
                          style={{
                            backgroundColor:
                              services.find(s => s.id === Number(selectedService))?.color || '#ccc'
                          }}
                        ></span>
                        {services.find(s => s.id === Number(selectedService))?.name}
                      </>
                    )
                    : "Service"}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </label>

                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-64">
                  <li onClick={() => setSelectedService('')}>
                    <a>
                      <span className="w-4 h-4 rounded-full inline-block mr-2 bg-gray-300"></span>
                      Tous les services
                    </a>
                  </li>
                  {services.map(s => (
                    <li key={s.id} onClick={() => setSelectedService(s.id)}>
                      <a>
                        <span className="w-4 h-4 rounded-full inline-block mr-2" style={{ backgroundColor: s.color }}></span>
                        {s.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* --- Sélecteur Statut --- */}
            <div className="form-control">
              <div className="dropdown">
                <label tabIndex={0} className="btn btn-outline w-64 flex justify-between items-center">
                  {selectedStatus ? STATUS_LABELS[selectedStatus] : 'Statut'}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </label>

                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-64">
                  {STATUS_OPTIONS.map(opt => (
                    <li key={opt.value || 'all'} onClick={() => setSelectedStatus(opt.value)}>
                      <a>{opt.icon}{opt.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Légende */}
          <fieldset className="border border-base-300 rounded-lg">
            <legend>Légende</legend>
            <div className="grid grid-cols-2 gap-2 p-4">
              {services.map(service => (
                <div key={service.id} className="badge badge-outline rounded flex flex-row items-center gap-2 badge-xs p-3">
                  <span className="w-3 h-3 rounded-full inline-block border" style={{ backgroundColor: service.color }}></span>
                  <span className="text-xs">{service.name}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 p-4">
              <div className="flex flex-row gap-1 items-center">
                <StatusIcon status="pending" />
                <span className="text-xs">En attente</span>
              </div>
              <div className="flex flex-row gap-1 items-center">
                <StatusIcon status="declined" />
                <span className="text-xs">Annulé</span>
              </div>
              <div className="flex flex-row gap-1 items-center">
                <StatusIcon status="approved" />
                <span className="text-xs">Approuvé</span>
              </div>
            </div>
          </fieldset>
        </div>
        
        {/* Calendrier */}
        <div className="flex-[2/3] overflow-visible p-0 m-0">
          <Calendar
            components={{ event: EventCell, eventWrapper: EventWrapper }}
            localizer={localizer}
            events={events}
            min={min}
            max={max}
            dayPropGetter={dayPropGetter}
            slotPropGetter={slotPropGetter}
            defaultView="week"
            views={["week"]}
            step={30}
            timeslots={2}
            onSelectEvent={(event) => {
              setStatusChoice(event.status || 'pending')
              setSelectedEvent(event)
              setShowEventModal(true)
            }}
            eventPropGetter={eventStyleGetter}
            messages={{
              today: 'Aujourd’hui', previous: 'Précédent', next: 'Suivant',
              month: 'Mois', week: 'Semaine', day: 'Jour', agenda: 'Agenda',
              date: 'Date', time: 'Heure', event: 'Événement',
              noEventsInRange: 'Aucun événement',
              showMore: total => `+${total} en plus`
            }}
            formats={{
              timeGutterFormat: 'HH:mm', dayFormat: 'ddd D', weekdayFormat: 'dddd',
              dayHeaderFormat: 'dddd D MMMM',
              agendaHeaderFormat: ({ start, end }) => `${moment(start).format('D MMM')} – ${moment(end).format('D MMM')}`,
              agendaDateFormat: 'dddd D MMMM', agendaTimeFormat: 'HH:mm',
              agendaTimeRangeFormat: ({ start, end }) => `${moment(start).format('HH:mm')} – ${moment(end).format('HH:mm')}`
            }}
            style={{ height: '100%' }}
          />
        </div>
      </div>

      {/* Modal édition statut */}
      {showEventModal && selectedEvent && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="flex justify-between font-bold text-lg mb-4">
                <span className="text-2xl">Patient {capitalizeFirstLetter(selectedEvent.firstName)} {capitalizeFirstLetter(selectedEvent.lastName)}</span>
                <span className="badge"><span className="w-3 h-3 rounded-full inline-block border" style={{ backgroundColor: selectedEvent.color }}></span>Service {selectedEvent.service}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mb-4">
                <span className="text-xl">RDV du {moment(selectedEvent.start).format('dddd D MMMM YYYY à HH:mm')}</span>
                <div className="badge gap-0">
                  <div><StatusIcon status={selectedEvent.status} mr='1'/></div>
                  <div>{STATUS_LABELS[selectedEvent.status] || '—'}</div>
                </div>
              </div>
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Nouveau statut</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={statusChoice}
                onChange={(e) => setStatusChoice(e.target.value)}
              >
                <option value="approved">Approuvé</option>
                <option value="pending">En attente</option>
                <option value="declined">Annulé</option>
              </select>
            </div>

            <div className="modal-action">
              <form method="dialog" className="flex gap-4">
                <button className="btn" onClick={() => setShowEventModal(false)}>Fermer</button>
                <button className="btn btn-primary" onClick={updateStatus}>Enregistrer</button>
              </form>
            </div>
          </div>

          {/* Backdrop cliquable pour fermer */}
          <form method="dialog" className="modal-backdrop" onClick={() => setShowEventModal(false)}>
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  )
}