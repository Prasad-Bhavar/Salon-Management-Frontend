import {
    useEffect,
    useState,
} from "react";

import {
    Formik,
    Form,
    ErrorMessage,
} from "formik";

import {
    Percent,
    Clock3,
    Info,
    Lightbulb,
} from "lucide-react";

import {
    getSettings,
    updateSettings,
} from "./settings.service";

import {
    settingsInitialValues,
    settingsValidationSchema,
} from "./settings.validation";

export default function SettingsPage() {

    //
    // STATES
    //

    const [
        initialValues,
        setInitialValues,
    ] = useState(
        settingsInitialValues
    );

    const [
        loading,
        setLoading,
    ] = useState(false);

    //
    // FETCH SETTINGS
    //

    const fetchSettings =
        async () => {

            try {

                setLoading(true);

                const res =
                    await getSettings();

                setInitialValues({

                    platform_commission:
                        Number(
                            res.platform_commission
                        ),

                    slot_duration:
                        Number(
                            res.slot_duration
                        ),
                });

            } catch (error) {

                console.error(
                    error
                );

            } finally {

                setLoading(false);
            }
        };

    useEffect(() => {

        fetchSettings();

    }, []);

    //
    // SUBMIT
    //

    const handleSubmit =
        async (
            values: any
        ) => {

            try {

                setLoading(true);

                await updateSettings(
                    values
                );

            } catch (error) {

                console.error(
                    error
                );

            } finally {

                setLoading(false);
            }
        };

    return (

        <div className="space-y-6">

            {/*
                HEADER
            */}

            <div>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">

                    Settings
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">

                    Manage platform level settings
                </p>
            </div>

            <Formik

                enableReinitialize

                initialValues={
                    initialValues
                }

                validationSchema={
                    settingsValidationSchema
                }

                onSubmit={
                    handleSubmit
                }
            >

                {({
                    values,
                    handleChange,
                    handleBlur,
                    touched,
                    errors,
                    isSubmitting,
                }) => (

                    <Form className="space-y-6">

                        {/*
                            PLATFORM COMMISSION
                        */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">

                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                                <div className="flex-1">

                                    <div className="mb-6 flex items-start gap-4">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10">

                                            <Percent
                                                size={22}
                                                className="text-brand-500"
                                            />
                                        </div>

                                        <div>

                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">

                                                Platform Commission
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">

                                                Set the platform commission percentage charged on each booking.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="max-w-md">

                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">

                                            Commission Percentage (%)
                                        </label>

                                        <div className="relative">

                                            <input
                                                type="number"
                                                name="platform_commission"
                                                value={
                                                    values.platform_commission
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}

                                                onWheel={(e) =>
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).blur()
                                                }

                                                className={`h-11 w-full rounded-lg border bg-transparent px-4 pr-10 text-sm outline-none transition dark:text-white/90

        ${touched.platform_commission &&
                                                        errors.platform_commission

                                                        ? "border-error-500 focus:border-error-500 dark:border-error-500"

                                                        : "border-gray-300 focus:border-brand-500 dark:border-gray-700"
                                                    }
    `}
                                            />

                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">

                                                %
                                            </span>
                                        </div>

                                        {
                                            touched.platform_commission &&
                                            errors.platform_commission && (

                                                <p className="mt-1 text-sm text-error-500">

                                                    {
                                                        errors.platform_commission
                                                    }
                                                </p>
                                            )
                                        }

                                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">

                                            This percentage will be deducted from each booking as platform commission.
                                        </p>
                                    </div>
                                </div>

                                <div className="max-w-sm rounded-2xl bg-brand-50 p-5 dark:bg-brand-500/10">

                                    <div className="flex items-start gap-3">

                                        <Info
                                            size={20}
                                            className="mt-0.5 text-brand-500"
                                        />

                                        <div>

                                            <h4 className="font-medium text-gray-800 dark:text-white/90">

                                                How it works
                                            </h4>

                                            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">

                                                This commission will be applied to the total booking amount before the payment is transferred to the salon.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*
                            SLOT DURATION
                        */}

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">

                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                                <div className="flex-1">

                                    <div className="mb-6 flex items-start gap-4">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10">

                                            <Clock3
                                                size={22}
                                                className="text-brand-500"
                                            />
                                        </div>

                                        <div>

                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">

                                                Slot Duration
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">

                                                Set the default duration for appointment time slots.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="max-w-md">

                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">

                                            Slot Duration
                                        </label>

                                        <select
                                            name="slot_duration"
                                            value={
                                                values.slot_duration
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                                        >

                                            <option value={15} className="bg-gray-100 dark:bg-gray-800 dark:text-white/90">
                                                15 mins
                                            </option>

                                            <option value={30} className="bg-gray-100 dark:bg-gray-800 dark:text-white/90">
                                                30 mins
                                            </option>

                                            <option value={45} className="bg-gray-100 dark:bg-gray-800 dark:text-white/90">
                                                45 mins
                                            </option>

                                            <option value={60} className="bg-gray-100 dark:bg-gray-800 dark:text-white/90" >
                                                60 mins
                                            </option>
                                        </select>

                                        <ErrorMessage
                                            name="slot_duration"
                                            component="p"
                                            className="mt-1 text-sm text-error-500"
                                        />

                                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">

                                            This will be used as the default duration when creating new services and bookings.
                                        </p>
                                    </div>
                                </div>

                                <div className="max-w-sm rounded-2xl bg-warning-50 p-5 dark:bg-warning-500/10">

                                    <div className="flex items-start gap-3">

                                        <Lightbulb
                                            size={20}
                                            className="mt-0.5 text-warning-500"
                                        />

                                        <div>

                                            <h4 className="font-medium text-gray-800 dark:text-white/90">

                                                Note
                                            </h4>

                                            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">

                                                Changing this will not affect existing bookings or services.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*
                            SUBMIT
                        */}

                        <div className="flex justify-end">

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    isSubmitting
                                }
                                className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
                            >

                                {
                                    loading
                                        ? "Saving..."
                                        : "Save Changes"
                                }
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}