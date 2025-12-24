import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

export default function Dashboard({ auth }) {
    const [stats, setStats] = useState({
        total_students: 0,
        recap: {},
        classes_count: 0,
        last7: [],
    });

    useEffect(() => {
        fetch("/dashboard/stats", { credentials: "same-origin" })
            .then((r) => r.json())
            .then((data) => setStats(data));
    }, []);

    const present = stats.recap?.present ?? 0;
    const permit = stats.recap?.permit ?? 0;
    const absent = stats.recap?.absent ?? 0;
    const sick = stats.recap?.sick ?? 0;

    const pieData = {
        labels: ["Hadir", "Izin", "Alfa", "Sakit"],
        datasets: [
            {
                data: [present, permit, absent, sick],
                backgroundColor: ["#3B82F6", "#F59E0B", "#EF4444", "#10B981"],
            },
        ],
    };

    // Prefer monthly data (from the 1st of this month) when available, otherwise fall back to last7
    const source =
        stats.month && stats.month.length ? stats.month : stats.last7;

    const isHoliday = source.map((d) => (d.is_holiday ? true : false));

    const barData = {
        labels: source.map((d) =>
            new Date(d.date).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
            })
        ),
        datasets: [
            {
                label: "Hadir",
                data: source.map((d) => d.present ?? 0),
                backgroundColor: source.map((d) =>
                    d.is_holiday ? "#9CA3AF" : "#3B82F6"
                ),
            },
            {
                label: "Izin",
                data: source.map((d) => d.permit ?? 0),
                backgroundColor: source.map((d) =>
                    d.is_holiday ? "#9CA3AF" : "#F59E0B"
                ),
            },
            {
                label: "Alfa",
                data: source.map((d) => d.absent ?? 0),
                backgroundColor: source.map((d) =>
                    d.is_holiday ? "#9CA3AF" : "#EF4444"
                ),
            },
            {
                label: "Sakit",
                data: source.map((d) => d.sick ?? 0),
                backgroundColor: source.map((d) =>
                    d.is_holiday ? "#9CA3AF" : "#10B981"
                ),
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { position: "bottom" },
            tooltip: {
                mode: "index",
                intersect: false,
                callbacks: {
                    label: function (context) {
                        const idx = context.dataIndex;
                        if (source[idx] && source[idx].is_holiday) {
                            // Show a single `Sekolah libur` label for the first dataset item
                            if (context.datasetIndex === 0)
                                return "Sekolah libur";
                            return "";
                        }
                        return `${context.dataset.label}: ${context.formattedValue}`;
                    },
                },
            },
        },
        scales: {
            x: {
                stacked: true,
                grid: { color: "rgba(0,0,0,0.04)", borderDash: [2, 4] },
            },
            y: {
                stacked: true,
                beginAtZero: true,
                grid: { color: "rgba(0,0,0,0.04)", borderDash: [2, 4] },
            },
        },
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <h2
                    className="font-semibold text-xl text-gray-800 leading-tight truncate"
                    title="Dashboard"
                >
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-3 w-full px-3 sm:px-4 lg:px-6">
                {" "}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow">
                        <div
                            className="text-lg font-medium text-gray-800 truncate"
                            title="Dashboard"
                        >
                            Dashboard
                        </div>
                    </div>
                </div>
                {/* Top row: Statistik + Kehadiran boxes */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-stretch">
                        {/* Statistik (left) */}
                        <div className="md:col-span-2">
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <div
                                    className="text-sm font-semibold text-gray-700 mb-4 truncate"
                                    title="Statistik"
                                >
                                    Statistik
                                </div>

                                <div className="flex items-center justify-center">
                                    <div className="relative w-48 h-48">
                                        <Pie
                                            data={pieData}
                                            options={{
                                                cutout: "70%",
                                                plugins: {
                                                    legend: { display: false },
                                                },
                                                maintainAspectRatio: false,
                                            }}
                                        />

                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <div className="text-xs text-gray-500">
                                                Total
                                            </div>
                                            <div className="text-3xl font-bold">
                                                {stats.total_students}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Seluruh Siswa
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kehadiran (right) */}
                        <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 mb-3 text-2xl">
                                    ✓
                                </div>
                                <div className="text-sm text-gray-500">
                                    Hadir
                                </div>
                                <div className="text-4xl font-bold text-blue-600 mt-2">
                                    {present}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-yellow-50 text-yellow-600 mb-3 text-2xl">
                                    i
                                </div>
                                <div className="text-sm text-gray-500">
                                    Izin
                                </div>
                                <div className="text-4xl font-bold text-yellow-600 mt-2">
                                    {permit}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-red-50 text-red-600 mb-3 text-lg">
                                    ✕
                                </div>
                                <div className="text-sm text-gray-500">
                                    Alfa
                                </div>
                                <div className="text-4xl font-bold text-red-600 mt-2">
                                    {absent}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-50 text-green-600 mb-3 text-lg">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 5v14M5 12h14"
                                        />
                                    </svg>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Sakit
                                </div>
                                <div className="text-4xl font-bold text-green-600 mt-2">
                                    {sick}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Chart card */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div
                            className="text-lg font-medium text-gray-700 mb-4 truncate"
                            title="Tingkat Kehadiran Siswa"
                        >
                            Tingkat Kehadiran Siswa
                        </div>
                        <div style={{ height: 380 }}>
                            <Bar
                                data={barData}
                                options={{
                                    ...barOptions,
                                    maintainAspectRatio: false,
                                }}
                            />
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-gray-400 inline-block"></span>
                                <span>Sekolah libur</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
                                <span>Hadir</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                                <span>Izin</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                                <span>Alfa</span>
                            </div>{" "}
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                                <span>Sakit</span>
                            </div>{" "}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
