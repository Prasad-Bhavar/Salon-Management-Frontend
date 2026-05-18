import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

import InputText from "../../components/form/InputText";

import Button from "../../components/ui/button/Button";

import { loginUser } from "../Auth/auth.service";
import { useAuthContext } from "../../context/AuthContext";
import PageMeta from "../../components/common/PageMeta";
import { EyeIcon, EyeOff } from "lucide-react";

const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "Enter a valid email (e.g., user@example.com)",
    ),
  password: yup.string().required("Password is required"),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, user } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setApiError("");
        const data = await loginUser(values);

        login(data);
        navigate("/dashboard");
      } catch (error: any) {
        setApiError(
          error?.response?.data?.message || "Invalid email or password",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <PageMeta title="Login" description="Login to your account" />

      <div className="flex flex-col flex-1">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5">
              <h1 className="mb-2 font-semibold text-gray-800 dark:text-white text-title-sm">
                Login
              </h1>
              <p className="text-sm text-gray-800 dark:text-gray-400">
                Enter your email and password to sign in!
              </p>
              {apiError && (
                <p className="text-sm text-red-500 mt-1">{apiError}</p>
              )}
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-6">
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

                <div className="relative">
                  <InputText
                    name="password"
                    label="Password *"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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

                <div className="flex items-center justify-end">
                  {/* <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="text-sm text-gray-700">
                      Keep me logged in
                    </span>
                  </div> */}

                  <Link
                    to="/forget-password"
                    className="text-sm text-brand-500 hover:text-brand-600 "
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* BUTTON */}
                <Button
                  type="submit"
                  className="w-full"
                  size="sm"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
