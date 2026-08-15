/**
 * MOCK DATA — visual development only.
 *
 * This file is completely separate from the API service layer. The api
 * modules only fall back to it when `USE_MOCK` is true (i.e. VITE_API_URL is
 * not set). To remove mock data entirely, delete this file and the small
 * `USE_MOCK` branches inside the `src/api/*` modules — no UI component imports
 * anything from here.
 */

const now = new Date()
function inDays(days, hours = 0) {
  const d = new Date(now)
  d.setDate(d.getDate() + days)
  d.setHours(hours, 0, 0, 0)
  return d.toISOString()
}

export const mockCustomers = [
  {
    id: 1,
    full_name: "Ahmed Saad",
    phone: "+967 771 234 567",
    whatsapp_number: "+967 771 234 567",
    passport_number: "0A1234567",
    nationality: "Yemeni",
    notes: "Prefers window seats. Frequent flyer to Cairo.",
    created_at: inDays(-42),
  },
  {
    id: 2,
    full_name: "Ibrahim Al-Hadi",
    phone: "+967 733 998 210",
    whatsapp_number: "+967 733 998 210",
    passport_number: "0B7788990",
    nationality: "Yemeni",
    notes: "",
    created_at: inDays(-30),
  },
  {
    id: 3,
    full_name: "Layla Mansour",
    phone: "+971 50 118 4420",
    whatsapp_number: "+971 50 118 4420",
    passport_number: "AE5560012",
    nationality: "Emirati",
    notes: "Corporate account — invoice to Falcon Trading.",
    created_at: inDays(-18),
  },
  {
    id: 4,
    full_name: "Omar Khaled",
    phone: "+966 55 442 1180",
    whatsapp_number: "+966 55 442 1180",
    passport_number: "SA2231007",
    nationality: "Saudi",
    notes: "",
    created_at: inDays(-6),
  },
]

export const mockBookings = [
  {
    id: 101,
    customer_id: 1,
    ticket_number: "607-2231889001",
    pnr: "IY7X4Q",
    airline: "Yemenia",
    flight_number: "IY601",
    departure_airport_name: "Aden International Airport",
    departure_airport_code: "ADE",
    departure_city: "Aden",
    arrival_airport_name: "Cairo International Airport",
    arrival_airport_code: "CAI",
    arrival_city: "Cairo",
    departure_datetime: inDays(1, 19),
    arrival_datetime: inDays(1, 23),
    boarding_datetime: inDays(1, 18),
    ticket_class: "Economy",
    trip_type: "One Way",
    price: 420,
    currency: "USD",
    booking_status: "Confirmed",
    reminder_sent: false,
    created_at: inDays(-12),
  },
  {
    id: 102,
    customer_id: 3,
    ticket_number: "176-9982110045",
    pnr: "EK22PL",
    airline: "Emirates",
    flight_number: "EK724",
    departure_airport_name: "Dubai International Airport",
    departure_airport_code: "DXB",
    departure_city: "Dubai",
    arrival_airport_name: "Istanbul Airport",
    arrival_airport_code: "IST",
    arrival_city: "Istanbul",
    departure_datetime: inDays(4, 9),
    arrival_datetime: inDays(4, 13),
    boarding_datetime: inDays(4, 8),
    ticket_class: "Business",
    trip_type: "Round Trip",
    price: 1850,
    currency: "USD",
    booking_status: "Confirmed",
    reminder_sent: true,
    created_at: inDays(-9),
  },
  {
    id: 103,
    customer_id: 2,
    ticket_number: "607-4410023778",
    pnr: "IY9KM2",
    airline: "Yemenia",
    flight_number: "IY415",
    departure_airport_name: "Seiyun Airport",
    departure_airport_code: "GXF",
    departure_city: "Seiyun",
    arrival_airport_name: "King Abdulaziz International Airport",
    arrival_airport_code: "JED",
    arrival_city: "Jeddah",
    departure_datetime: inDays(-3, 14),
    arrival_datetime: inDays(-3, 16),
    boarding_datetime: inDays(-3, 13),
    ticket_class: "Economy",
    trip_type: "One Way",
    price: 310,
    currency: "USD",
    booking_status: "Completed",
    reminder_sent: true,
    created_at: inDays(-20),
  },
  {
    id: 104,
    customer_id: 4,
    ticket_number: "065-7781120934",
    pnr: "SV5TT9",
    airline: "Saudia",
    flight_number: "SV553",
    departure_airport_name: "King Khalid International Airport",
    departure_airport_code: "RUH",
    departure_city: "Riyadh",
    arrival_airport_name: "Aden International Airport",
    arrival_airport_code: "ADE",
    arrival_city: "Aden",
    departure_datetime: inDays(0, 21),
    arrival_datetime: inDays(1, 1),
    boarding_datetime: inDays(0, 20),
    ticket_class: "Economy",
    trip_type: "Round Trip",
    price: 560,
    currency: "USD",
    booking_status: "Pending",
    reminder_sent: false,
    created_at: inDays(-2),
  },
]

export const mockNotifications = [
  {
    id: 5001,
    customer_id: 3,
    customer_name: "Layla Mansour",
    booking_id: 102,
    flight_number: "EK724",
    status: "sent",
    sent_at: inDays(0, now.getHours()),
    whatsapp_message_id: "wamid.HBgMOTY3NzcxMjM0NTY3",
  },
  {
    id: 5002,
    customer_id: 2,
    customer_name: "Ibrahim Al-Hadi",
    booking_id: 103,
    flight_number: "IY415",
    status: "failed",
    sent_at: inDays(0, now.getHours() - 1),
    whatsapp_message_id: null,
  },
  {
    id: 5003,
    customer_id: 1,
    customer_name: "Ahmed Saad",
    booking_id: 101,
    flight_number: "IY601",
    status: "sent",
    sent_at: inDays(-1, 10),
    whatsapp_message_id: "wamid.HBgMOTY3NzcxOTk4MjEw",
  },
]

export function buildMockOverview() {
  const today = new Date()
  const isToday = (iso) => {
    const d = new Date(iso)
    return d.toDateString() === today.toDateString()
  }
  const upcoming = mockBookings.filter((b) => new Date(b.departure_datetime) >= today)
  return {
    totalCustomers: mockCustomers.length,
    totalBookings: mockBookings.length,
    upcomingFlights: upcoming.length,
    todayFlights: mockBookings.filter((b) => isToday(b.departure_datetime)).length,
    notificationStats: {
      sent: mockNotifications.filter((n) => n.status === "sent").length,
      failed: mockNotifications.filter((n) => n.status === "failed").length,
    },
    upcomingBookings: upcoming
      .sort((a, b) => new Date(a.departure_datetime) - new Date(b.departure_datetime))
      .slice(0, 5)
      .map((b) => ({
        ...b,
        customer_name: mockCustomers.find((c) => c.id === b.customer_id)?.full_name || "Unknown",
      })),
  }
}

export function mockActivity() {
  return mockNotifications
    .slice()
    .sort(
      (a, b) =>
        new Date(b.sent_at) -
        new Date(a.sent_at)
    )
    .map((n) => ({
      id: n.id,
      type: "system",
      status: n.status,
      message:
        n.status === "sent"
          ? `تم إرسال تذكير الرحلة ${n.flight_number} إلى ${n.customer_name}`
          : `فشل إرسال تذكير الرحلة ${n.flight_number} إلى ${n.customer_name}`,
      timestamp: n.sent_at,
    }))
}

/* Simulate network latency for realistic loading states in mock mode. */
export function delay(ms = 550) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
