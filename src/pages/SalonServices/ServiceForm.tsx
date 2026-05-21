import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    Formik,
    Form,
} from "formik";

import {
    ArrowLeft,
    Info,
    Clock,
    DollarSign,
    Tag,
    Layers,
    FileText,
    ToggleLeft,
} from "lucide-react";

import {
    ownerServiceInitialValues,
    ownerServiceValidationSchema,
} from "./services.validation";

import {
    createOwnerService,
    getMasterServices,
    getOwnerServiceById,
    getServiceCategories,
    updateOwnerService,
} from "./services.service";

// ─── Reusable field wrapper ───────────────────────────────────────────────────

function FieldWrapper({
    label,
    icon,
    required,
    error,
    children,
    hint,
}: {
    label: string;
    icon?: React.ReactNode;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
    hint?: string;
}) {
    return (
        <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                {icon && (
                    <span className="text-gray-400 dark:text-gray-500">
                        {icon}
                    </span>
                )}
                {label}
                {required && (
                    <span className="text-error-500">*</span>
                )}
            </label>

            {children}

            {hint && !error && (
                <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                    {hint}
                </p>
            )}

            {error && (
                <p className="mt-1.5 text-xs text-error-500">
                    {error}
                </p>
            )}
        </div>
    );
}

// ─── Select ───────────────────────────────────────────────────────────────────

const selectClass =
    "h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";

// ─── Input ────────────────────────────────────────────────────────────────────

const inputClass =
    "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";

// ─── Textarea ─────────────────────────────────────────────────────────────────

const textareaClass =
    "w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ServiceForm() {

    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [initialValues, setInitialValues] = useState(ownerServiceInitialValues);

    const fetchCategories = async () => {
        const res = await getServiceCategories();
        setCategories(res || []);
    };

    const fetchServices = async (categoryId: number) => {
        const res = await getMasterServices(categoryId);
        setServices(res || []);
    };

    const fetchDetail = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await getOwnerServiceById(id);
            setInitialValues({
                salon_id: 1,
                category_id: res.service?.category?.id,
                service_id: res.service?.id,
                price: res.price,
                duration: res.duration,
                description: res.description || "",
                status: res.status,
            });
            setSelectedService(res.service);
            if (res.service?.category?.id) {
                fetchServices(res.service?.category?.id);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        if (id) fetchDetail();
    }, []);

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            if (isEdit && id) {
                await updateOwnerService(id, values);
            } else {
                await createOwnerService(values);
            }
            navigate("/salon-services");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-6">

            {/* ── Page Header ── */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/salon-services")}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-theme-xs transition hover:bg-gray-50 hover:text-gray-700 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-400 dark:hover:bg-white/[0.06]"
                >
                    <ArrowLeft size={18} />
                </button>

                <div>
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        {isEdit ? "Edit Service" : "Add Service"}
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        {isEdit
                            ? "Update your service details and pricing."
                            : "Select a service from the global list and set your pricing."}
                    </p>
                </div>
            </div>

            {/* ── Form Card ── */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

                <div className="border-b border-gray-100 px-6 py-4 dark:border-white/[0.05]">
                    <h2 className="text-sm font-medium text-gray-700 dark:text-white/80">
                        Service Information
                    </h2>
                </div>

                <div className="p-6">
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={ownerServiceValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, setFieldValue }) => (
                            <Form className="space-y-6">

                                {/* ── Category & Service ── */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                    <FieldWrapper
                                        label="Category"
                                        icon={<Layers size={14} />}
                                        required
                                        error={
                                            touched.category_id && errors.category_id
                                                ? String(errors.category_id)
                                                : undefined
                                        }
                                    >
                                        <select
                                            value={values.category_id}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                setFieldValue("category_id", value);
                                                setFieldValue("service_id", "");
                                                setSelectedService(null);
                                                fetchServices(value);
                                            }}
                                            className={selectClass}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </FieldWrapper>

                                    <FieldWrapper
                                        label="Service"
                                        icon={<Tag size={14} />}
                                        required
                                        error={
                                            touched.service_id && errors.service_id
                                                ? String(errors.service_id)
                                                : undefined
                                        }
                                    >
                                        <select
                                            value={values.service_id}
                                            disabled={!values.category_id}
                                            onChange={(e) => {
                                                const service = services.find(
                                                    (item) => item.id === Number(e.target.value)
                                                );
                                                if (!service) return;
                                                setSelectedService(service);
                                                setFieldValue("service_id", service.id);
                                                setFieldValue("price", service.default_price);
                                                setFieldValue("duration", service.default_duration);
                                            }}
                                            className={`${selectClass} disabled:cursor-not-allowed disabled:opacity-50`}
                                        >
                                            <option value="">Select Service</option>
                                            {services.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </FieldWrapper>
                                </div>

                                {/* ── Selected Service Info Banner ── */}
                                {selectedService && (
                                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                                <Info size={15} />
                                            </span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                    Default values loaded — you can override below
                                                </p>
                                                <div className="mt-3 flex gap-6">
                                                    <div>
                                                        <p className="text-xs text-blue-500 dark:text-blue-400">
                                                            Default Price
                                                        </p>
                                                        <p className="mt-0.5 text-sm font-semibold text-blue-800 dark:text-blue-200">
                                                            ₹{selectedService.default_price}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-blue-500 dark:text-blue-400">
                                                            Default Duration
                                                        </p>
                                                        <p className="mt-0.5 text-sm font-semibold text-blue-800 dark:text-blue-200">
                                                            {selectedService.default_duration} mins
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── Price & Duration ── */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                    <FieldWrapper
                                        label="Price"
                                        icon={<DollarSign size={14} />}
                                        required
                                        hint="Set your custom price in ₹"
                                        error={
                                            touched.price && errors.price
                                                ? String(errors.price)
                                                : undefined
                                        }
                                    >
                                        <div className="relative">
                                            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                                ₹
                                            </span>
                                            <input
                                                type="number"
                                                min={0}
                                                value={values.price}
                                                onChange={(e) =>
                                                    setFieldValue("price", e.target.value)
                                                }
                                                className={`${inputClass} pl-8`}
                                                placeholder="0"
                                            />
                                        </div>
                                    </FieldWrapper>

                                    <FieldWrapper
                                        label="Duration"
                                        icon={<Clock size={14} />}
                                        required
                                        hint="Duration in minutes"
                                        error={
                                            touched.duration && errors.duration
                                                ? String(errors.duration)
                                                : undefined
                                        }
                                    >
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min={1}
                                                value={values.duration}
                                                onChange={(e) =>
                                                    setFieldValue("duration", e.target.value)
                                                }
                                                className={`${inputClass} pr-14`}
                                                placeholder="30"
                                            />
                                            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                                mins
                                            </span>
                                        </div>
                                    </FieldWrapper>
                                </div>

                                {/* ── Description ── */}
                                <FieldWrapper
                                    label="Description"
                                    icon={<FileText size={14} />}
                                    error={
                                        touched.description && errors.description
                                            ? String(errors.description)
                                            : undefined
                                    }
                                >
                                    <textarea
                                        rows={4}
                                        value={values.description}
                                        onChange={(e) =>
                                            setFieldValue("description", e.target.value)
                                        }
                                        maxLength={500}
                                        placeholder="Optional notes about this service..."
                                        className={textareaClass}
                                    />
                                    <div className="mt-1.5 flex justify-end">
                                        <span className="text-xs text-gray-400">
                                            {values.description?.length ?? 0}
                                            <span className="text-gray-300">/500</span>
                                        </span>
                                    </div>
                                </FieldWrapper>

                                {/* ── Status Toggle ── */}
                                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 dark:border-white/[0.05]">
                                    <div className="flex items-center gap-2.5">
                                        <ToggleLeft size={16} className="text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Active
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                This service will be visible to customers
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={values.status}
                                        onClick={() =>
                                            setFieldValue("status", !values.status)
                                        }
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${values.status
                                            ? "bg-brand-500"
                                            : "bg-gray-200 dark:bg-gray-700"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${values.status ? "translate-x-6" : "translate-x-1"
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* ── Footer Actions ── */}
                                <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5 dark:border-white/[0.05]">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/salon-services")}
                                        className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading
                                            ? "Saving..."
                                            : isEdit
                                                ? "Update Service"
                                                : "Save Service"}
                                    </button>
                                </div>

                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}