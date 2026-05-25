import api from "~/api/apiInstance";

import {
    Booking,
    PaginationParams,
} from "./booking.types";

export async function getBookings(
    params: PaginationParams
) {

    const res =
        await api.get(
            "/bookings",
            { params }
        );

    const payload =
        res.data;

    return {

        data:
            payload.data,

        total:
            payload.pagination.total,

        page:
            payload.pagination.page,

        limit:
            payload.pagination.limit,
    };
}

export async function getBookingById(
    id: string
): Promise<Booking> {

    const res =
        await api.get(
            `/bookings/${id}`
        );

    return res.data;
}






// import {
//     Booking,
//     PaginationParams,
// } from "./booking.types";

// //
// // DUMMY BOOKING LIST
// //

// const dummyBookings: Booking[] = [

//     {
//         id: 1,

//         status: "confirmed",

//         total_price: 1200,

//         total_duration: 90,

//         created_at:
//             "2024-05-24T10:00:00",

//         customer: {
//             id: 1,
//             name: "Emma Johnson",
//             email:
//                 "emma@example.com",
//             contact1:
//                 "+91 9876543210",
//         },

//         salon: {
//             id: 1,
//             name:
//                 "Glow Beauty Salon",
//         },

//         booking_services: [

//             {
//                 id: 1,

//                 service: {
//                     id: 1,
//                     name: "Haircut",
//                 },
//             },

//             {
//                 id: 2,

//                 service: {
//                     id: 2,
//                     name: "Hair Spa",
//                 },
//             },
//         ],
//     },

//     {
//         id: 2,

//         status: "pending",

//         total_price: 1800,

//         total_duration: 120,

//         created_at:
//             "2024-05-25T12:30:00",

//         customer: {
//             id: 2,
//             name: "Olivia Smith",
//             email:
//                 "olivia@example.com",
//             contact1:
//                 "+91 9876543200",
//         },

//         salon: {
//             id: 2,
//             name:
//                 "Style Studio",
//         },

//         booking_services: [

//             {
//                 id: 3,

//                 service: {
//                     id: 3,
//                     name:
//                         "Hair Color",
//                 },
//             },
//         ],
//     },

//     {
//         id: 3,

//         status: "completed",

//         total_price: 2500,

//         total_duration: 140,

//         created_at:
//             "2024-05-26T09:00:00",

//         customer: {
//             id: 3,
//             name: "Ava Brown",
//             email:
//                 "ava@example.com",
//             contact1:
//                 "+91 9876500000",
//         },

//         salon: {
//             id: 1,
//             name:
//                 "Glow Beauty Salon",
//         },

//         booking_services: [

//             {
//                 id: 4,

//                 service: {
//                     id: 4,
//                     name:
//                         "Facial",
//                 },
//             },

//             {
//                 id: 5,

//                 service: {
//                     id: 5,
//                     name:
//                         "Cleanup",
//                 },
//             },
//         ],
//     },

//     {
//         id: 4,

//         status: "cancelled",

//         total_price: 900,

//         total_duration: 60,

//         created_at:
//             "2024-05-27T11:15:00",

//         customer: {
//             id: 4,
//             name:
//                 "Sophia Davis",
//             email:
//                 "sophia@example.com",
//             contact1:
//                 "+91 9876512345",
//         },

//         salon: {
//             id: 3,
//             name:
//                 "Beauty Palace",
//         },

//         booking_services: [

//             {
//                 id: 6,

//                 service: {
//                     id: 6,
//                     name:
//                         "Pedicure",
//                 },
//             },
//         ],
//     },
// ];

// //
// // GET BOOKINGS
// //

// export async function getBookings(
//     params: PaginationParams
// ) {


//     return {

//         data:
//             dummyBookings,

//         total:
//             dummyBookings.length,

//         page:
//             params.page,

//         limit:
//             params.limit,
//     };
// }

// //
// // GET BOOKING DETAIL
// //

// export async function getBookingById(
//     id: string
// ): Promise<Booking> {

//     return {

//         id: Number(id),

//         status:
//             "confirmed",

//         total_price: 1200,

//         total_duration: 90,

//         created_at:
//             "2024-05-24T10:00:00",

//         customer: {

//             id: 1,

//             name:
//                 "Emma Johnson",

//             email:
//                 "emma@example.com",

//             contact1:
//                 "+91 9876543210",
//         },

//         salon: {

//             id: 1,

//             name:
//                 "Glow Beauty Salon",

//             contact_number:
//                 "+91 9988776655",

//             address: {

//                 line1:
//                     "123 Beauty Street",

//                 city:
//                     "Mumbai",

//                 state:
//                     "Maharashtra",
//             },
//         },

//         preferred_barber: {

//             id: 1,

//             specialization:
//                 "Senior Stylist",

//             user: {

//                 name:
//                     "Sarah Williams",
//             },
//         },

//         booking_services: [

//             {
//                 id: 1,

//                 price: 500,

//                 duration: 30,

//                 service: {

//                     id: 1,

//                     name:
//                         "Haircut",
//                 },
//             },

//             {
//                 id: 2,

//                 price: 700,

//                 duration: 60,

//                 service: {

//                     id: 2,

//                     name:
//                         "Hair Spa",
//                 },
//             },
//         ],

//         payments: [

//             {
//                 id: 1,

//                 amount: 1200,

//                 payment_method:
//                     "Card",

//                 transaction_status:
//                     "Paid",
//             },
//         ],
//     } as any;
// }