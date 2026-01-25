import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, router, usePage } from "@inertiajs/react";
import Badge from "@/Components/Badge";

function formatDate(iso) {
    try {
        const d = new Date(iso);
        return d.toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch (e) {
        return iso;
    }
}

const STATUSES = ["present", "permit", "absent", "sick"];
const STATUS_LABELS = {
    present: "Hadir",
    absent: "Alfa",
    sick: "Sakit",
    permit: "Izin",
};

export default function Index({
    attendances,
    students,
    filters,
    classes,
    auth,
    is_holiday,
    marking_is_holiday,
}) {
    const { data, setData, post, processing } = useForm({
        // Use the date & student_class filter from the server when available so the table and form stay in sync
        date: filters?.date ?? new Date().toISOString().slice(0, 10),
        class: filters?.student_class ?? "",
        records: students.map((s) => ({
            student_id: s.id,
            status: "present",
            note: "",
        })),
    });

    // Show a centered modal (confirm-like) when attendance save succeeds
    const { flash } = usePage().props;
    const [showSavedModal, setShowSavedModal] = useState(false);
    const [savedMessage, setSavedMessage] = useState("");

    useEffect(() => {
        if (flash?.success) {
            setSavedMessage(flash.success);
            setShowSavedModal(true);
        }
    }, [flash?.success]);

    const markingIsHoliday = (() => {
        try {
            return new Date(data.date).getDay() === 0;
        } catch (e) {
            return marking_is_holiday ?? false;
        }
    })();

    // Local state for the recap table date: this must be independent from the marking form date
    const [recapDate, setRecapDate] = useState(
        filters?.date ?? new Date().toISOString().slice(0, 10)
    );
    // Separate class filter used only by the recap table (does NOT affect the marking UI)
    const [recapClass, setRecapClass] = useState(filters?.class ?? "");

    useEffect(() => {
        // rebuild records if student list changes
        setData(
            "records",
            students.map((s) => ({
                student_id: s.id,
                status: "present",
                note: "",
            }))
        );
    }, [students]);

    // Keep the recap date in sync when the server sends a date filter
    useEffect(() => {
        if (filters?.date) setRecapDate(filters.date);
    }, [filters?.date]);

    function navigateRecapDate(date) {
        // request the attendances page for the recap table only (do NOT modify which students are shown in the marking UI)
        router.get(
            route("attendances.index"),
            { date },
            { preserveState: true, replace: true }
        );
    }

    function handleDateChange(value) {
        // Only update the marking form date — do not change the recap table date
        setData("date", value);
    }

    useEffect(() => {
        if (filters?.student_class) setData("class", filters.student_class);
    }, [filters?.student_class]);

    // Keep the recap class in sync when the server sends a class filter for the rekap table
    useEffect(() => {
        if (filters?.class) setRecapClass(filters.class);
    }, [filters?.class]);

    function handleClassChange(value) {
        setData("class", value);
        // Use `student_class` so this only filters which students appear in the marking UI (does not filter the rekap table)
        router.get(
            route("attendances.index"),
            { date: data.date, student_class: value },
            { preserveState: true, replace: true }
        );
    }

    function handleRekapDateChange(value) {
        // Update the recap table date independently and request the server for that date's recap
        setRecapDate(value);
        navigateRecapDate(value);
    }

    function handleRekapClassChange(value) {
        // Update the recap class independently and request the server for that class's recap on the current recapDate
        setRecapClass(value);
        router.get(
            route("attendances.index"),
            { date: recapDate, class: value },
            { preserveState: true, replace: true }
        );
    }

    function setStatus(index, status) {
        const newRecords = [...data.records];
        newRecords[index].status = status;
        setData("records", newRecords);
    }

    function setNote(index, note) {
        const newRecords = [...data.records];
        newRecords[index].note = note;
        setData("records", newRecords);
    }

    function submit(e) {
        e.preventDefault();
        post(route("attendances.store"), {
            onSuccess: (page) => {
                // prefer server-provided flash message, fallback to default
                const msg =
                    page?.props?.flash?.success || "Absensi berhasil disimpan.";
                setSavedMessage(msg);
                setShowSavedModal(true);
            },
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2
                    className="font-semibold text-xl truncate"
                    title="Attendance"
                >
                    Attendance
                </h2>
            }
        >
            <Head title="Attendances" />

            <div className="py-3 w-full px-3 sm:px-4 lg:px-6">
                {" "}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow">
                        <div
                            className="text-lg font-medium text-gray-800 truncate"
                            title="Absensi Siswa"
                        >
                            Absensi Siswa
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow sm:rounded-lg p-4 mb-6">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <label htmlFor="date" className="sr-only">
                                    Tanggal
                                </label>
                                <input
                                    id="date"
                                    type="date"
                                    value={data.date}
                                    onChange={(e) =>
                                        handleDateChange(e.target.value)
                                    }
                                    className="border rounded-md px-3 py-2"
                                    aria-label="Tanggal absen"
                                />

                                {/* Class selector for filtering which students appear in the marking UI */}
                                <select
                                    aria-label="Kelas"
                                    value={data.class}
                                    onChange={(e) =>
                                        handleClassChange(e.target.value)
                                    }
                                    className="border rounded-md px-3 py-2 w-40 sm:w-48"
                                >
                                    {classes.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-shrink-0">
                                <button
                                    type="submit"
                                    className={`bg-[#2F59C8] hover:bg-[#274aa8] text-white px-4 py-2 rounded-md transition-colors duration-150 ${
                                        markingIsHoliday
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                    disabled={processing || markingIsHoliday}
                                >
                                    Simpan Absensi
                                </button>
                            </div>
                        </div>

                        {markingIsHoliday ? (
                            <div className="bg-white p-6 text-center text-gray-600 rounded-b-md">
                                Absensi tidak bisa dilakukan karena sekolah
                                libur.
                            </div>
                        ) : (
                            <div className="mt-4 rounded-md border divide-y divide-gray-100 max-h-[52vh] overflow-auto">
                                {students.map((s, idx) => (
                                    <div
                                        key={s.id}
                                        className="flex items-center justify-between gap-4 p-3 hover:bg-gray-50"
                                    >
                                        <div className="min-w-0">
                                            <div className="font-medium text-sm truncate">
                                                {s.name}
                                                <span className="text-xs text-gray-400 ms-2">
                                                    {s.nis}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {s.class}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ms-4">
                                            <select
                                                aria-label={`Status ${s.name}`}
                                                value={
                                                    data.records[idx]?.status
                                                }
                                                onChange={(e) =>
                                                    setStatus(
                                                        idx,
                                                        e.target.value
                                                    )
                                                }
                                                className="border rounded-md px-3 py-1 text-sm bg-white w-36 sm:w-44"
                                            >
                                                {STATUSES.map((st) => (
                                                    <option key={st} value={st}>
                                                        {STATUS_LABELS[st] ??
                                                            st}
                                                    </option>
                                                ))}
                                            </select>

                                            <input
                                                aria-label={`Catatan ${s.name}`}
                                                placeholder="Note"
                                                value={data.records[idx]?.note}
                                                onChange={(e) =>
                                                    setNote(idx, e.target.value)
                                                }
                                                className="border rounded-md px-3 py-1 text-sm w-44 sm:w-64"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </form>
                </div>
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="p-4 flex items-center justify-between border-b">
                        <div className="flex items-center gap-3">
                            <input
                                type="date"
                                aria-label="Filter tanggal"
                                value={recapDate}
                                onChange={(e) =>
                                    handleRekapDateChange(e.target.value)
                                }
                                className="border rounded-md px-3 py-2"
                            />

                            <select
                                aria-label="Filter rekap kelas"
                                value={recapClass}
                                onChange={(e) =>
                                    handleRekapClassChange(e.target.value)
                                }
                                className="border rounded-md px-3 py-2 w-40 sm:w-48"
                            >
                                {classes.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* compute recap holiday locally from the recapDate so UI updates immediately */}
                    {(() => {
                        const recapIsHoliday = (() => {
                            try {
                                return new Date(recapDate).getDay() === 0;
                            } catch (e) {
                                return is_holiday ?? false;
                            }
                        })();

                        // filter attendances to only show rows matching the recapDate and recapClass
                        const filteredAttendances = (
                            attendances.data || []
                        ).filter((a) => {
                            const aDate = a.date ? a.date.slice(0, 10) : null;
                            if (!aDate) return false;
                            if (aDate !== recapDate) return false;
                            if (
                                recapClass &&
                                a.student &&
                                a.student.class !== recapClass
                            )
                                return false;
                            return true;
                        });

                        if (recapIsHoliday) {
                            return (
                                <div className="bg-white p-6 text-center text-gray-600 rounded-b-md">
                                    Tidak ada absensi karena sekolah libur.
                                </div>
                            );
                        }

                        if (filteredAttendances.length === 0) {
                            return (
                                <div className="bg-white p-6 text-center text-gray-600 rounded-b-md">
                                    Tidak ada data untuk tanggal ini.
                                </div>
                            );
                        }

                        return (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Student
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kelas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Note
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAttendances.map((a) => (
                                        <tr
                                            key={`${a.id}-${
                                                a.student_id || a.student?.id
                                            }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {formatDate(a.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {a.student?.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {a.student?.class}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge type={a.status}>
                                                    {STATUS_LABELS[a.status] ??
                                                        a.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {a.note}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        );
                    })()}
                </div>
            </div>

            {/* saved modal (confirm-like) shown after successful save */}
            {showSavedModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="fixed inset-0 bg-black/40"
                        aria-hidden="true"
                    ></div>
                    <div className="bg-white rounded-lg shadow-lg p-6 z-50 max-w-md w-full mx-4">
                        <div className="flex items-start gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <div>
                                <div className="text-lg font-medium text-gray-800">
                                    Absensi Berhasil
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    {savedMessage}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowSavedModal(false)}
                                className="bg-[#2F59C8] hover:bg-[#274aa8] text-white px-4 py-2 rounded-md transition-colors duration-150"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
