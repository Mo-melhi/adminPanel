import apiClient, { USE_MOCK } from "./apiClient"
import {
    mockNotifications,
    mockBookings,
    mockCustomers,
    delay,
} from "../utils/mockData"

/**
 * Notification API.
 * Backend contract (only endpoints that actually exist):
 *   GET  /notification/activity/history   -> notification history
 *   POST /bookings/:id/reminder           -> send a manual reminder for a booking
 *
 * Do not invent additional endpoints — adjust the paths here to match the
 * real backend if they differ.
 */

function normalizeNotification(notification) {
    return {
        ...notification,

        status:
            String(notification.status || "")
                .toLowerCase(),

        customer_name:
            notification.customer_name ||
            notification.full_name ||
            "---",

        sent_at:
            notification.sent_at ||
            null,
    }
}

export const notificationApi = {
    async history() {
        if (USE_MOCK) {
            await delay()

            return [...mockNotifications]
                .sort(
                    (a, b) =>
                        new Date(b.sent_at) -
                        new Date(a.sent_at)
                )
                .map(normalizeNotification)
        }

        const { data } =
            await apiClient.get("/dashboard/activity")

        return Array.isArray(data)
            ? data.map(normalizeNotification)
            : []
    },

    async sendReminder(bookingId) {
        if (USE_MOCK) {
            await delay(700)

            const booking = mockBookings.find(
                (b) => b.id === Number(bookingId)
            )

            if (!booking) {
                return {
                    success: false,
                    status: "failed",
                }
            }

            const customer = mockCustomers.find(
                (c) => c.id === booking.customer_id
            )

            const notification = {
                id:
                    Math.max(
                        0,
                        ...mockNotifications.map(
                            (n) => n.id
                        )
                    ) + 1,

                customer_id:
                    booking.customer_id,

                customer_name: customer?.full_name || customer?.name || "Unknown",

                booking_id: booking.id,

                flight_number:
                    booking.flight_number,

                status: "sent",

                sent_at:
                    new Date().toISOString(),

                whatsapp_message_id:
                    `mock-${Date.now()}`,
            }

            mockNotifications.unshift(
                notification
            )

            return {
                success: true,
                booking_id: bookingId,
                status: "sent",
                notification,
            }
        }

        const { data } =
            await apiClient.post(
                `/notifications/${bookingId}/send`
            )

        return {
            success: true,
            booking_id: bookingId,
            status: "sent",
            ...data,
        }
    },
}

export const getActivity = async () => {

    if (USE_MOCK) {

        await delay();

        return [...mockNotifications]
            .sort(
                (a, b) =>
                    new Date(b.sent_at) - new Date(a.sent_at)
            );
    }

    const { data } = await apiClient.get("/dashboard/activity");

    return data;
};