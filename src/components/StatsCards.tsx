import {
    Scissors,
    CheckCircle,
    XCircle,
    TrendingUp,
} from "lucide-react";

interface Props {

    stats: any;
}

export default function StatsCards({
    stats,
}: Props) {

    const cards = [

        {
            title:
                "Total Services",

            value:
                stats?.total_services || 0,

            icon:
                <Scissors
                    size={20}
                />,

            color:
                "bg-purple-100 text-purple-600",
        },

        {
            title:
                "Active Services",

            value:
                stats?.active_services || 0,

            icon:
                <CheckCircle
                    size={20}
                />,

            color:
                "bg-green-100 text-green-600",
        },

        {
            title:
                "Inactive Services",

            value:
                stats?.inactive_services || 0,

            icon:
                <XCircle
                    size={20}
                />,

            color:
                "bg-red-100 text-red-600",
        },

        {
            title:
                "Most Booked",

            value:
                stats?.most_booked_service || "-",

            icon:
                <TrendingUp
                    size={20}
                />,

            color:
                "bg-orange-100 text-orange-600",
        },
    ];

    return (

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {cards.map(
                (card, index) => (

                    <div
                        key={index}
                        className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]"
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {card.title}
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">

                                    {card.value}
                                </h3>
                            </div>

                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}>

                                {card.icon}
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}