import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
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

const STATUSES = ["present", "permit", "absent"];
const STATUS_LABELS = {
    present: "Hadir",
    absent: "Alfa",
    sick: "Sakit",
    permit: "Izin",
};

export default function Index({ attendances, students, filters, auth }) {
    const { data, setData, post, processing } = useForm({
        date: new Date().toISOString().slice(0, 10),
        records: students.map((s) => ({
            student_id: s.id,
            status: "present",
            note: "",
        })),
    });

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
        post(route("attendances.store"));
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
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="flex items-center gap-3">
                                <label htmlFor="date" className="sr-only">
                                    Tanggal
                                </label>
                                <input
                                    id="date"
                                    type="date"
                                    value={data.date}
                                    onChange={(e) =>
                                        setData("date", e.target.value)
                                    }
                                    className="border rounded-md px-3 py-2"
                                    aria-label="Tanggal absen"
                                />
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md"
                                    disabled={processing}
                                >
                                    Save Attendance
                                </button>
                            </div>
                        </div>

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
                                            value={data.records[idx]?.status}
                                            onChange={(e) =>
                                                setStatus(idx, e.target.value)
                                            }
                                            className="border rounded-md px-3 py-1 text-sm bg-white w-36 sm:w-44"
                                        >
                                            {STATUSES.map((st) => (
                                                <option key={st} value={st}>
                                                    {STATUS_LABELS[st] ?? st}
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
                    </form>
                </div>
                <div className="bg-white shadow sm:rounded-lg">
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
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Note
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {attendances.data.map((a) => (
                                <tr key={a.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDate(a.date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {a.student.name}
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
