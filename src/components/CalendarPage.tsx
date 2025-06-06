import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

import { EventSourceInput } from "@fullcalendar/core/index.js";
import { getCurrentLanguage } from "../lib/i18n";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

type props = {
  show: boolean;
  setShow: (show: boolean) => void;
  events: EventSourceInput
};

export function CalendarPage({ show, setShow, events }: props) {
  return (
    <div
      hidden={!show}
      className={`z-[2000] top-0 h-full w-full absolute bg-white/85`}
    >
      <button
        className={`absolute text-2xl ml-2 mt-2`}
        onClick={() => setShow(false)}
      >
        <img className="h-6 ml-2" src="/icons/fermer.svg" />
      </button>
      <FullCalendar
        initialView="dayGridMonth"
        locale={getCurrentLanguage()}
        firstDay={1}
        themeSystem= 'bootstrap5'
        height={"100%"}
        headerToolbar={{
          start: "",
          center: "title",
          end: "today prev,next",
        }}
        buttonText={{
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaine",
          day: "Jour",
        }}
        plugins={[dayGridPlugin, bootstrap5Plugin]}
        events={events}
      />
    </div>
  );
}
