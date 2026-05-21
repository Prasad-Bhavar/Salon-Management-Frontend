export type BookingStatus =
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed";

export interface Booking {

    id: number;

    status: BookingStatus;

    total_price: number;

    total_duration: number;

    created_at: string;

    customer?: {

        id: number;

        name: string;

        email: string;

        contact1?: string;
    };

    salon?: {

        id: number;

        name: string;
    };

    preferred_barber?: {

        id: number;

        user?: {

            name: string;
        };
    };

    booking_services?: {

        id: number;

        service?: {

            id: number;

            name: string;
        };
    }[];

    payments?: {

        id: number;

        amount: number;

        payment_method: string;

        transaction_status: string;
    }[];
}

export interface PaginationParams {

    page: number;

    limit: number;

    search?: string;

    status?: string;

    salon_id?: number;

    sort?: string;

    order?: "ASC" | "DESC";
}