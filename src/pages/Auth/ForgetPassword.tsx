import { useFormik } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import InputText from "~/components/form/InputText";
import Button from "~/components/ui/button/Button";
import PageMeta from "~/components/common/PageMeta";
import api from "~/api/apiInstance";

const schema = yup.object({
    email: yup
        .string()
        .required("Email is required")
        .matches(
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            "Enter a valid email (e.g., user@example.com)"
        ),
});

export default function ForgetPassword() {
    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: schema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await api.post("/auth/forgot-password", values);

                toast.success("Reset link will be sent to email");
                resetForm();
            } catch {
                toast.error("Something went wrong");
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <>
            <PageMeta title="Forgot Password" description="Reset password" />

            <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-gray-950">
                <div className="w-full max-w-md">

                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                            Forgot Password
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Enter your email to receive reset link
                        </p>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-gray-900 dark:border-gray-800">

                        <form onSubmit={formik.handleSubmit} className="space-y-5">

                            <InputText
                                name="email"
                                label="Email *"
                                placeholder="info@gmail.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.email}
                                touched={formik.touched.email}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                size="sm"
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
                            </Button>

                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="text-sm text-brand-500 hover:underline"
                                >
                                    Back to Login
                                </Link>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}