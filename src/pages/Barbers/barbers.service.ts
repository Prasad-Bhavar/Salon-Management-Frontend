// src/pages/Barbers/barbers.service.ts

import api from "~/api/apiInstance";

//
// STATUS
//

export type BarberStatus =
    | "active"
    | "inactive"
    | "on_leave";

//
// SERVICE
//

export interface BarberService {

    id: number;

    name: string;

    category?: {
        id: number;
        name: string;
    };
}

//
// BARBER
//

export interface Barber {

    id: number;

    specialization?: string;

    status: BarberStatus;

    created_at?: string;

    user: {

        id: number;

        name: string;

        email: string;

        contact1: string;

        gender: string;
    };

    barber_services?: {

        id: number;

        service: BarberService;

    }[];
}

//
// STATS
//

export interface BarberStats {

    total_staff: number;

    active_staff: number;
}

//
// FORM PAYLOAD
//

export interface BarberPayload {

    name: string;

    email: string;

    contact1: string;

    gender: string;

    status: BarberStatus;

    specialization?: string;

    services: number[];
}

//
// GET BARBERS
//

export async function getBarbers() {

    const res =
        await api.get(
            "/barbers"
        );
    console.log("get barber list", res);

    return res.data;
}

//
// GET DETAIL
//

export async function getBarberById(
    id: string
) {

    const res =
        await api.get(
            `/barbers/${id}`
        );
    console.log("barber detail", id, res);

    return res.data;
}

//
// CREATE
//

export async function createBarber(
    payload: BarberPayload
) {

    const res =
        await api.post(
            "/barbers",
            payload
        );

    return res.data;
}

//
// UPDATE
//

export async function updateBarber(
    id: string,
    payload: BarberPayload
) {

    const res =
        await api.put(
            `/barbers/${id}`,
            payload
        );

    return res.data;
}

//
// SERVICES
//

export async function getServices() {

    const res =
        await api.get(
            "/barbers/services"
        );

    return res.data;
}