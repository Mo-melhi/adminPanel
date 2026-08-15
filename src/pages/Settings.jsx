import { useEffect, useState } from "react"
import {
    User,
    Bell,
    Settings as SettingsIcon,
    MessageCircle,
    Save,
    CheckCircle2,
} from "lucide-react"

import { usePageMeta } from "../components/layout/layoutMeta"
import { useAuth } from "../context/AuthContext"

import "./Settings.css"

const DEFAULT_SETTINGS = {
    name: "",
    email: "",
    flightReminders: true,
    whatsappNotifications: true,
    failedNotifications: true,
    currency: "USD",
    language: "ar",
    timezone: "Europe/Istanbul",
}

export default function Settings() {
    usePageMeta(
        "الإعدادات",
        ["الرئيسية", "الإعدادات"]
    )

    const { user } = useAuth()

    const [settings, setSettings] =
        useState(DEFAULT_SETTINGS)

    const [saved, setSaved] = useState(false)

    useEffect(() => {
        const stored =
            localStorage.getItem(
                "turbo-travel-settings"
            )

        let savedSettings = {}

        if (stored) {
            try {
                savedSettings = JSON.parse(stored)
            } catch {
                savedSettings = {}
            }
        }

        setSettings({
            ...DEFAULT_SETTINGS,
            ...savedSettings,
            name:
                savedSettings.name ||
                user?.name ||
                "",
            email:
                savedSettings.email ||
                user?.email ||
                "",
        })
    }, [user])

    function update(key, value) {
        setSettings((current) => ({
            ...current,
            [key]: value,
        }))

        setSaved(false)
    }

    function saveSettings() {
        localStorage.setItem(
            "turbo-travel-settings",
            JSON.stringify(settings)
        )

        setSaved(true)

        setTimeout(() => {
            setSaved(false)
        }, 3000)
    }

    return (
        <div
            className="settings-page"
            dir="rtl"
        >
            {/* Header */}

            <div className="settings-header">
                <div>
                    <h1>الإعدادات</h1>

                    <p>
                        إدارة إعدادات لوحة التحكم
                        وتفضيلات النظام.
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={saveSettings}
                >
                    <Save size={16} />
                    حفظ التغييرات
                </button>
            </div>

            {saved && (
                <div
                    className="settings-success"
                    role="status"
                >
                    <CheckCircle2 size={18} />
                    تم حفظ الإعدادات بنجاح
                </div>
            )}

            <div className="settings-layout">

                {/* Account */}

                <section className="settings-card card">
                    <div className="settings-card-header">
                        <div className="settings-section-icon">
                            <User size={19} />
                        </div>

                        <div>
                            <h2>الحساب</h2>
                            <p>
                                معلومات حساب مسؤول
                                النظام.
                            </p>
                        </div>
                    </div>

                    <div className="settings-form">

                        <div className="settings-field">
                            <label>
                                الاسم
                            </label>

                            <input
                                className="input"
                                value={
                                    settings.name
                                }
                                onChange={(e) =>
                                    update(
                                        "name",
                                        e.target
                                            .value
                                    )
                                }
                                placeholder="اسم المسؤول"
                            />
                        </div>

                        <div className="settings-field">
                            <label>
                                البريد الإلكتروني
                            </label>

                            <input
                                className="input"
                                type="email"
                                dir="ltr"
                                value={
                                    settings.email
                                }
                                onChange={(e) =>
                                    update(
                                        "email",
                                        e.target
                                            .value
                                    )
                                }
                                placeholder="admin@turbotravel.net"
                            />
                        </div>

                    </div>
                </section>

                {/* Notifications */}

                <section className="settings-card card">
                    <div className="settings-card-header">
                        <div className="settings-section-icon">
                            <Bell size={19} />
                        </div>

                        <div>
                            <h2>الإشعارات</h2>

                            <p>
                                اختر الإشعارات التي
                                تريد استقبالها.
                            </p>
                        </div>
                    </div>

                    <div className="settings-options">

                        <SettingToggle
                            title="تذكيرات الرحلات"
                            description="إرسال تذكيرات للعملاء قبل موعد الرحلة."
                            checked={
                                settings.flightReminders
                            }
                            onChange={(value) =>
                                update(
                                    "flightReminders",
                                    value
                                )
                            }
                        />

                        <SettingToggle
                            title="إشعارات واتساب"
                            description="تفعيل إرسال تحديثات الرحلات عبر واتساب."
                            checked={
                                settings.whatsappNotifications
                            }
                            onChange={(value) =>
                                update(
                                    "whatsappNotifications",
                                    value
                                )
                            }
                        />

                        <SettingToggle
                            title="تنبيهات فشل الإرسال"
                            description="إظهار تنبيه عند فشل إرسال تذكير."
                            checked={
                                settings.failedNotifications
                            }
                            onChange={(value) =>
                                update(
                                    "failedNotifications",
                                    value
                                )
                            }
                        />

                    </div>
                </section>

                {/* System */}

                <section className="settings-card card">
                    <div className="settings-card-header">
                        <div className="settings-section-icon">
                            <SettingsIcon size={19} />
                        </div>

                        <div>
                            <h2>النظام</h2>

                            <p>
                                إعدادات عامة للوحة
                                التحكم.
                            </p>
                        </div>
                    </div>

                    <div className="settings-form">

                        <div className="settings-field">
                            <label>
                                العملة الافتراضية
                            </label>

                            <select
                                className="input"
                                value={
                                    settings.currency
                                }
                                onChange={(e) =>
                                    update(
                                        "currency",
                                        e.target
                                            .value
                                    )
                                }
                            >
                                <option value="USD">
                                    USD — دولار أمريكي
                                </option>

                                <option value="EUR">
                                    EUR — يورو
                                </option>

                                <option value="TRY">
                                    TRY — ليرة تركية
                                </option>

                                <option value="SAR">
                                    SAR — ريال سعودي
                                </option>

                                <option value="AED">
                                    AED — درهم إماراتي
                                </option>
                            </select>
                        </div>

                        <div className="settings-field">
                            <label>
                                اللغة
                            </label>

                            <select
                                className="input"
                                value={
                                    settings.language
                                }
                                onChange={(e) =>
                                    update(
                                        "language",
                                        e.target
                                            .value
                                    )
                                }
                            >
                                <option value="ar">
                                    العربية
                                </option>

                                <option value="en">
                                    English
                                </option>
                            </select>
                        </div>

                        <div className="settings-field">
                            <label>
                                المنطقة الزمنية
                            </label>

                            <select
                                className="input"
                                value={
                                    settings.timezone
                                }
                                onChange={(e) =>
                                    update(
                                        "timezone",
                                        e.target
                                            .value
                                    )
                                }
                            >
                                <option value="Europe/Istanbul">
                                    إسطنبول — UTC+3
                                </option>

                                <option value="Asia/Riyadh">
                                    الرياض — UTC+3
                                </option>

                                <option value="Asia/Dubai">
                                    دبي — UTC+4
                                </option>

                                <option value="Africa/Cairo">
                                    القاهرة — UTC+3
                                </option>
                            </select>
                        </div>

                    </div>
                </section>

                {/* WhatsApp */}

                <section className="settings-card card">
                    <div className="settings-card-header">
                        <div className="settings-section-icon whatsapp">
                            <MessageCircle size={19} />
                        </div>

                        <div>
                            <h2>
                                واتساب
                            </h2>

                            <p>
                                حالة خدمة رسائل واتساب.
                            </p>
                        </div>
                    </div>

                    <div className="whatsapp-status">
                        <div className="whatsapp-status-icon">
                            <CheckCircle2
                                size={20}
                            />
                        </div>

                        <div className="whatsapp-status-info">
                            <strong>
                                الخدمة متصلة
                            </strong>

                            <span>
                                يمكن إرسال تذكيرات
                                الرحلات للعملاء.
                            </span>
                        </div>

                        <span className="connection-badge">
                            متصل
                        </span>
                    </div>

                    <div className="whatsapp-info">
                        <span>
                            رقم الخدمة
                        </span>

                        <strong dir="ltr">
                            WhatsApp Business
                        </strong>
                    </div>
                </section>

            </div>

            {/* Bottom save */}

            <div className="settings-bottom">
                <button
                    className="btn btn-primary"
                    onClick={saveSettings}
                >
                    <Save size={16} />
                    حفظ التغييرات
                </button>
            </div>
        </div>
    )
}


/* --------------------------------------------------
   Toggle
-------------------------------------------------- */

function SettingToggle({
    title,
    description,
    checked,
    onChange,
}) {
    return (
        <label className="setting-toggle">
            <div className="setting-toggle-text">
                <strong>
                    {title}
                </strong>

                <span>
                    {description}
                </span>
            </div>

            <input
                type="checkbox"
                checked={checked}
                onChange={(e) =>
                    onChange(
                        e.target.checked
                    )
                }
            />

            <span className="toggle-slider" />
        </label>
    )
}