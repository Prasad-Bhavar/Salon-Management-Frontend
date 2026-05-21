import * as Yup from "yup";

export const settingsValidationSchema =
    Yup.object().shape({

        platform_commission:
            Yup.number()

                .required(
                    "Commission is required"
                )

                .min(0)

                .max(100),

        slot_duration:
            Yup.number()

                .required(
                    "Slot duration is required"
                )

                .oneOf(
                    [15, 30, 45, 60]
                ),
    });

export const settingsInitialValues = {

    platform_commission: 15,

    slot_duration: 30,
};