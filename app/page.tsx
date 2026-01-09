"use client";

import { useEffect, useMemo, useState } from "react";

const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

type ReservationRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  message: string;
  status: "pending" | "approved" | "denied";
  createdAt: string;
};

const staticHighlights = [
  "2024-11-09",
  "2024-11-16",
  "2024-11-23"
];

function getMonthDays(baseDate: Date) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Array<{ date: Date; label: number; isCurrentMonth: boolean }> = [];

  for (let i = 0; i < startOffset; i += 1) {
    const date = new Date(year, month, -startOffset + i + 1);
    days.push({ date, label: date.getDate(), isCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    days.push({ date, label: day, isCurrentMonth: true });
  }

  while (days.length % 7 !== 0) {
    const date = new Date(year, month, daysInMonth + (days.length - (startOffset + daysInMonth)) + 1);
    days.push({ date, label: date.getDate(), isCurrentMonth: false });
  }

  return days;
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function HomePage() {
  const [requests, setRequests] = useState<ReservationRequest[]>([]);
  const [statusMessage, setStatusMessage] = useState("Listo para recibir tu solicitud.");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    startDate: "",
    endDate: "",
    message: ""
  });

  const today = new Date();
  const currentMonth = today.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  const days = useMemo(() => getMonthDays(today), [today]);

  const reservedDates = useMemo(() => {
    const approved = requests.filter((item) => item.status === "approved");
    const approvedDays = approved.flatMap((item) => [item.startDate, item.endDate]);
    return new Set([...staticHighlights, ...approvedDays]);
  }, [requests]);

  useEffect(() => {
    const loadRequests = async () => {
      const response = await fetch("/api/requests");
      const data = (await response.json()) as ReservationRequest[];
      setRequests(data);
    };

    loadRequests();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("Enviando tu solicitud...");

    const response = await fetch("/api/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formState)
    });

    if (response.ok) {
      setStatusMessage("Solicitud enviada. Te responderemos pronto.");
      setFormState({
        name: "",
        email: "",
        phone: "",
        startDate: "",
        endDate: "",
        message: ""
      });
    } else {
      setStatusMessage("No pudimos enviar la solicitud. Intenta nuevamente.");
    }
  };

  return (
    <main>
      <header>
        <h1>Casa Aurora · Reservas privadas</h1>
        <p>
          Un portal minimalista para reservar los cuartos libres de mi casa. Revisa la disponibilidad,
          comparte tus fechas y recibiras una respuesta personalizada.
        </p>
        <nav>
          <a href="#disponibilidad">Disponibilidad</a>
          <a href="#informacion">Informacion</a>
          <a href="#reservar">Reservar</a>
          <a href="/admin">Panel interno</a>
        </nav>
      </header>

      <section id="disponibilidad">
        <h2 className="section-title">Calendario de disponibilidad</h2>
        <div className="calendar">
          <div className="calendar-header">
            <strong>{currentMonth}</strong>
            <span className="request-meta">Actualizado automaticamente</span>
          </div>
          <div className="calendar-grid">
            {WEEK_DAYS.map((day) => (
              <div className="day-label" key={day}>
                {day}
              </div>
            ))}
            {days.map((day) => {
              const formatted = formatDate(day.date);
              const isReserved = reservedDates.has(formatted);
              const isAvailable = day.isCurrentMonth && !isReserved;

              return (
                <div
                  key={formatted}
                  className={`day ${isReserved ? "reserved" : ""} ${isAvailable ? "available" : ""}`}
                >
                  {day.label}
                </div>
              );
            })}
          </div>
          <div className="legend">
            <span className="available">
              <i /> Disponible
            </span>
            <span className="reserved">
              <i /> Ocupado
            </span>
          </div>
        </div>
      </section>

      <section id="informacion">
        <h2 className="section-title">Informacion de la casa</h2>
        <div className="grid">
          <article className="info-card">
            <h3>Lo esencial</h3>
            <p>
              Dos habitaciones luminosas, acceso independiente y un ambiente tranquilo. Ideal para estadias
              cortas o visitas de fin de semana.
            </p>
            <ul>
              <li>Check-in flexible a partir de las 14:00</li>
              <li>Wi-Fi y escritorio listo para trabajar</li>
              <li>Desayuno ligero incluido</li>
            </ul>
          </article>
          <article className="info-card">
            <h3>Reglas de la casa</h3>
            <p>
              Queremos que todo fluya con calma. Te compartimos algunas reglas basicas para convivir sin
              fricciones.
            </p>
            <ul>
              <li>No fumar dentro de la casa</li>
              <li>Respetar el horario de descanso</li>
              <li>Confirmar numero de huespedes</li>
            </ul>
          </article>
        </div>
      </section>

      <section id="reservar">
        <h2 className="section-title">Solicitar reserva</h2>
        <div className="grid">
          <form onSubmit={handleSubmit}>
            <label>
              Nombre completo
              <input name="name" value={formState.name} onChange={handleChange} required />
            </label>
            <label>
              Correo electronico
              <input type="email" name="email" value={formState.email} onChange={handleChange} required />
            </label>
            <label>
              Telefono
              <input name="phone" value={formState.phone} onChange={handleChange} required />
            </label>
            <label>
              Fecha de llegada
              <input type="date" name="startDate" value={formState.startDate} onChange={handleChange} required />
            </label>
            <label>
              Fecha de salida
              <input type="date" name="endDate" value={formState.endDate} onChange={handleChange} required />
            </label>
            <label>
              Comentarios
              <textarea name="message" value={formState.message} onChange={handleChange} />
            </label>
            <button type="submit">Enviar solicitud</button>
            <p className="status">{statusMessage}</p>
          </form>
          <article className="info-card">
            <h3>Como funciona</h3>
            <p>
              Al enviar el formulario, tu solicitud queda pendiente. Desde el panel interno se puede aceptar o
              denegar la reserva. Cuando confirmemos la disponibilidad, te contactaremos por correo o telefono.
            </p>
            <p>
              Si necesitas un ajuste especial, dejalo en comentarios para revisarlo contigo.
            </p>
          </article>
        </div>
      </section>

      <footer>
        Portal privado para reservas · Listo para desplegar en Vercel y conectar con GitHub.
      </footer>
    </main>
  );
}
