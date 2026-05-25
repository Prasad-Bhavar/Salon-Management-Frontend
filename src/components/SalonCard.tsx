import {
    MapPin,
    Star,
} from "lucide-react";

import FavouriteButton
    from "~/pages/FavouriteSalons/FavouriteButton";

interface SalonCardProps {

    salon: {

        id: number;

        name: string;

        salon_type: string;

        rating?: number;

        review_count?: number;

        starting_price?: number;

        is_favourite?: boolean;

        images?: {

            id: number;

            image_url: string;

        }[];

        address?: {

            area?: string;

            city?: string;

            state?: string;
        };
    };

    onViewDetails?: (
        salonId: number
    ) => void;

    showFavourite?: boolean;

    className?: string;

    footer?: React.ReactNode;
}

export default function SalonCard({

    salon,

    onViewDetails,

    showFavourite = true,

    className = "",

    footer,

}: SalonCardProps) {

    const image =
        salon.images?.[0]?.image_url;

    return (

        <div
            className={[
                `
                overflow-hidden
                rounded-3xl
                border border-gray-200
                bg-white
                shadow-sm
                transition-all
                hover:-translate-y-1
                hover:shadow-lg
                dark:border-white/[0.08]
                dark:bg-white/[0.03]
                `,
                className,
            ].join(" ")}
        >

            {/*
                IMAGE
            */}

            <div
                className="
                    relative
                    h-56
                    w-full
                    overflow-hidden
                "
            >

                <img
                    src={
                        image ||
                        "https://placehold.co/600x400"
                    }
                    alt={salon.name}
                    className="
                        h-full
                        w-full
                        object-cover
                    "
                />

                {/*
                    FAVOURITE
                */}

                {showFavourite && (

                    <div
                        className="
                            absolute
                            right-4
                            top-4
                        "
                    >

                        <FavouriteButton
                            salonId={salon.id}
                            initialState={
                                salon.is_favourite
                            }
                        />

                    </div>
                )}

            </div>

            {/*
                CONTENT
            */}

            <div className="p-5">

                {/*
                    TOP
                */}

                <div
                    className="
                        mb-3
                        flex items-start
                        justify-between
                        gap-3
                    "
                >

                    <div>

                        <h3
                            className="
                                text-lg
                                font-semibold
                                text-gray-900
                                dark:text-white
                            "
                        >
                            {salon.name}
                        </h3>

                        <p
                            className="
                                mt-1
                                text-sm
                                capitalize
                                text-gray-500
                            "
                        >
                            {salon.salon_type} salon
                        </p>

                    </div>

                    {salon.rating !== undefined && (

                        <div
                            className="
                                flex items-center gap-1
                                rounded-lg
                                bg-yellow-50
                                px-2 py-1
                                text-sm
                                font-medium
                                text-yellow-700
                                dark:bg-yellow-500/10
                                dark:text-yellow-400
                            "
                        >

                            <Star
                                size={14}
                                fill="currentColor"
                            />

                            {Number(
                                salon.rating
                            ).toFixed(1)}

                        </div>
                    )}

                </div>

                {/*
                    LOCATION
                */}

                {salon.address && (

                    <div
                        className="
                            mb-4
                            flex items-start gap-2
                            text-sm
                            text-gray-500
                        "
                    >

                        <MapPin
                            size={16}
                            className="mt-0.5"
                        />

                        <span>

                            {salon.address.area
                                ? `${salon.address.area}, `
                                : ""}

                            {salon.address.city},{" "}
                            {salon.address.state}

                        </span>

                    </div>
                )}

                {/*
                    BOTTOM
                */}

                <div
                    className="
                        flex items-center
                        justify-between
                    "
                >

                    <div>

                        {salon.starting_price !== undefined && (

                            <>

                                <p
                                    className="
                                        text-xs
                                        text-gray-400
                                    "
                                >
                                    Starting From
                                </p>

                                <h4
                                    className="
                                        text-lg
                                        font-bold
                                        text-gray-900
                                        dark:text-white
                                    "
                                >
                                    ₹
                                    {
                                        salon.starting_price
                                    }
                                </h4>

                            </>
                        )}

                    </div>

                    <button
                        onClick={() =>
                            onViewDetails?.(
                                salon.id
                            )
                        }
                        className="
                            rounded-xl
                            bg-black
                            px-5 py-2.5
                            text-sm
                            font-medium
                            text-white
                            transition-all
                            hover:opacity-90
                            dark:bg-white
                            dark:text-black
                        "
                    >
                        View Details
                    </button>

                </div>

                {/*
                    REVIEWS
                */}

                {salon.review_count !== undefined && (

                    <p
                        className="
                            mt-3
                            text-xs
                            text-gray-400
                        "
                    >
                        {
                            salon.review_count
                        } reviews
                    </p>
                )}

                {footer}

            </div>

        </div>
    );
}