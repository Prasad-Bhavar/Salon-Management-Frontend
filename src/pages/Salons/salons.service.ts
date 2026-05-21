import api from "~/api/apiInstance";

//
// TYPES
//

export type SalonStatus =
    | "active"
    | "inactive"
    | "pending"
    | "blocked";

export type SalonType =
    | "male"
    | "female"
    | "unisex";

//
// OWNER
//

export interface SalonOwner {
    id: number;
    name: string;
    email: string;
}

//
// ADDRESS
//

export interface SalonAddress {
    id?: number;

    line1: string;

    line2?: string;

    city: string;

    state: string;
    pincode: string;
}

//
// BANK DETAILS
//

export interface SalonBankDetails {
    id: number;

    account_holder_name: string;

    account_number: string;

    ifsc_code: string;

    bank_name: string;

    upi_id?: string;
}

//
// ANALYTICS
//

export interface SalonAnalytics {

    total_bookings: number;

    completed_bookings: number;

    cancelled_bookings: number;

    total_barbers: number;

    active_barbers: number;

    total_revenue: number;

    total_commission: number;

    net_revenue: number;
}

//
// BOOKING
//

export interface RecentBooking {

    id: number;

    total_price: number;

    status: string;

    created_at: string;

    customer?: {
        id: number;
        name: string;
    };
}

//
// SALON
//

export interface Salon {

    id: number;

    name: string;

    salon_type: SalonType;

    email: string;

    contact_number: string;

    status: SalonStatus;

    created_at?: string;

    owner?: SalonOwner;

    address?: SalonAddress;

    bank_details?: SalonBankDetails[];

    analytics?: SalonAnalytics;

    recent_bookings?: RecentBooking[];

    total_revenue?: number;

    net_revenue?: number;
}

//
// PAGINATION
//

export interface PaginationParams {

    page: number;

    limit: number;

    search?: string;

    status?: SalonStatus | "";

    salon_type?: SalonType | "";

    owner_id?: number;

    sort?: string;

    order?: "asc" | "desc";
}

//
// PAGINATED RESPONSE
//

export interface PaginatedResponse<T> {

    data: T[];

    total: number;

    page: number;

    limit: number;
}

//
// CREATE / UPDATE PAYLOAD
//

export interface SalonPayload {

    name: string;

    salon_type: SalonType;

    owner_id: number;

    email: string;

    contact_number: string;

    status: SalonStatus;

    address: {

        line1: string;

        line2?: string;

        city: string;

        state: string;
    };
}

//
// GET SALONS
//

export async function getSalons(
    params: PaginationParams
): Promise<PaginatedResponse<Salon>> {

    const res = await api.get(
        "/salons",
        { params }
    );
    const payload = res.data;

    const pagination =
        payload.pagination;

    return {

        data: payload.data,

        total:
            pagination?.total || 0,

        page:
            pagination?.page || 1,

        limit:
            pagination?.limit || 10,
    };
}

//
// GET SALON DETAIL
//

export async function getSalonById(
    id: string
): Promise<Salon> {

    const res = await api.get(
        `/salons/${id}`
    );

    return res.data;
}

//
// CREATE SALON
//

export async function createSalon(
    payload: SalonPayload
) {

    const res = await api.post(
        "/salons",
        payload
    );

    return res.data;
}

//
// UPDATE SALON
//

export async function updateSalon(
    id: string,
    payload: Partial<SalonPayload>
) {

    const res = await api.put(
        `/salons/${id}`,
        payload
    );

    return res.data;
}

//
// UPDATE STATUS
//

export async function updateSalonStatus(
    id: string,
    status: SalonStatus
) {

    const res = await api.put(
        `/salons/${id}/status`,
        {
            status,
        }
    );

    return res.data;
}

//
// GET OWNERS
//

export async function getSalonOwners() {

    const res = await api.get(
        "/salons/owners"
    );
    return res.data;
}