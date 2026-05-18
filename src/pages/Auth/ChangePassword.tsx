import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";

import InputText from "~/components/form/InputText";
import Button from "~/components/ui/button/Button";
import PageMeta from "~/components/common/PageMeta";
import api from "~/api/apiInstance";
import { EyeIcon, EyeOff } from "lucide-react";

const schema = yup.object({
    password: yup
        .string()
        .min(8, "Minimum 8 characters")
        .required("Password is required")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
            "Password must be 8+ chars, include uppercase, lowercase, number & special character"
        ),

    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
});

export default function ChangePassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [valid, setValid] = useState<boolean | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        async function verify() {
            try {
                await api.get(`/auth/verify-reset-token/${token}`);
                setValid(true);
            } catch {
                setValid(false);
            }
        }

        verify();
    }, [token]);

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: schema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await api.post("/auth/reset-password", {
                    token,
                    password: values.password,
                });

                toast.success("Password reset successful");
                navigate("/login");
            } catch {
                toast.error("Invalid or expired link");
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (valid === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500 dark:text-gray-400">
                    Verifying link...
                </p>
            </div>
        );
    }

    if (!valid) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="max-w-md w-full p-6 text-center bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-red-500">
                        Link expired or invalid
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Please request a new password reset link.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <PageMeta
                title="Reset Password"
                description="Change your account password"
            />

            <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-gray-950">
                <div className="w-full max-w-lg">

                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                            Reset Password
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Enter your new password below
                        </p>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-gray-900 dark:border-gray-800">

                        <form onSubmit={formik.handleSubmit} className="space-y-5">

                            <div className="relative">
                                <InputText
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    label="New Password *"
                                    placeholder="Enter new password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.errors.password}
                                    touched={formik.touched.password}
                                    rightIcon={
                                        showPassword ? (
                                            <EyeIcon
                                                className="w-5 h-5 dark:text-gray-500"
                                                onClick={() => setShowPassword(!showPassword)}
                                            />
                                        ) : (
                                            <EyeOff
                                                className="w-5 h-5 dark:text-gray-500"
                                                onClick={() => setShowPassword(!showPassword)}
                                            />
                                        )
                                    }
                                />
                            </div>

                            <div className="relative">
                                <InputText
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    label="Confirm Password *"
                                    placeholder="Confirm new password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.errors.confirmPassword}
                                    touched={formik.touched.confirmPassword}
                                    rightIcon={
                                        showPassword ? (
                                            <EyeIcon
                                                className="w-5 h-5 dark:text-gray-500"
                                                onClick={() => setShowPassword(!showPassword)}
                                            />
                                        ) : (
                                            <EyeOff
                                                className="w-5 h-5 dark:text-gray-500"
                                                onClick={() => setShowPassword(!showPassword)}
                                            />
                                        )
                                    }
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                size="sm"
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? "Resetting..." : "Reset Password"}
                            </Button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}