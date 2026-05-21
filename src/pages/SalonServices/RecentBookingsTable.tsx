interface Props {
    bookings?: any[];
}

export default function RecentBookingsTable({
    bookings = [],
}: Props) {

    return (

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]" >

            <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]" >

                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90" >

                    Recent Bookings
                </h3>
            </div>

            < div className="overflow-x-auto" >

                <table className="min-w-full" >

                    <thead>

                        <tr className="border-b border-gray-100 dark:border-white/[0.05]" >

                            <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500" >

                                Customer
                            </th>

                            < th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500" >

                                Date & Time
                            </th>

                            < th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500" >

                                Amount
                            </th>

                            < th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500" >

                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {
                            bookings.map(
                                (booking, index) => (

                                    <tr
                                        key={index}
                                        className="border-b border-gray-100 last:border-0 dark:border-white/[0.05]"
                                    >

                                        <td className="px-5 py-4" >

                                            <div>

                                                <p className="font-medium text-gray-800 dark:text-white/90" >

                                                    {
                                                        booking.customer_name
                                                    }
                                                </p>
                                            </div>
                                        </td>

                                        < td className="px-5 py-4 text-sm text-gray-500" >

                                            {
                                                booking.date
                                            }
                                        </td>

                                        < td className="px-5 py-4 font-medium text-gray-800 dark:text-white/90" >

                                            ₹
                                            {booking.amount}
                                        </td>

                                        < td className="px-5 py-4" >

                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${booking.status ===
                                                    "completed"

                                                    ? "bg-green-100 text-green-700"

                                                    : booking.status ===
                                                        "confirmed"

                                                        ? "bg-blue-100 text-blue-700"

                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {
                                                    booking.status
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                )
                            )
                        }

                        {
                            bookings.length === 0 && (

                                <tr>

                                    <td
                                        colSpan={4}
                                        className="px-5 py-8 text-center text-sm text-gray-500"
                                    >
                                        No recent bookings found
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}