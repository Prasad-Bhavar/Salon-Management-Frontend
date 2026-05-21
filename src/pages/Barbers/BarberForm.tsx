import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { createBarber, getBarberById, getServices, updateBarber } from "./barbers.service";
import { useServices } from "~/hooks/useServices";

// ── Style tokens ──────────────────────────────────────────────────────────────
const inputClass =
    "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30";

const selectClass =
    "h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";

const labelClass =
    "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div>
            <label className={labelClass}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}

// ── Default form ──────────────────────────────────────────────────────────────
const defaultForm = {
    name: "", email: "", contact1: "", gender: "",
    status: "active", specialization: "", services: [] as number[],
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BarberForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<any[]>([]);
    const [form, setForm] = useState(defaultForm);
    const [serviceSearch, setServiceSearch] = useState("");
    const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

    const { services: ownerServices } = useServices();
    console.log("services", ownerServices);

    // Load services list
    useEffect(() => {
        (async () => {
            const res = await getServices();
            console.log("barber services", res);
            setServices(res);
        })();
    }, []);

    // Load edit data
    useEffect(() => {
        if (!id) return;
        (async () => {
            setLoading(true);
            try {
                const res = await getBarberById(id);
                const b = res;
                setForm({
                    name: b.user?.name ?? "",
                    email: b.user?.email ?? "",
                    contact1: b.user?.contact1 ?? "",
                    gender: b.user?.gender ?? "",
                    status: b.status ?? "active",
                    specialization: b.specialization ?? "",
                    services: b.barber_services?.map((s: any) => s.service.id) ?? [],
                });
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleChange = (e: any) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const toggleService = (serviceId: number) => {
        setForm((prev) => ({
            ...prev,
            services: prev.services.includes(serviceId)
                ? prev.services.filter((s) => s !== serviceId)
                : [...prev.services, serviceId],
        }));
    };

    const removeService = (serviceId: number) => {
        setForm((prev) => ({
            ...prev,
            services: prev.services.filter((s) => s !== serviceId),
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await updateBarber(id!, form as any);
            } else {
                await createBarber(form as any);
            }
            navigate("/barbers");
        } finally {
            setLoading(false);
        }
    };

    const selectedServices = services.filter((s) => form.services.includes(s.id));
    const filteredServices = services.filter(
        (s) =>
            !form.services.includes(s.id) &&
            s.name.toLowerCase().includes(serviceSearch.toLowerCase())
    );

    return (
        <div className="mx-auto max-w-2xl space-y-6">

            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/barbers")}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-theme-xs transition hover:bg-gray-50 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-400"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        {isEdit ? "Edit Barber" : "Add Barber"}
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        Add new barber/staff member details
                    </p>
                </div>
            </div>

            {/* Form card */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

                <div className="border-b border-gray-100 px-6 py-4 dark:border-white/[0.05]">
                    <h2 className="text-sm font-medium text-gray-700 dark:text-white/80">
                        Barber Information
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-400">Add barber/staff member details</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-6">

                    {/* Name */}
                    <Field label="Name of Barber" required>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            className={inputClass}
                        />
                    </Field>

                    {/* Email + Contact */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Field label="Email" required>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Contact Number" required>
                            <input
                                type="text"
                                name="contact1"
                                value={form.contact1}
                                onChange={handleChange}
                                placeholder="Enter contact number"
                                className={inputClass}
                            />
                        </Field>
                    </div>

                    {/* Role + Gender + Status */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <Field label="Role" required>
                            <select className={selectClass} disabled>
                                <option>Barber</option>
                            </select>
                        </Field>
                        <Field label="Gender" required>
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className={selectClass}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </Field>
                        <Field label="Status" required>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className={selectClass}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="on_leave">On Leave</option>
                            </select>
                        </Field>
                    </div>

                    {/* Services multi-select */}
                    <Field label="Services" required>
                        <div className="relative">
                            {/* Selected chips + dropdown trigger */}
                            <div
                                onClick={() => setServiceDropdownOpen((v) => !v)}
                                className="min-h-11 w-full cursor-pointer rounded-lg border border-gray-300 bg-transparent px-3 py-2 shadow-theme-xs focus-within:border-brand-300 dark:border-gray-700 dark:bg-gray-900"
                            >
                                <div className="flex flex-wrap items-center gap-1.5">
                                    {selectedServices.map((s) => (
                                        <span
                                            key={s.id}
                                            className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-400"
                                        >
                                            {s.name}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeService(s.id);
                                                }}
                                                className="ml-0.5 text-brand-400 hover:text-brand-600"
                                            >
                                                <X size={11} />
                                            </button>
                                        </span>
                                    ))}
                                    {selectedServices.length === 0 && (
                                        <span className="text-sm text-gray-400">Select services...</span>
                                    )}
                                </div>
                            </div>

                            {/* Dropdown */}
                            {serviceDropdownOpen && (
                                <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-white/[0.05] dark:bg-gray-900">
                                    <div className="border-b border-gray-100 p-2 dark:border-white/[0.05]">
                                        <input
                                            type="text"
                                            value={serviceSearch}
                                            onChange={(e) => setServiceSearch(e.target.value)}
                                            placeholder="Search services..."
                                            className="h-8 w-full rounded-lg border border-gray-200 bg-transparent px-3 text-sm placeholder:text-gray-400 focus:outline-none dark:border-gray-700 dark:text-white/90"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className="max-h-48 overflow-y-auto py-1">
                                        {filteredServices.length === 0 ? (
                                            <p className="px-4 py-3 text-sm text-gray-400">No services found</p>
                                        ) : (
                                            filteredServices.map((s) => (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    onClick={() => {
                                                        toggleService(s.id);
                                                    }}
                                                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                                                >
                                                    {s.name}
                                                    {s.category?.name && (
                                                        <span className="ml-auto text-xs text-gray-400">{s.category.name}</span>
                                                    )}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Field>

                    {/* Specialization */}
                    <Field label="Specialization / Description" required>
                        <textarea
                            rows={4}
                            name="specialization"
                            value={form.specialization}
                            onChange={handleChange}
                            placeholder="Enter specialization and description..."
                            maxLength={500}
                            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                        />
                        <div className="mt-1 flex justify-end">
                            <span className="text-xs text-gray-400">
                                {form.specialization.length}
                                <span className="text-gray-300">/500</span>
                            </span>
                        </div>
                    </Field>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5 dark:border-white/[0.05]">
                        <button
                            type="button"
                            onClick={() => navigate("/barbers")}
                            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Saving..." : isEdit ? "Update Barber" : "Save Barber"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}