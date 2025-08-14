// src/pages/TakeAppointment.jsx
import { useEffect, useState } from 'react'
import moment from 'moment/min/moment-with-locales'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

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

export default function TakeAppointment() {
  const [services, setServices] = useState([])
  const [scheduleList, setScheduleList] = useState([])
  const [dailyHours, setDailyHours] = useState({})
  const [selectedService, setSelectedService] = useState('')
  const [events, setEvents] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetch('/api/services-crud', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setServices(data);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des services :", error);
      });
  }, []);

  useEffect(() => {
    fetch('/api/schedules-crud', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setScheduleList(data))
      .catch(console.error)
  }, [])

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
      return { style: { backgroundColor: '#f0f0f0', pointerEvents: 'none' } }
    }
    return {}
  }

  useEffect(() => {
    if (!selectedService) return setEvents([])

    fetch(`/api/appointments-by-service?serviceId=${selectedService}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(rdv => {
          const iso = `${rdv.date.split('T')[0]}T${rdv.time}`
          const start = new Date(iso)
          const end = new Date(start.getTime() + 30 * 60 * 1000)
          return { id: rdv.id, title: '', start, end }
        })
        setEvents(formatted)
      })
      .catch(console.error)
  }, [selectedService, scheduleList])

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#e11d48',
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

  async function confirmAppointment() {
    if (!selectedSlot) return
    const date = moment(selectedSlot.start).format('YYYY-MM-DD')
    const time = moment(selectedSlot.start).format('HH:mm')

    const res = await fetch('/api/appointments-crud', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId: selectedService, status: 'pending', date, time })
    })

    if (res.ok) {
      setEvents([...events, {
        id: Date.now(),
        title: '',
        start: selectedSlot.start,
        end: new Date(selectedSlot.start.getTime() + 30 * 60 * 1000)
      }])
      showToast('Rendez-vous confirmé !')
    } else {
      showToast('Erreur lors de la prise de RDV.')
    }
    setShowModal(false)
    setSelectedSlot(null)
  }

  return (
    <div>
      <h1 className="text-4xl text-center" >Prendre un RDV</h1>
      <div className="toast toast-top toast-center z-50" id="toast-container"></div>
      <div className="join gap-12 mt-12">
        <div className="flex-[1] flex flex-col justify-center">
          <div className="form-control">
            <label className="label mb-2">
              <h1 className="text-2xl">Service :</h1>
            </label>
            <select
              className="select select-bordered select-lg"
              value={selectedService}
              onChange={e => setSelectedService(e.target.value)}
            >
              <option value="">-- Sélectionner un service --</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-[2] overflow-visible p-0 m-0">
          <Calendar
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
            selectable
            onSelectSlot={slotInfo => {
              if (!selectedService) return showToast('Veuillez choisir un service.')
              const { start } = slotInfo
              const taken = events.some(e => e.start.getTime() === start.getTime());
              if (taken) return showToast('Créneau déjà pris.')
              const day = start.getDay()
              const hour = start.getHours()
              const minute = start.getMinutes()
              const cfg = dailyHours[day]
              if (!cfg) return showToast('Jour non travaillé.')
              const cur = hour + minute / 60
              const startH = cfg.open.h + cfg.open.m / 60
              const endH = cfg.close.h + cfg.close.m / 60
              if (cur < startH || cur >= endH) return showToast('Hors horaires.')
              setSelectedSlot(slotInfo)
              setShowModal(true)
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

      {showModal && selectedSlot && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirmer ce rendez-vous ?</h3>
            <p>Le {moment(selectedSlot.start).format('dddd D MMMM à HH:mm')}</p>
            <div className="modal-action">
              <form method="dialog" className="flex gap-4">
                <button className="btn" onClick={() => setShowModal(false)}>Annuler</button>
                <button className="btn btn-primary" onClick={confirmAppointment}>Confirmer</button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}