export type ReservationStatus = "pending" | "approved" | "denied";

export type ReservationRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  message: string;
  status: ReservationStatus;
  createdAt: string;
};

const requests: ReservationRequest[] = [];

export const reservationStore = {
  all() {
    return requests;
  },
  add(request: ReservationRequest) {
    requests.push(request);
    return request;
  },
  updateStatus(id: string, status: ReservationStatus) {
    const target = requests.find((item) => item.id === id);
    if (!target) {
      return null;
    }
    target.status = status;
    return target;
  }
};
