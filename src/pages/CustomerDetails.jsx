import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
    ArrowRight,
    Phone,
    MessageCircle,
    CreditCard,
    Globe,
    FileText,
    CalendarDays,
} from "lucide-react"

import { getCustomer } from "../api/customerApi"
import { usePageMeta } from "../components/layout/layoutMeta"
import { LoadingState, ErrorState } from "../components/common/States"
import Avatar from "../components/common/Avatar"

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
                const found = await getCustomer(id)

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

            {/* العودة */}

            <Link
                to="/customers"
                className="back-link"
            >
                <ArrowRight size={17} />
                العودة إلى العملاء
            </Link>

            <div className="customer-details-card">

                {/* ================= HEADER ================= */}

                <div className="customer-details-header">

                    <Avatar
                        name={customer.full_name}
                    />

                    <div>
                        <h1>
                            {customer.full_name}
                        </h1>

                        <span className="customer-details-subtitle">
                            عميل
                        </span>
                    </div>

                </div>

                {/* ================= DETAILS ================= */}

                <div className="customer-details-grid">

                    {/* الهاتف */}

                    <div className="customer-detail">

                        <Phone size={18} />

                        <div>

                            <span>
                                رقم الهاتف
                            </span>

                            <strong dir="ltr">
                                {customer.phone || "---"}
                            </strong>

                        </div>

                    </div>

                    {/* الواتساب */}

                    <div className="customer-detail">

                        <MessageCircle size={18} />

                        <div>

                            <span>
                                رقم الواتساب
                            </span>

                            <strong dir="ltr">
                                {customer.whatsapp_number || "---"}
                            </strong>

                        </div>

                    </div>

                    {/* جواز السفر */}

                    <div className="customer-detail">

                        <CreditCard size={18} />

                        <div>

                            <span>
                                رقم جواز السفر
                            </span>

                            <strong dir="ltr">
                                {customer.passport_number || "---"}
                            </strong>

                        </div>

                    </div>

                    {/* الجنسية */}

                    <div className="customer-detail">

                        <Globe size={18} />

                        <div>

                            <span>
                                الجنسية
                            </span>

                            <strong>
                                {customer.nationality || "---"}
                            </strong>

                        </div>

                    </div>

                    {/* تاريخ الإضافة */}

                    <div className="customer-detail">

                        <CalendarDays size={18} />

                        <div>

                            <span>
                                تاريخ الإضافة
                            </span>

                            <strong dir="ltr">
                                {customer.created_at
                                    ? new Date(
                                        customer.created_at
                                    ).toLocaleDateString("ar")
                                    : "---"}
                            </strong>

                        </div>

                    </div>

                    {/* الملاحظات */}

                    <div className="customer-detail customer-detail-wide">

                        <FileText size={18} />

                        <div>

                            <span>
                                ملاحظات
                            </span>

                            <strong>
                                {customer.notes || "---"}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}