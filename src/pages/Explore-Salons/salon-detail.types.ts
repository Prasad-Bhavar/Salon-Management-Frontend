// ── Salon Detail API (/explore-salons/:id) ─────────────────────────────────

export interface SalonImage {
    id: number;
    image_url: string;
    created_at?: string;
}

export interface SalonAddress {
    id: number;
    line1: string;
    line2?: string;
    area?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
}

export interface SalonAvailability {
    id: number;
    day_of_week: string; // "Monday", "Tuesday" ...
    start_time: string;  // "09:00:00"
    end_time: string;    // "21:00:00"
    is_closed: boolean;
    capacity: number;
}

export interface ReviewCustomer {
    id: number;
    name: string;
    email: string;
    gender: string;
}

export interface ReviewImage {
    id: number;
    image_url: string;
}

export interface SalonReview {
    id: number;
    rating: number;
    comment?: string;
    created_at: string;
    customer: ReviewCustomer;
    images: ReviewImage[];
}

export interface SalonDetail {
    id: number;
    name: string;
    salon_type: "male" | "female" | "unisex";
    status: string;
    email?: string;
    contact_number?: string;
    created_at: string;
    address: SalonAddress;
    images: SalonImage[];
    availability: SalonAvailability[];
    reviews: SalonReview[];
    rating: number;
    review_count: number;
    is_favourite: boolean;
}

// ── Available Dates API (/explore-salons/:id/available-dates) ──────────────

export interface AvailableDatesResponse {
    available_dates: string[]; // "YYYY-MM-DD"
    closed_dates: string[];
}

// ── Services API (/explore-salons/:id/services) ────────────────────────────

export interface ServiceItem {
    id: number;          // salon_service id
    service_id: number;
    name: string;
    description?: string;
    image?: string;
    duration: number;    // mins
    price: number;
    gender_type: string;
}

export interface ServiceCategory {
    category: string;
    services: ServiceItem[];
}

// ── Booking cart ───────────────────────────────────────────────────────────

export interface CartItem {
    id: number;       // salon_service id
    name: string;
    price: number;
    duration: number;
    category: string;
}

export interface BookingDraft {
    date: string;
    time: string;
    items: CartItem[];
    notes?: string;
}