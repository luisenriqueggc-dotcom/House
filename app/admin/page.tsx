"use client";

import { useEffect, useState } from "react";

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

export default function AdminPage() {
  const [requests, setRequests] = useState<ReservationRequest[]>([]);
  const [status, setStatus] = useState("Cargando solicitudes...");

  const loadRequests = async () => {
    const response = await fetch("/api/requests");
    const data = (await response.json()) as ReservationRequest[];
    setRequests(data);
    setStatus(data.length ? "" : "No hay solicitudes nuevas.");
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateStatus = async (id: string, status: "approved" | "denied") => {
    await fetch("/api/requests", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, status })
    });
    loadRequests();
  };

  return (
    <main>
      <header>
        <h1>Panel interno</h1>
        <p>Administra las solicitudes recibidas y decide si se aprueban o se rechazan.</p>
        <nav>
          <a href="/">Volver al portal</a>
        </nav>
      </header>
      <section>
        <h2 className="section-title">Solicitudes recientes</h2>
        {status ? <p className="status">{status}</p> : null}
        <div className="admin-grid">
          {requests.map((request) => (
            <article className="request-card" key={request.id}>
              <header>
                <h3>{request.name}</h3>
              </header>
              <p className="request-meta">
                {request.startDate} → {request.endDate}
              </p>
              <p className="request-meta">{request.email} · {request.phone}</p>
              <p>{request.message || "Sin comentarios adicionales."}</p>
              <p className="request-meta">Estado: {request.status}</p>
              <div className="request-actions">
                <button type="button" onClick={() => updateStatus(request.id, "approved")}>Aceptar</button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => updateStatus(request.id, "denied")}
                >
                  Denegar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
