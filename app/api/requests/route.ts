import { reservationStore, type ReservationRequest, type ReservationStatus } from "@/lib/store";

const jsonHeaders = {
  "Content-Type": "application/json"
};

export async function GET() {
  return new Response(JSON.stringify(reservationStore.all()), {
    headers: jsonHeaders
  });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Omit<ReservationRequest, "id" | "status" | "createdAt">;

  const entry: ReservationRequest = {
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
    ...payload
  };

  reservationStore.add(entry);

  return new Response(JSON.stringify(entry), {
    headers: jsonHeaders,
    status: 201
  });
}

export async function PUT(request: Request) {
  const payload = (await request.json()) as { id: string; status: ReservationStatus };
  const updated = reservationStore.updateStatus(payload.id, payload.status);

  if (!updated) {
    return new Response(JSON.stringify({ message: "Not found" }), {
      headers: jsonHeaders,
      status: 404
    });
  }

  return new Response(JSON.stringify(updated), {
    headers: jsonHeaders
  });
}
