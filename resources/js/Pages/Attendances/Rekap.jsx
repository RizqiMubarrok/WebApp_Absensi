import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

export default function Rekap({
    auth,
    rekapMonth,
    rekapData,
    classes = [],
    selected_class = null,
}) {
    const [selectedClass, setSelectedClass] = useState(selected_class ?? "");
    const [availableClasses, setAvailableClasses] = useState(classes ?? []);

    useEffect(() => {
        if (!availableClasses || availableClasses.length === 0) {
            fetch(route("attendances.classes"), { credentials: "same-origin" })
                .then((r) => r.json())
                .then((data) => {
                    if (Array.isArray(data)) setAvailableClasses(data);
                })
                .catch(() => {});
        }
    }, []);

    function handleMonthChange(value) {
        router.get(
            route("attendances.rekap"),
            { month: value, class: selectedClass || undefined },
            { replace: true }
        );
    }

    function handleClassChange(value) {
        setSelectedClass(value);
        router.get(
            route("attendances.rekap"),
            { month: rekapMonth, class: value || undefined },
            { replace: true }
        );
    }

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl">Rekapan Absensi</h2>}
        >
            <Head title="Rekapan Absensi" />

            <div className="py-3 w-full px-3 sm:px-4 lg:px-6">
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow">
                        <div
                            className="flex items-center gap-3 text-lg font-medium text-gray-800 truncate"
                            title="Rekapan Absensi"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 9V2h12v7"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 22h12a2 2 0 002-2V9H4v11a2 2 0 002 2z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 14h12"
                                />
                            </svg>
                            <span>Rekapan Absensi</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="month"
                                value={rekapMonth}
                                onChange={(e) =>
                                    handleMonthChange(e.target.value)
                                }
                                className="border rounded-md px-3 py-2"
                            />

                            <select
                                value={selectedClass}
                                onChange={(e) =>
                                    handleClassChange(e.target.value)
                                }
                                className="border rounded-md px-3 py-2 w-44"
                            >
                                <option value="">Semua Kelas</option>
                                {availableClasses.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>

                            <a
                                href={route("attendances.rekap.export", {
                                    month: rekapMonth,
                                    class: selectedClass || undefined,
                                })}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-150 inline-flex items-center gap-2 w-36 justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 3v12"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 11l4 4 4-4"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21H3"
                                    />
                                </svg>
                                <span>Export CSV</span>
                            </a>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() =>
                                    window.open(
                                        route("attendances.rekap.print", {
                                            month: rekapMonth,
                                            class: selectedClass || undefined,
                                        }),
                                        "_blank"
                                    )
                                }
                                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors duration-150 inline-flex items-center gap-2 w-36 justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 9V2h12v7"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 22h12a2 2 0 002-2V9H4v11a2 2 0 002 2z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 14h12"
                                    />
                                </svg>
                                <span>Cetak</span>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-auto -mx-6">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        NIS
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kelas
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hadir
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Izin
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sakit
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Alfa
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rekapData.map((s) => (
                                    <tr key={s.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {s.nis}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {s.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {s.class}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                            {s.present}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                            {s.permit}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                            {s.sick}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                            {s.absent}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                            {s.total}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
