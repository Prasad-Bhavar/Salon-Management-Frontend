import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft, Star, MapPin, Phone, Mail, Clock,
    Heart, Share2, ChevronRight, Images, Wifi,
    Wind, CreditCard, ShieldCheck, ParkingCircle,
} from "lucide-react";
import { useSalonDetail } from "./useSalonDetail";
import { useSalonFavourite } from "~/pages/FavouriteSalons/useFavouriteSalons";
import BookingDrawer from "./BookingDrawer";
import { BookingDraft } from "./salon-detail.types";
import { bookingApi } from "./Booking/booking.service";
// ── Helpers ────────────────────────────────────────────────────────────────────

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function fmtTime(t: string) {
    const [h, m] = t.replace(":00", "").split(":").map(Number);
    return `${h % 12 || 12}:${String(m ?? 0).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
    const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const colors = ["bg-purple-100 text-purple-600", "bg-blue-100 text-blue-600", "bg-green-100 text-green-600", "bg-orange-100 text-orange-600", "bg-rose-100 text-rose-600"];
    const color = colors[name.charCodeAt(0) % colors.length];
    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-sm ${color}`}
            style={{ width: size, height: size }}
        >
            {initials}
        </div>
    );
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    size={size}
                    fill={i <= Math.round(rating) ? "currentColor" : "none"}
                    className={i <= Math.round(rating) ? "text-amber-400" : "text-gray-200 dark:text-white/20"}
                />
            ))}
        </div>
    );
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
    Parking: <ParkingCircle size={18} />,
    AC: <Wind size={18} />,
    "Wi-Fi": <Wifi size={18} />,
    "Card Accepted": <CreditCard size={18} />,
    Sanitized: <ShieldCheck size={18} />,
};

const AMENITIES = ["Parking", "AC", "Wi-Fi", "Card Accepted", "Sanitized"];

// ── TAB navigation ─────────────────────────────────────────────────────────────

const TABS = ["Overview", "Services", "Stylists", "Reviews", "About"] as const;
type Tab = typeof TABS[number];

// ── Section: OVERVIEW ─────────────────────────────────────────────────────────

function OverviewTab({ salon }: { salon: NonNullable<ReturnType<typeof useSalonDetail>["salon"]> }) {
    const [expanded, setExpanded] = useState(false);
    const about = `${salon.name} is a ${salon.salon_type} salon located in ${salon.address.city}. We offer premium services with professional staff in a clean and welcoming environment.`;

    const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const todayAvail = salon.availability.find(a => a.day_of_week === todayName);

    return (
        <div className="space-y-8">
            {/* About */}
            <section>
                <h2 className="mb-2 text-base font-bold text-gray-800 dark:text-white/90">About This Salon</h2>
                <p className={`text-sm leading-relaxed text-gray-600 dark:text-gray-400 ${!expanded ? "line-clamp-3" : ""}`}>
                    {about}
                </p>
                <button onClick={() => setExpanded(e => !e)} className="mt-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600">
                    {expanded ? "Show Less" : "Read More"}
                </button>
            </section>

            {/* Info cards */}
            <section className="space-y-3">
                <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3.5 dark:border-white/[0.05] dark:bg-white/[0.02]">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-brand-500" />
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-500">Address</p>
                        <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                            {salon.address.line1}{salon.address.line2 ? `, ${salon.address.line2}` : ""},<br />
                            {salon.address.city} – {salon.address.pincode}
                        </p>
                    </div>
                </div>

                {todayAvail && !todayAvail.is_closed && (
                    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 dark:border-white/[0.05] dark:bg-white/[0.02]">
                        <Clock size={16} className="shrink-0 text-brand-500" />
                        <div>
                            <p className="text-xs font-semibold text-gray-500">Timings (Today)</p>
                            <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                                {fmtTime(todayAvail.start_time)} – {fmtTime(todayAvail.end_time)}
                            </p>
                        </div>
                        <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Open
                        </span>
                    </div>
                )}

                {salon.contact_number && (
                    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 dark:border-white/[0.05] dark:bg-white/[0.02]">
                        <Phone size={16} className="shrink-0 text-brand-500" />
                        <div>
                            <p className="text-xs font-semibold text-gray-500">Phone</p>
                            <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">+91 {salon.contact_number}</p>
                        </div>
                    </div>
                )}

                {salon.email && (
                    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 dark:border-white/[0.05] dark:bg-white/[0.02]">
                        <Mail size={16} className="shrink-0 text-brand-500" />
                        <div>
                            <p className="text-xs font-semibold text-gray-500">Email</p>
                            <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">{salon.email}</p>
                        </div>
                    </div>
                )}
            </section>

            {/* Amenities */}
            <section>
                <h2 className="mb-3 text-base font-bold text-gray-800 dark:text-white/90">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                    {AMENITIES.map(a => (
                        <div key={a} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-600 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-gray-400">
                            {AMENITY_ICONS[a]}
                            <span>{a}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

// ── Section: AVAILABILITY ─────────────────────────────────────────────────────

function AboutTab({ salon }: { salon: NonNullable<ReturnType<typeof useSalonDetail>["salon"]> }) {
    const sorted = [...salon.availability].sort(
        (a, b) => DAY_ORDER.indexOf(a.day_of_week) - DAY_ORDER.indexOf(b.day_of_week)
    );
    const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

    return (
        <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-800 dark:text-white/90">Weekly Schedule</h2>
            <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/[0.06]">
                {sorted.map((a, idx) => {
                    const isToday = a.day_of_week === todayName;
                    return (
                        <div
                            key={a.id}
                            className={[
                                "flex items-center justify-between px-5 py-3.5 text-sm",
                                idx < sorted.length - 1 ? "border-b border-gray-100 dark:border-white/[0.04]" : "",
                                isToday ? "bg-brand-50 dark:bg-brand-500/10" : "bg-white dark:bg-white/[0.02]",
                            ].join(" ")}
                        >
                            <span className={`font-medium ${isToday ? "text-brand-600 dark:text-brand-400" : "text-gray-700 dark:text-gray-300"}`}>
                                {a.day_of_week}
                                {isToday && <span className="ml-2 text-xs font-normal text-brand-400">(Today)</span>}
                            </span>
                            {a.is_closed ? (
                                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-500 dark:bg-red-500/10">Closed</span>
                            ) : (
                                <span className="text-gray-500 dark:text-gray-400">
                                    {fmtTime(a.start_time)} – {fmtTime(a.end_time)}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Section: REVIEWS ──────────────────────────────────────────────────────────

function ReviewsTab({ salon }: { salon: NonNullable<ReturnType<typeof useSalonDetail>["salon"]> }) {
    return (
        <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                <div className="text-center">
                    <p className="text-5xl font-bold text-gray-900 dark:text-white">{salon.rating.toFixed(1)}</p>
                    <StarRating rating={salon.rating} size={16} />
                    <p className="mt-1 text-xs text-gray-400">{salon.review_count} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map(r => {
                        const count = salon.reviews.filter(rev => rev.rating === r).length;
                        const pct = salon.reviews.length ? (count / salon.reviews.length) * 100 : 0;
                        return (
                            <div key={r} className="flex items-center gap-2">
                                <span className="w-3 text-right text-xs text-gray-400">{r}</span>
                                <Star size={10} fill="currentColor" className="text-amber-400 shrink-0" />
                                <div className="flex-1 rounded-full bg-gray-100 dark:bg-white/[0.06]" style={{ height: 6 }}>
                                    <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="w-4 text-xs text-gray-400">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Review list */}
            {salon.reviews.map(rev => (
                <div key={rev.id} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <Avatar name={rev.customer.name} size={36} />
                            <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{rev.customer.name}</p>
                                <p className="text-xs text-gray-400">
                                    {new Date(rev.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </p>
                            </div>
                        </div>
                        <StarRating rating={rev.rating} size={13} />
                    </div>
                    {rev.comment && (
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{rev.comment}</p>
                    )}
                    {rev.images?.length > 0 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto">
                            {rev.images.map(img => (
                                <img
                                    key={img.id}
                                    src={img.image_url}
                                    alt="review"
                                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

export default function SalonDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const salonId = Number(id);

    const { salon, loading, error } = useSalonDetail(salonId);
    const { isFavourite, toggle: toggleFav } = useSalonFavourite(salonId);

    const [activeTab, setActiveTab] = useState<Tab>("Overview");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [_lightboxIdx, setLightboxIdx] = useState<number | null>(null);

    // ── Booking submit ──────────────────────────────────────────
    const handleConfirmBooking = async (draft: BookingDraft) => {
        const paymentData: any = await bookingApi.create({
            salon_id: salonId,                      // from useParams + Number()
            date: draft.date,
            start_time: draft.time,
            service_ids: draft.items.map(i => i.id),   // salon_service ids
            notes: draft.notes,
        });

        // Close the drawer first
        setDrawerOpen(false);

        // Navigate to payment page with all data in state
        navigate("/payment", {
            state: {
                paymentData,               // contains client_secret, publishable_key, amount etc.
                draft,                     // contains date, time, items for order summary
                salonName: salon!.name,
            },
        });
    };

    // ── Loading ─────────────────────────────────────────────────
    if (loading) return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
    );

    if (error || !salon) return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-950">
            <p className="text-gray-500">{error ?? "Salon not found"}</p>
            <button onClick={() => navigate(-1)} className="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white">
                Go Back
            </button>
        </div>
    );

    const images = salon.images.length > 0
        ? salon.images
        : [{ id: 0, image_url: "https://placehold.co/800x400?text=No+Image" }];

    const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const todayAvail = salon.availability.find(a => a.day_of_week === todayName);
    const isOpen = todayAvail && !todayAvail.is_closed;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

            {/* ── TOP NAV ──────────────────────────────────────────── */}
            <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm dark:border-white/[0.06] dark:bg-gray-950/95">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleFav}
                        className={[
                            "flex h-9 w-9 items-center justify-center rounded-full border transition",
                            isFavourite
                                ? "border-red-200 bg-red-50 text-red-500 dark:border-red-500/30 dark:bg-red-500/10"
                                : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400 dark:border-white/[0.08]",
                        ].join(" ")}
                    >
                        <Heart size={16} fill={isFavourite ? "currentColor" : "none"} />
                    </button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:bg-gray-50 dark:border-white/[0.08] dark:hover:bg-white/[0.05]">
                        <Share2 size={16} />
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 py-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">

                    {/* ── LEFT COLUMN ────────────────────────────────── */}
                    <div className="space-y-6 min-w-0">

                        {/* Photo gallery */}
                        <div className="grid grid-cols-3 grid-rows-2 gap-2 h-64 sm:h-80 overflow-hidden rounded-2xl">
                            {/* Main large image */}
                            <div
                                className="col-span-2 row-span-2 cursor-pointer overflow-hidden rounded-l-2xl bg-gray-200"
                                onClick={() => setLightboxIdx(0)}
                            >
                                <img
                                    src={images[0].image_url}
                                    alt={salon.name}
                                    className="h-full w-full object-cover transition hover:scale-105"
                                />
                            </div>
                            {/* Thumbnails */}
                            {[1, 2].map(i => (
                                <div
                                    key={i}
                                    className={[
                                        "relative cursor-pointer overflow-hidden bg-gray-200",
                                        i === 1 ? "rounded-tr-2xl" : "rounded-br-2xl",
                                    ].join(" ")}
                                    onClick={() => setLightboxIdx(i)}
                                >
                                    {images[i] ? (
                                        <img src={images[i].image_url} alt="" className="h-full w-full object-cover transition hover:scale-105" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-white/[0.04]">
                                            <Images size={20} className="text-gray-300" />
                                        </div>
                                    )}
                                    {/* +N overlay on last thumb */}
                                    {i === 2 && images.length > 3 && (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-br-2xl bg-black/50">
                                            <span className="text-sm font-bold text-white">+{images.length - 3}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Salon header info */}
                        <div>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{salon.name}</h1>
                                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <StarRating rating={salon.rating} size={13} />
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">{salon.rating.toFixed(1)}</span>
                                            <span>({salon.review_count} reviews)</span>
                                        </span>
                                        <span className="flex items-center gap-1 capitalize">
                                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                            {salon.salon_type} Salon
                                        </span>
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={12} className="text-brand-400" />
                                            {salon.address.area ? `${salon.address.area}, ` : ""}{salon.address.city}, {salon.address.state}
                                        </span>
                                        {isOpen && (
                                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                Open · Closes {fmtTime(todayAvail!.end_time)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Amenity chips */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {AMENITIES.map(a => (
                                    <span key={a} className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-gray-400">
                                        {AMENITY_ICONS[a]}
                                        {a}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Tab nav */}
                        <div className="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-white/[0.06]">
                            {TABS.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={[
                                        "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                                        activeTab === tab
                                            ? "border-brand-500 text-brand-500"
                                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                                    ].join(" ")}
                                >
                                    {tab}
                                    {tab === "Reviews" && (
                                        <span className="ml-1.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-white/[0.06]">
                                            {salon.review_count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        <div>
                            {activeTab === "Overview" && <OverviewTab salon={salon} />}
                            {activeTab === "About" && <AboutTab salon={salon} />}
                            {activeTab === "Reviews" && <ReviewsTab salon={salon} />}
                            {(activeTab === "Services" || activeTab === "Stylists") && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <p className="text-sm text-gray-400">
                                        Click <strong>Book Now</strong> to browse services and book your appointment.
                                    </p>
                                    <button
                                        onClick={() => setDrawerOpen(true)}
                                        className="mt-4 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT SIDEBAR (sticky on lg) ───────────────── */}
                    <div className="lg:sticky lg:top-20 lg:self-start">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm text-gray-500">Starting from</span>
                                {isOpen ? (
                                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                                        Open Now
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-500">Closed</span>
                                )}
                            </div>

                            <button
                                onClick={() => setDrawerOpen(true)}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-600 active:scale-[0.98]"
                            >
                                Book Now
                                <ChevronRight size={16} />
                            </button>

                            <button
                                onClick={toggleFav}
                                className={[
                                    "mt-3 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition",
                                    isFavourite
                                        ? "border-red-200 bg-red-50 text-red-500 dark:border-red-500/30 dark:bg-red-500/10"
                                        : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-white/[0.08] dark:text-gray-400",
                                ].join(" ")}
                            >
                                <Heart size={15} fill={isFavourite ? "currentColor" : "none"} />
                                {isFavourite ? "Saved" : "Save Salon"}
                            </button>

                            {/* Quick info */}
                            <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 dark:border-white/[0.05]">
                                {salon.contact_number && (
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                        <Phone size={14} className="shrink-0 text-brand-400" />
                                        +91 {salon.contact_number}
                                    </div>
                                )}
                                {salon.email && (
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                        <Mail size={14} className="shrink-0 text-brand-400" />
                                        {salon.email}
                                    </div>
                                )}
                                {todayAvail && !todayAvail.is_closed && (
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                        <Clock size={14} className="shrink-0 text-brand-400" />
                                        {fmtTime(todayAvail.start_time)} – {fmtTime(todayAvail.end_time)}
                                    </div>
                                )}
                                <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <MapPin size={14} className="mt-0.5 shrink-0 text-brand-400" />
                                    {salon.address.line1}, {salon.address.city}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── BOOKING DRAWER ─────────────────────────────────────── */}
            <BookingDrawer
                salonId={salonId}
                salonName={salon.name}
                salonAvailability={salon.availability}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onConfirm={handleConfirmBooking}
            />
        </div>
    );
}