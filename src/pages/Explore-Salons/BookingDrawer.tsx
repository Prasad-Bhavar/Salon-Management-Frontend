import { useState, useMemo } from "react";
import {
    X, ChevronLeft, ChevronRight, Check,
    CalendarDays, Scissors, Clock3, BadgeCheck,
    StickyNote, ArrowRight,
} from "lucide-react";
import { useAvailableDates, useSalonServices } from "./useSalonDetail";
import { CartItem, BookingDraft } from "./salon-detail.types";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isoDate(d: Date) {
    return d.toISOString().slice(0, 10);
}

function getMonthMeta(year: number, month: number) {
    return {
        firstDay: new Date(year, month, 1).getDay(),
        daysInMonth: new Date(year, month + 1, 0).getDate(),
    };
}

function fmt12(t: string) {
    const [h, m] = t.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function fmtDateLong(s: string) {
    if (!s) return "";
    return new Date(s + "T00:00:00").toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
}

function genTimeSlots(start: string, end: string, stepMins = 30): string[] {
    const slots: string[] = [];
    const toMins = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
    };
    let cur = toMins(start);
    const endMin = toMins(end);
    while (cur + stepMins <= endMin) {
        const h = Math.floor(cur / 60), m = cur % 60;
        slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
        cur += stepMins;
    }
    return slots;
}

// ─────────────────────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────────────────────

const STEPS = [
    { key: "date", label: "Date", Icon: CalendarDays },
    { key: "services", label: "Services", Icon: Scissors },
    { key: "time", label: "Time", Icon: Clock3 },
    { key: "confirm", label: "Confirm", Icon: BadgeCheck },
];

function StepBar({ current }: { current: number }) {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
            {STEPS.map((step, idx) => {
                const { Icon } = step;
                const done = idx < current;
                const active = idx === current;
                return (
                    <div key={step.key} className="flex flex-1 flex-col items-center gap-1.5 relative">
                        {/* connector */}
                        {idx < STEPS.length - 1 && (
                            <div className={[
                                "absolute top-4 left-[55%] right-0 h-px -translate-y-1/2",
                                done ? "bg-brand-500" : "bg-gray-200 dark:bg-white/[0.08]",
                            ].join(" ")} />
                        )}
                        <div className={[
                            "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300",
                            done ? "border-brand-500 bg-brand-500 text-white" :
                                active ? "border-brand-500 bg-white text-brand-500 dark:bg-gray-950" :
                                    "border-gray-200 bg-white text-gray-400 dark:border-white/[0.1] dark:bg-gray-950",
                        ].join(" ")}>
                            {done
                                ? <Check size={14} strokeWidth={2.5} />
                                : <Icon size={14} />
                            }
                        </div>
                        <span className={[
                            "text-[11px] font-medium",
                            active ? "text-brand-500" :
                                done ? "text-brand-400" :
                                    "text-gray-400 dark:text-gray-600",
                        ].join(" ")}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// STEP 1 — DATE
// ─────────────────────────────────────────────────────────────

function DateStep({
    salonId,
    selected,
    onSelect,
}: {
    salonId: number;
    selected: string;
    onSelect: (d: string) => void;
}) {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const { data: datesData, loading } = useAvailableDates(salonId);

    const availableSet = useMemo(
        () => new Set(datesData?.available_dates ?? []),
        [datesData]
    );
    const closedSet = useMemo(
        () => new Set(datesData?.closed_dates ?? []),
        [datesData]
    );

    const { firstDay, daysInMonth } = getMonthMeta(viewYear, viewMonth);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    };

    return (
        <div className="space-y-5">
            <div>
                <h3 className="text-[15px] font-semibold text-gray-800 dark:text-white/90">Select Date</h3>
                <p className="mt-0.5 text-xs text-gray-400">Only available dates can be selected</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                </div>
            ) : (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    {/* Nav */}
                    <div className="mb-4 flex items-center justify-between">
                        <button
                            onClick={prevMonth}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
                            {MONTH_NAMES[viewMonth]} {viewYear}
                        </span>
                        <button
                            onClick={nextMonth}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>

                    {/* Day labels */}
                    <div className="mb-2 grid grid-cols-7 text-center">
                        {DAY_LABELS.map(d => (
                            <span key={d} className="text-[11px] font-medium text-gray-400 dark:text-gray-600">{d}</span>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-y-1 text-center">
                        {Array.from({ length: firstDay }).map((_, i) => <span key={`blank-${i}`} />)}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                            const iso = isoDate(new Date(viewYear, viewMonth, day));
                            const isPast = new Date(iso) < new Date(isoDate(today));
                            const isAvail = availableSet.has(iso);
                            const isClosed = closedSet.has(iso);
                            const isSel = selected === iso;
                            const isToday = iso === isoDate(today);
                            const disabled = isPast || isClosed || (!isAvail && !isToday);

                            return (
                                <button
                                    key={day}
                                    disabled={disabled}
                                    onClick={() => onSelect(iso)}
                                    title={isClosed ? "Closed" : !isAvail ? "Unavailable" : undefined}
                                    className={[
                                        "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all",
                                        isSel ? "bg-brand-500 text-white shadow-sm scale-110" :
                                            isToday && isAvail ? "ring-2 ring-brand-400 text-brand-600 dark:text-brand-400" :
                                                isAvail ? "text-gray-700 hover:bg-brand-50 hover:text-brand-600 dark:text-white/80 dark:hover:bg-brand-500/10" :
                                                    isClosed ? "cursor-not-allowed text-gray-300 line-through dark:text-white/20" :
                                                        "cursor-not-allowed text-gray-200 dark:text-white/15",
                                    ].join(" ")}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Selected date pill */}
            {selected ? (
                <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 dark:border-brand-500/20 dark:bg-brand-500/10">
                    <CalendarDays size={15} className="shrink-0 text-brand-500" />
                    <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
                        {fmtDateLong(selected)}
                    </span>
                </div>
            ) : (
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <CalendarDays size={15} className="shrink-0 text-gray-300" />
                    <span className="text-sm text-gray-400">Please select an available date</span>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// STEP 2 — SERVICES
// ─────────────────────────────────────────────────────────────

function ServicesStep({
    salonId,
    cart,
    onToggle,
    onClearAll,
}: {
    salonId: number;
    cart: CartItem[];
    onToggle: (item: CartItem) => void;
    onClearAll: () => void;
}) {
    const { categories, loading } = useSalonServices(salonId);

    const isInCart = (id: number) => cart.some(c => c.id === id);
    const totalPrice = cart.reduce((s, c) => s + c.price, 0);
    const totalDuration = cart.reduce((s, c) => s + c.duration, 0);

    if (loading) return (
        <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
    );

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h3 className="text-[15px] font-semibold text-gray-800 dark:text-white/90">Select Services</h3>
                <p className="mt-0.5 text-xs text-gray-400">Choose one or more services</p>
            </div>

            {/* Service list */}
            <div className="flex-1 space-y-5 overflow-y-auto max-h-[44vh] pr-1">
                {categories.map(cat => (
                    <div key={cat.category}>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
                            {cat.category}
                        </p>
                        <div className="space-y-2">
                            {cat.services.map(svc => {
                                const sel = isInCart(svc.id);
                                return (
                                    <div
                                        key={svc.id}
                                        onClick={() => onToggle({
                                            id: svc.id,
                                            name: svc.name,
                                            price: svc.price,
                                            duration: svc.duration,
                                            category: cat.category,
                                        })}
                                        className={[
                                            "flex cursor-pointer items-start justify-between rounded-xl border px-4 py-3.5 transition-all duration-200",
                                            sel
                                                ? "border-brand-400 bg-brand-50 dark:border-brand-500/40 dark:bg-brand-500/10"
                                                : "border-gray-200 bg-white hover:border-gray-300 dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-white/[0.1]",
                                        ].join(" ")}
                                    >
                                        {/* Checkbox + info */}
                                        <div className="flex items-start gap-3">
                                            <div className={[
                                                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                                                sel ? "border-brand-500 bg-brand-500" : "border-gray-300 dark:border-gray-600",
                                            ].join(" ")}>
                                                {sel && <Check size={11} className="text-white" strokeWidth={3} />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium leading-tight ${sel ? "text-brand-700 dark:text-brand-300" : "text-gray-800 dark:text-white/90"}`}>
                                                    {svc.name}
                                                </p>
                                                {svc.description && (
                                                    <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">{svc.description}</p>
                                                )}
                                                <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                                                    <Clock3 size={11} className="shrink-0" />
                                                    {svc.duration} mins
                                                </p>
                                            </div>
                                        </div>
                                        {/* Price */}
                                        <span className={`text-sm font-bold shrink-0 ml-2 ${sel ? "text-brand-600 dark:text-brand-400" : "text-gray-700 dark:text-gray-300"}`}>
                                            ₹{svc.price}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart summary */}
            {cart.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/[0.06] dark:bg-white/[0.03] space-y-2.5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Selected ({cart.length})
                        </span>
                        <button
                            onClick={onClearAll}
                            className="text-xs font-medium text-red-500 hover:text-red-600 transition"
                        >
                            Clear All
                        </button>
                    </div>

                    {/* Items */}
                    {cart.map(c => (
                        <div key={c.id} className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                            <span className="truncate flex-1">{c.name}</span>
                            <span className="ml-4 shrink-0 text-gray-400">{c.duration} mins</span>
                            <span className="ml-4 shrink-0 font-semibold text-gray-800 dark:text-white/80">₹{c.price}</span>
                        </div>
                    ))}

                    {/* Totals */}
                    <div className="border-t border-gray-100 pt-2 dark:border-white/[0.05] flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                            <span>Total Duration: </span>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{totalDuration} mins</span>
                        </div>
                        <div className="text-sm font-bold text-brand-600 dark:text-brand-400">
                            ₹{totalPrice}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


function TimeStepInner({
    date,
    availability,
    selected,
    onSelect,
}: {
    date: string;
    availability: { day_of_week: string; start_time: string; end_time: string; is_closed: boolean }[];
    selected: string;
    onSelect: (t: string) => void;
}) {
    const dayName = new Date(date + "T00:00:00")
        .toLocaleDateString("en-US", { weekday: "long" });

    const dayAvail = availability.find(
        a => a.day_of_week.toLowerCase() === dayName.toLowerCase() && !a.is_closed
    );

    const slots = useMemo(() => {
        if (!dayAvail) return [];
        return genTimeSlots(dayAvail.start_time, dayAvail.end_time, 30);
    }, [dayAvail]);

    const now = new Date();
    const todayISO = isoDate(now);
    const nowMins = now.getHours() * 60 + now.getMinutes();

    const isPast = (slot: string) => {
        if (date !== todayISO) return false;
        const [h, m] = slot.split(":").map(Number);
        return h * 60 + m <= nowMins + 30;
    };

    if (!dayAvail) return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <Clock3 size={36} className="mb-3 text-gray-200 dark:text-white/10" />
            <p className="text-sm font-medium text-gray-400">Salon is closed on this day</p>
        </div>
    );

    const morning = slots.filter(s => { const h = parseInt(s); return h < 12; });
    const afternoon = slots.filter(s => { const h = parseInt(s); return h >= 12 && h < 17; });
    const evening = slots.filter(s => { const h = parseInt(s); return h >= 17; });

    const SlotGroup = ({ label, slotList }: { label: string; slotList: string[] }) => {
        if (!slotList.length) return null;
        return (
            <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">{label}</p>
                <div className="grid grid-cols-3 gap-2">
                    {slotList.map(slot => {
                        const past = isPast(slot);
                        const sel = selected === slot;
                        return (
                            <button
                                key={slot}
                                disabled={past}
                                onClick={() => onSelect(slot)}
                                className={[
                                    "rounded-xl border py-2.5 text-xs font-semibold transition-all duration-200",
                                    sel ? "border-brand-500 bg-brand-500 text-white shadow-sm scale-105" :
                                        past ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-white/15" :
                                            "border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-white/80 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10",
                                ].join(" ")}
                            >
                                {fmt12(slot)}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-5">
            <div>
                <h3 className="text-[15px] font-semibold text-gray-800 dark:text-white/90">Select Time</h3>
                <p className="mt-0.5 text-xs text-gray-400">
                    Open {fmt12(dayAvail.start_time)} – {fmt12(dayAvail.end_time)}
                </p>
            </div>

            <div className="space-y-4 max-h-[52vh] overflow-y-auto pr-1">
                <SlotGroup label="Morning" slotList={morning} />
                <SlotGroup label="Afternoon" slotList={afternoon} />
                <SlotGroup label="Evening" slotList={evening} />
            </div>

            {selected && (
                <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 dark:border-brand-500/20 dark:bg-brand-500/10">
                    <Clock3 size={15} className="shrink-0 text-brand-500" />
                    <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
                        {fmt12(selected)} on {fmtDateLong(date)}
                    </span>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// STEP 4 — CONFIRM
// ─────────────────────────────────────────────────────────────

function ConfirmStep({
    draft,
    salonName,
    notes,
    onNotesChange,
}: {
    draft: BookingDraft;
    salonName: string;
    notes: string;
    onNotesChange: (n: string) => void;
}) {
    const totalPrice = draft.items.reduce((s, i) => s + i.price, 0);
    const totalDuration = draft.items.reduce((s, i) => s + i.duration, 0);

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-[15px] font-semibold text-gray-800 dark:text-white/90">Confirm Booking</h3>
                <p className="mt-0.5 text-xs text-gray-400">Review your appointment details</p>
            </div>

            {/* Salon */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1">Salon</p>
                <p className="font-semibold text-gray-900 dark:text-white">{salonName}</p>
            </div>

            {/* Date + Time row */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="flex items-center gap-2 mb-2">
                        <CalendarDays size={13} className="text-brand-500" />
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Date</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {new Date(draft.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                        {new Date(draft.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long" })}
                    </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock3 size={13} className="text-brand-500" />
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Time</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{fmt12(draft.time)}</p>
                    <p className="text-xs text-gray-400">{totalDuration} mins total</p>
                </div>
            </div>

            {/* Services breakdown */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-3">
                    <Scissors size={13} className="text-brand-500" />
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Services</p>
                </div>
                <div className="space-y-2.5">
                    {draft.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-white/80">{item.name}</p>
                                <p className="text-xs text-gray-400">{item.duration} mins</p>
                            </div>
                            <span className="text-sm font-semibold text-gray-800 dark:text-white/90">₹{item.price}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/[0.05]">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Amount</span>
                    <span className="text-base font-bold text-brand-600 dark:text-brand-400">₹{totalPrice}</span>
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                    <StickyNote size={13} />
                    Notes (optional)
                </label>
                <textarea
                    value={notes}
                    onChange={e => onNotesChange(e.target.value)}
                    rows={3}
                    placeholder="Any special requests or preferences..."
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// MAIN DRAWER
// ─────────────────────────────────────────────────────────────

interface BookingDrawerProps {
    salonId: number;
    salonName: string;
    salonAvailability: { day_of_week: string; start_time: string; end_time: string; is_closed: boolean }[];
    open: boolean;
    onClose: () => void;
    onConfirm: (draft: BookingDraft) => Promise<void>;
}

export default function BookingDrawer({
    salonId,
    salonName,
    salonAvailability,
    open,
    onClose,
    onConfirm,
}: BookingDrawerProps) {
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [date, setDate] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");

    const reset = () => { setStep(0); setDate(""); setCart([]); setTime(""); setNotes(""); };
    const handleClose = () => { reset(); onClose(); };

    const toggleCartItem = (item: CartItem) => {
        setCart(prev =>
            prev.some(c => c.id === item.id)
                ? prev.filter(c => c.id !== item.id)
                : [...prev, item]
        );
    };

    const canNext = [
        !!date,
        cart.length > 0,
        !!time,
        true,
    ][step];

    const nextLabel = [
        "Next: Select Services",
        "Next: Select Time",
        "Next: Review",
        "Confirm Booking",
    ][step];

    const handleNext = async () => {
        if (step < 3) { setStep(s => s + 1); return; }
        try {
            setSubmitting(true);
            await onConfirm({ date, time, items: cart, notes });
            reset();
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    const draft: BookingDraft = { date, time, items: cart, notes };

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
                onClick={handleClose}
            />

            {/* Drawer panel */}
            <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-gray-50 shadow-2xl dark:bg-gray-950">

                {/* ── Header ── */}
                <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 py-4 dark:border-white/[0.06] dark:bg-gray-900">
                    <div className="flex items-center gap-3">
                        {step > 0 && (
                            <button
                                onClick={() => setStep(s => s - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                            >
                                <ChevronLeft size={15} />
                            </button>
                        )}
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Book Appointment</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:bg-gray-100 dark:border-white/[0.08] dark:hover:bg-white/[0.05]"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* ── Step bar ── */}
                <div className="shrink-0 bg-white dark:bg-gray-900">
                    <StepBar current={step} />
                </div>

                {/* ── Content ── */}
                <div className="flex-1 overflow-y-auto px-5 py-5">
                    {step === 0 && (
                        <DateStep
                            salonId={salonId}
                            selected={date}
                            onSelect={(d) => { setDate(d); setTime(""); }}
                        />
                    )}
                    {step === 1 && (
                        <ServicesStep
                            salonId={salonId}
                            cart={cart}
                            onToggle={toggleCartItem}
                            onClearAll={() => setCart([])}
                        />
                    )}
                    {step === 2 && (
                        <TimeStepInner
                            date={date}
                            availability={salonAvailability}
                            selected={time}
                            onSelect={setTime}
                        />
                    )}
                    {step === 3 && (
                        <ConfirmStep
                            draft={draft}
                            salonName={salonName}
                            notes={notes}
                            onNotesChange={setNotes}
                        />
                    )}
                </div>

                {/* ── Footer CTA ── */}
                <div className="shrink-0 border-t border-gray-200 bg-white px-5 py-4 dark:border-white/[0.06] dark:bg-gray-900">
                    <button
                        disabled={!canNext || submitting}
                        onClick={handleNext}
                        className={[
                            "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200",
                            canNext && !submitting
                                ? "bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.98]"
                                : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-white/[0.06] dark:text-white/30",
                        ].join(" ")}
                    >
                        {submitting ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <>
                                {nextLabel}
                                <ArrowRight size={15} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}