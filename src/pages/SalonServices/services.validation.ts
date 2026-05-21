import * as Yup from "yup";

export const ownerServiceInitialValues = {

    salon_id: 1,

    category_id: "",

    service_id: "",

    price: "",

    duration: "",

    description: "",

    status: true,
};

export const ownerServiceValidationSchema =
    Yup.object().shape({

        category_id:
            Yup.number()
                .required(
                    "Category is required"
                ),

        service_id:
            Yup.number()
                .required(
                    "Service is required"
                ),

        price:
            Yup.number()
                .required(
                    "Price is required"
                )
                .min(
                    1,
                    "Price must be greater than 0"
                ),

        duration:
            Yup.number()
                .required(
                    "Duration is required"
                )
                .min(
                    15,
                    "Duration must be greater than 15"
                ),

        description:
            Yup.string()
                .max(
                    500,
                    "Description cannot exceed 500 characters"
                ),

        status:
            Yup.boolean()
                .required(),
    });