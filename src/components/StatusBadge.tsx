interface Props {
    status: boolean;
}

export default function StatusBadge({
    status,
}: Props) {

    return (

        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${status
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
        >
            {status
                ? "Active"
                : "Inactive"}
        </span>
    );
}