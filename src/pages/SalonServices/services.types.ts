export interface OwnerService {

    id: number;

    price: number;

    duration: number;

    status: boolean;

    description?: string;

    service: {

        id: number;

        name: string;

        default_price?: number;

        default_duration?: number;

        category?: {
            id: number;
            name: string;
        };
    };
}

export interface Stats {

    total_services: number;

    active_services: number;

    inactive_services: number;

    most_booked_service: string;
}