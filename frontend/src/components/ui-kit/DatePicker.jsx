// DatePicker.jsx
import { useEffect, useRef } from "react";
import { toYMD, formatFR } from "../../utils/dateFormat";
import 'cally';

export default function DatePicker({ formData, setFormData }) {
  const calRef = useRef(null);

  useEffect(() => {
    const el = calRef.current;
    if (!el) return;

    const onChange = (e) => {
      const raw = e.target?.value;           // ex: '2025-08-09' (selon le web component)
      const ymd = toYMD(raw);                // on force 'YYYY-MM-DD'
      if (!ymd) return;
      setFormData((prev) => ({ ...prev, publishedDate: ymd }));
    };

    el.addEventListener("change", onChange);
    return () => el.removeEventListener("change", onChange);
  }, [setFormData]);

  const ymd = formData.publishedDate || '';
  const label = ymd ? formatFR(ymd) : 'Date';

  return (
    <div className="basis-2/3 form-control grow">
      <button
        id="cally1"
        type="button"
        popoverTarget="cally-popover1"
        className="input input-bordered"
        style={{ anchorName: "--cally1" }}
      >
        {label}
      </button>

      <div
        id="cally-popover1"
        popover="auto"
        className="dropdown bg-base-100 rounded-box shadow-lg"
        style={{ positionAnchor: "--cally1" }}
      >
        <calendar-date
          ref={calRef}
          class="cally"
          value={ymd}     // <-- valeur stockée envoyée à l’API : YYYY-MM-DD
          required
        >
          <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
          <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
          <calendar-month></calendar-month>
        </calendar-date>
      </div>
    </div>
  );
}