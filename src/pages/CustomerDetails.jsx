import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
    ArrowRight,
    Mail,
    Phone,
    MapPin,
    User,
} from "lucide-react"

import { getCustomers } from "../api/customerApi"
import { usePageMeta } from "../components/layout/layoutMeta"
import { LoadingState, ErrorState } from "../components/common/States"
import Avatar from "../components/common/Avatar"
import StatusBadge from "../components/common/StatusBadge"

import "./CustomerDetails.css"

export default function CustomerDetails() {
    const { id } = useParams()

    usePageMeta(
        "تفاصيل العميل",
        ["الرئيسية", "العملاء", "تفاصيل العميل"]
    )

    const [customer, setCustomer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadCustomer() {
            setLoading(true)
            setError(null)

            try {
                const customers = await getCustomers()

                const found = customers.find(
                    (c) => Number(c.id) === Number(id)
                )

                if (!found) {
                    throw new Error(
                        "لم يتم العثور على العميل"
                    )
                }

                setCustomer(found)
            } catch (err) {
                setError(
                    err.message ||
                    "تعذر تحميل بيانات العميل"
                )
            } finally {
                setLoading(false)
            }
        }

        loadCustomer()
    }, [id])

    if (loading) {
        return <LoadingState />
    }

    if (error) {
        return <ErrorState message={error} />
    }

    return (
        <div className="customer-details-page">
            <Link
                to="/customers"
                className="back-link"
            >
                <ArrowRight size={17} />
                العودة إلى العملاء
            </Link>

            <div className="customer-details-card">
                <div className="customer-details-header">
                    <Avatar
                        name={customer.name}
                    />

                    <div>
                        <h1>
                            {customer.name}
                        </h1>

                        <StatusBadge
                            status={customer.status}
                        />
                    </div>
                </div>

                <div className="customer-details-grid">

                    <div className="customer-detail">
                        <Mail size={18} />

                        <div>
                            <span>
                                البريد الإلكتروني
                            </span>

                            <strong dir="ltr">
                                {customer.email}
                            </strong>
                        </div>
                    </div>

                    <div className="customer-detail">
                        <Phone size={18} />

                        <div>
                            <span>
                                رقم الهاتف
                            </span>

                            <strong dir="ltr">
                                {customer.phone}
                            </strong>
                        </div>
                    </div>

                    <div className="customer-detail">
                        <MapPin size={18} />

                        <div>
                            <span>
                                الدولة
                            </span>

                            <strong>
                                {customer.country ||
                                    "---"}
                            </strong>
                        </div>
                    </div>

                    <div className="customer-detail">
                        <User size={18} />

                        <div>
                            <span>
                                عدد الحجوزات
                            </span>

                            <strong>
                                {customer.bookingsCount ??
                                    0}
                            </strong>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}