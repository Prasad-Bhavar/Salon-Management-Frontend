import { Search, MapPin } from "lucide-react";

interface ExploreFiltersProps {
    search: string;
    city: string;
    salon_type: string;
    onSearchChange: (value: string) => void;
    onCityChange: (value: string) => void;
    onSalonTypeChange: (value: string) => void;
}

export default function ExploreFilters({
    search,
    city,
    salon_type,
    onSearchChange,
    onCityChange,
    onSalonTypeChange,
}: ExploreFiltersProps) {

    const inputBase = [
        "h-11 w-full rounded-lg border bg-white px-4 text-sm text-gray-800",
        "placeholder:text-gray-400 outline-none transition",
        "focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10",
        "dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30",
        "dark:focus:border-brand-700",
    ].join(" ");

    const iconWrapBase = [
        "relative flex items-center",
    ].join(" ");

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                {/* ── Search ── */}
                <div className={`${iconWrapBase} flex-1`}>
                    <Search
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none dark:text-white/30"
                    />
                    <input
                        type="text"
                        placeholder="Search salon..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className={`${inputBase} pl-9`}
                    />
                </div>

                {/* ── City ── */}
                <div className={`${iconWrapBase} sm:w-52`}>
                    <MapPin
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none dark:text-white/30"
                    />
                    <input
                        type="text"
                        placeholder="City..."
                        value={city}
                        onChange={(e) => onCityChange(e.target.value)}
                        className={`${inputBase} pl-9`}
                    />
                </div>

                {/* ── Salon type ── */}
                <select
                    value={salon_type}
                    onChange={(e) => onSalonTypeChange(e.target.value)}
                    className={[
                        "h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700",
                        "shadow-theme-xs outline-none transition",
                        "focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10",
                        "dark:border-gray-700 dark:bg-gray-900 dark:text-white/90",
                        "sm:w-44",
                    ].join(" ")}
                >
                    <option value="">All Types</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unisex">Unisex</option>
                </select>

            </div>
        </div>
    );
}