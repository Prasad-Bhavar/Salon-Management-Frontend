import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    Formik,
    Form,
    Field,
    ErrorMessage,
} from "formik";

import {
    createSalon,
    getSalonById,
    getSalonOwners,
    updateSalon,
} from "./salons.service";

import {
    salonInitialValues,
    salonValidationSchema,
} from "./salon.validation";

export default function SalonForm() {

    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit = Boolean(id);

    //
    // STATES
    //

    const [loading, setLoading] =
        useState(false);

    const [owners, setOwners] =
        useState<any[]>([]);

    const [initialValues, setInitialValues] =
        useState<any>(
            salonInitialValues
        );

    //
    // OPTIONS
    //

    const salonTypeOptions = [
        {
            label: "Male",
            value: "male",
        },
        {
            label: "Female",
            value: "female",
        },
        {
            label: "Unisex",
            value: "unisex",
        },
    ];

    const statusOptions = [
        {
            label: "Active",
            value: "active",
        },
        {
            label: "Inactive",
            value: "inactive",
        },
        {
            label: "Pending",
            value: "pending",
        },
        {
            label: "Blocked",
            value: "blocked",
        },
    ];

    //
    // FETCH OWNERS
    //

    const fetchOwners = async () => {

        try {

            const res =
                await getSalonOwners();
            setOwners(res || []);

        } catch (error) {

            console.error(error);
        }
    };

    //
    // FETCH SALON
    //

    const fetchSalon = async () => {

        try {

            if (!id) return;

            setLoading(true);

            const res =
                await getSalonById(id);

            setInitialValues({

                name:
                    res.name || "",

                salon_type:
                    res.salon_type || "",

                owner_id:
                    res.owner?.id || "",

                email:
                    res.email || "",

                contact_number:
                    res.contact_number || "",

                status:
                    res.status || "active",

                address: {

                    line1:
                        res.address?.line1 || "",

                    line2:
                        res.address?.line2 || "",

                    city:
                        res.address?.city || "",

                    state:
                        res.address?.state || "",
                    pincode:
                        res.address?.pincode || "",
                },
            });

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    //
    // INITIAL LOAD
    //

    useEffect(() => {

        fetchOwners();

        if (id) {
            fetchSalon();
        }

    }, [id]);

    //
    // SUBMIT
    //

    const handleSubmit = async (
        values: any
    ) => {

        try {

            setLoading(true);

            if (isEdit && id) {

                await updateSalon(
                    id,
                    values
                );

            } else {

                await createSalon(
                    values
                );
            }

            navigate("/salons");

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="space-y-6">

            {/*
        PAGE HEADER
      */}

            <div>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">

                    {
                        isEdit
                            ? "Edit Salon"
                            : "Add Salon"
                    }
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">

                    {
                        isEdit
                            ? "Update salon details and business information"
                            : "Create and register a new salon"
                    }
                </p>
            </div>

            {/*
        FORM CARD
      */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">

                <Formik

                    enableReinitialize

                    initialValues={
                        initialValues
                    }

                    validationSchema={
                        salonValidationSchema
                    }

                    onSubmit={
                        handleSubmit
                    }
                >

                    {({
                        values,
                        setFieldValue,
                        isSubmitting,
                    }) => (

                        <Form className="space-y-10">

                            {/*
                BASIC INFO
              */}

                            <div>

                                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                                    Basic Information
                                </h3>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    {/*
                    SALON NAME
                  */}

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">

                                            Salon Name
                                        </label>

                                        <Field
                                            type="text"
                                            name="name"
                                            placeholder="Enter salon name"
                                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                                        />

                                        <ErrorMessage
                                            name="name"
                                            component="p"
                                            className="mt-1 text-xs text-error-500"
                                        />
                                    </div>

                                    {/*
                    OWNER
                  */}

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">

                                            Owner
                                        </label>

                                        <select
                                            value={
                                                values.owner_id
                                            }
                                            onChange={(e) =>
                                                setFieldValue(
                                                    "owner_id",
                                                    e.target.value
                                                )
                                            }
                                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                                        >

                                            <option value="" className="bg-gray-100 dark:bg-gray-800 dark:text-white/90">
                                                Select Owner
                                            </option>

                                            {
                                                owners.map(
                                                    (owner) => (

                                                        <option
                                                            key={owner.id}
                                                            value={owner.id}
                                                            className="bg-gray-100 dark:bg-gray-800 dark:text-white/90"
                                                        >
                                                            {owner.name}
                                                        </option>
                                                    )
                                                )
                                            }
                                        </select>

                                        <ErrorMessage
                                            name="owner_id"
                                            component="p"
                                            className="mt-1 text-xs text-error-500"
                                        />
                                    </div>

                                    {/*
                    EMAIL
                  */}

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">

                                            Salon Email
                                        </label>

                                        <Field
                                            type="email"
                                            name="email"
                                            placeholder="Enter salon email"
                                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                                        />

                                        <ErrorMessage
                                            name="email"
                                            component="p"
                                            className="mt-1 text-xs text-error-500"
                                        />
                                    </div>

                                    {/*
                    CONTACT NUMBER
                  */}

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">

                                            Contact Number
                                        </label>

                                        <Field
                                            type="text"
                                            name="contact_number"
                                            placeholder="Enter contact number"
                                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                                        />

                                        <ErrorMessage
                                            name="contact_number"
                                            component="p"
                                            className="mt-1 text-xs text-error-500"
                                        />
                                    </div>

                                    {/*
                    SALON TYPE
                  */}

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">

                                            Salon Type
                                        </label>

                                        <select
                                            value={
                                                values.salon_type
                                            }
                                            onChange={(e) =>
                                                setFieldValue(
                                                    "salon_type",
                                                    e.target.value
                                                )
                                            }
                                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                                        >

                                            <option value="" className="bg-gray-100 dark:bg-gray-800 dark:text-white/90">
                                                Select Salon Type
                                            </option>

                                            {
                                                salonTypeOptions.map(
                                                    (item) => (

                                                        <option
                                                            key={item.value}
                                                            value={item.value}
                                                            className="bg-gray-100 dark:bg-gray-800 dark:text-white/90"
                                                        >
                                                            {item.label}
                                                        </option>
                                                    )
                                                )
                                            }
                                        </select>

                                        <ErrorMessage
                                            name="salon_type"
                                            component="p"
                                            className="mt-1 text-xs text-error-500"
                                        />
                                    </div>

                                    {/*
                    STATUS
                  */}

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">

                                            Status
                                        </label>

                                        <select
                                            value={
                                                values.status
                                            }
                                            onChange={(e) =>
                                                setFieldValue(
                                                    "status",
                                                    e.target.value
                                                )
                                            }
                                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                                        >

                                            {
                                                statusOptions.map(
                                                    (item) => (

                                                        <option
                                                            key={item.value}
                                                            value={item.value}
                                                            className="bg-gray-100 dark:bg-gray-800 dark:text-white/90"
                                                        >
                                                            {item.label}
                                                        </option>
                                                    )
                                                )
                                            }
                                        </select>

                                        <ErrorMessage
                                            name="status"
                                            component="p"
                                            className="mt-1 text-xs text-error-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/*
                ADDRESS INFO
              */}

                            <div>

                                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                                    Address Information
                                </h3>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">

                                            Address Line 1
                                        </label>

                                        <Field
                                            type="text"
                                            name="address.line1"
                                            placeholder="Enter address line 1"
                                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                                        />

                                        <ErrorMessage
                                            name="address.line1"
                                            component="p"
                                            className="mt-1 text-xs text-error-500"
                                        />
                                    </div>

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">

                                            Address Line 2
                                        </label>

                                        <Field
                                            type="text"
                                            name="address.line2"
                                            placeholder="Enter address line 2"
                                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                                        />
                                    </div>

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">

                                            City
                                        </label>

                                        <Field
                                            type="text"
                                            name="address.city"
                                            placeholder="Enter city"
                                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                                        />

                                        <ErrorMessage
                                            name="address.city"
                                            component="p"
                                            className="mt-1 text-xs text-error-500"
                                        />
                                    </div>

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">

                                            Pincode
                                        </label>

                                        <Field
                                            type="text"
                                            name="address.pincode"
                                            placeholder="Enter pincode"
                                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                                        />

                                        <ErrorMessage
                                            name="address.pincode"
                                            component="p"
                                            className="mt-1 text-xs text-error-500"
                                        />
                                    </div>
                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">

                                            State
                                        </label>

                                        <Field
                                            type="text"
                                            name="address.state"
                                            placeholder="Enter state"
                                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                                        />

                                        <ErrorMessage
                                            name="address.state"
                                            component="p"
                                            className="mt-1 text-xs text-error-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/*
                FOOTER
              */}

                            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6 dark:border-white/[0.05]">

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/salons")
                                    }
                                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/[0.03]"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        loading ||
                                        isSubmitting
                                    }
                                    className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-70"
                                >

                                    {
                                        loading ||
                                            isSubmitting
                                            ? "Saving..."
                                            : isEdit
                                                ? "Update Salon"
                                                : "Create Salon"
                                    }
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}