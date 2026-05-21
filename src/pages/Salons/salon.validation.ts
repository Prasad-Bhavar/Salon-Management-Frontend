import * as Yup from "yup";

//
// ENUMS
//

const SALON_STATUS = [
    "active",
    "inactive",
    "pending",
    "blocked",
] as const;

const SALON_TYPES = [
    "male",
    "female",
    "unisex",
] as const;

//
// SALON FORM VALIDATION
//

export const salonValidationSchema =
    Yup.object().shape({

        name: Yup.string()
            .trim()
            .min(
                2,
                "Salon name must be at least 2 characters"
            )
            .max(
                255,
                "Salon name cannot exceed 255 characters"
            )
            .required(
                "Salon name is required"
            ),

        salon_type: Yup.string()
            .oneOf(
                SALON_TYPES,
                "Invalid salon type"
            )
            .required(
                "Salon type is required"
            ),

        owner_id: Yup.number()
            .typeError(
                "Owner is required"
            )
            .required(
                "Owner is required"
            ),

        email: Yup.string()
            .trim()
            .email(
                "Invalid email address"
            )
            .max(
                255,
                "Email cannot exceed 255 characters"
            )
            .required(
                "Salon email is required"
            ),

        contact_number: Yup.string()
            .trim()
            .matches(
                /^[0-9]{10}$/,
                "Contact number must be 10 digits"
            )
            .required(
                "Contact number is required"
            ),

        status: Yup.string()
            .oneOf(
                SALON_STATUS,
                "Invalid status"
            )
            .required(
                "Status is required"
            ),

        //
        // ADDRESS
        //

        address: Yup.object().shape({

            line1: Yup.string()
                .trim()
                .min(
                    2,
                    "Address line 1 is required"
                )
                .max(
                    255,
                    "Address line 1 cannot exceed 255 characters"
                )
                .required(
                    "Address line 1 is required"
                ),

            line2: Yup.string()
                .trim()
                .max(
                    255,
                    "Address line 2 cannot exceed 255 characters"
                )
                .nullable(),

            city: Yup.string()
                .trim()
                .min(
                    2,
                    "City is required"
                )
                .max(
                    100,
                    "City cannot exceed 100 characters"
                )
                .required(
                    "City is required"
                ),

            state: Yup.string()
                .trim()
                .min(
                    2,
                    "State is required"
                )
                .max(
                    100,
                    "State cannot exceed 100 characters"
                )
                .required(
                    "State is required"
                ),
            pincode: Yup.string()
                .matches(
                    /^[0-9]{6}$/,
                    "Pincode must be 6 digits"
                )
                .required(
                    "Pincode is required"
                ),
        }),
    });

//
// INITIAL VALUES
//

export const salonInitialValues = {

    name: "",

    salon_type: "unisex",

    owner_id: "",

    email: "",

    contact_number: "",

    status: "active",

    address: {

        line1: "",

        line2: "",

        city: "",

        state: "",
        pincode: "",
    },
};