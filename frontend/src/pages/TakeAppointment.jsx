import { useEffect, useState } from 'react'
import moment from 'moment/min/moment-with-locales'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

moment.locale('fr')
const localizer = momentLocalizer(moment)

export default function Planning() {
  const [events, setEvents] = useState([])
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)

  // 🧩 Liste des services (en dur ou via API)
  useEffect(() => {
    // Tu peux remplacer ça par un fetch si tu as une API de services
    setServices([
      { id: 1, name: 'Consultation' },
      { id: 2, name: 'Détartrage' },
    ])
  }, [])

  // 🔄 Chargement des RDV filtrés par service
  useEffect(() => {
    if (!selectedService) return

    fetch(`/api/appointments-by-service?serviceId=${selectedService}`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(rdv => {
          const datetimeString = `${rdv.date.split('T')[0]}T${rdv.time}`
          const start = new Date(datetimeString)
          const end = new Date(start.getTime() + 30 * 60 * 1000)

          return {
            id: rdv.id,
            title: 'Rdv déjà pris',
            start,
            end
          }
        })
        setEvents(formatted)
      })
      .catch(err => console.error('Erreur lors du chargement des RDV', err))
  }, [selectedService])

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#e11d48',
      color: 'white',
      border: 'none',
      borderRadius: '0px',
      padding: 0,
      margin: 0,
      width: '100%',
      height: '100%'
    }
  })

  return (
    <div className="h-[800px] p-4 bg-base-100 space-y-4">
      {/* 🔽 Sélecteur de service */}
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Choisir un service</span>
        </label>
        <select
          className="select select-bordered select-sm"
          value={selectedService ?? ''}
          onChange={e => setSelectedService(e.target.value)}
        >
          <option disabled value="">-- Sélectionner un service --</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <Calendar
        min={new Date(2025, 0, 1, 8, 0)}
        max={new Date(2025, 0, 1, 18, 0)}
        localizer={localizer}
        events={events}
        defaultView="week"
        views={['month', 'week']}
        messages={{
          today: 'Aujourd’hui',
          previous: 'Précédent',
          next: 'Suivant',
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
          agenda: 'Agenda',
          date: 'Date',
          time: 'Heure',
          event: 'Événement',
          noEventsInRange: 'Aucun événement',
          showMore: total => `+${total} en plus`
        }}
        components={{
          event: () => null
        }}
        formats={{
          timeGutterFormat: 'HH:mm',
          dayFormat: 'ddd D',
          weekdayFormat: 'dddd',
          dayHeaderFormat: 'dddd D MMMM',
          agendaHeaderFormat: ({ start, end }) =>
            `${moment(start).format('D MMM')} – ${moment(end).format('D MMM')}`,
          agendaDateFormat: 'dddd D MMMM',
          agendaTimeFormat: 'HH:mm',
          agendaTimeRangeFormat: ({ start, end }) =>
            `${moment(start).format('HH:mm')} – ${moment(end).format('HH:mm')}`
        }}
        step={30}
        timeslots={2}
        selectable
        onSelectSlot={(slotInfo) => {
          console.log('Créneau libre sélectionné', slotInfo)
        }}
        onSelectEvent={(event) => alert(event.title)}
        eventPropGetter={eventStyleGetter}
        style={{ height: '100%' }}
      />
    </div>
  )
}