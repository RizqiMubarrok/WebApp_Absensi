import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";

export default function Index({
    students,
    filters,
    classes,
    auth,
    total_students = 0,
    total_classes = 0,
}) {
    function destroy(id) {
        if (!confirm("Hapus siswa ini?")) return;
        window.axios
            .delete(`/students/${id}`)
            .then(() => window.location.reload());
    }

    // Defensive handling: Inertia may sometimes provide a plain array or missing meta.
    const rows = students?.data ?? students ?? [];
    const meta = students?.meta ?? {
        current_page: 1,
        per_page: rows.length || 15,
        total: rows.length || 0,
    };
    const startIndex =
        ((meta.current_page ?? 1) - 1) * (meta.per_page ?? rows.length);

    const { flash } = usePage().props;
    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

    function handleCsvFile(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append("file", file);
        // Use Inertia to POST FormData (preserves redirects & flash messages)
        router.post(route("students.import"), fd, { forceFormData: true });
        // clear the input so selecting the same file again will trigger change
        e.target.value = null;
    }

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <h2
                    className="font-semibold text-xl truncate"
                    title="Data Siswa"
                >
                    Data Siswa
                </h2>
            }
        >
            <Head title="Data Siswa" />

            <div className="py-3 w-full px-3 sm:px-4 lg:px-6">
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
                        <div
                            className="text-lg font-medium text-gray-800 truncate"
                            title="Data Siswa"
                        >
                            Data Siswa
                        </div>
                    </div>

                    <div className="mt-4 bg-white p-4 rounded-xl shadow">
                        <form method="get" className="flex gap-3 items-center">
                            <div className="relative flex-grow max-w-2xl">
                                <input
                                    name="q"
                                    defaultValue={filters.q ?? ""}
                                    placeholder="Cari Siswa"
                                    className="border rounded-md pl-11 pr-4 py-2 w-full"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    🔍
                                </span>
                            </div>

                            <select
                                name="class"
                                defaultValue={filters.class ?? ""}
                                className="border rounded-md px-4 py-2 w-44"
                                onChange={(e) => e.target.form.submit()}
                            >
                                <option value="">Kelas</option>
                                {classes?.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>

                            <button className="bg-[#2F59C8] hover:bg-[#274aa8] text-white px-4 py-2 rounded-md transition-colors duration-150">
                                Cari
                            </button>

                            <div className="ms-auto flex items-center gap-3">
                                <form
                                    id="csvUploadForm"
                                    action={route("students.import")}
                                    method="post"
                                    encType="multipart/form-data"
                                    className="inline-flex items-center gap-2"
                                >
                                    <input
                                        type="hidden"
                                        name="_token"
                                        value={csrfToken}
                                    />

                                    <input
                                        id="csvFileInput"
                                        type="file"
                                        name="file"
                                        accept=".csv,text/csv"
                                        className="hidden"
                                        onChange={handleCsvFile}
                                    />
                                    <label
                                        htmlFor="csvFileInput"
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-150 inline-flex items-center gap-2 w-36 justify-center cursor-pointer"
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
                                        <span>Import CSV</span>
                                    </label>
                                </form>

                                <a
                                    href={route("students.create")}
                                    className="bg-[#2F59C8] hover:bg-[#274aa8] text-white px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors duration-150"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    Tambah Data
                                </a>
                            </div>
                        </form>
                    </div>

                    {flash?.success && (
                        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {flash?.import_errors && flash.import_errors.length > 0 && (
                        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                            <div className="font-medium">
                                Beberapa baris gagal diimpor:
                            </div>
                            <ul className="list-disc ms-5 mt-2 text-sm">
                                {flash.import_errors.map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <div className="text-sm text-gray-500">Total Siswa</div>
                        <div className="text-2xl font-bold text-gray-800">
                            {total_students}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <div className="text-sm text-gray-500">
                            Jumlah Kelas
                        </div>
                        <div className="text-2xl font-bold text-gray-800">
                            {total_classes}
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow sm:rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    NISN
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Nama
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Jenis Kelamin
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Kelas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Alamat
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    No HP
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-6 text-center text-gray-500"
                                    >
                                        Tidak ada data siswa.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((s, idx) => (
                                    <tr key={s.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {startIndex + idx + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {s.nis}
                                        </td>
                                        <td className="px-6 py-4 max-w-[240px] truncate whitespace-nowrap overflow-hidden">
                                            {s.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {s.gender === "male"
                                                ? "LAKI-LAKI"
                                                : s.gender === "female"
                                                ? "PEREMPUAN"
                                                : ""}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {s.class}
                                        </td>
                                        <td className="px-6 py-4 max-w-[240px] truncate whitespace-nowrap overflow-hidden">
                                            {s.address}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {s.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <a
                                                href={route(
                                                    "students.edit",
                                                    s.id
                                                )}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm inline-flex items-center justify-center w-14"
                                            >
                                                Edit
                                            </a>
                                            <button
                                                onClick={() => destroy(s.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm inline-flex items-center justify-center w-14 ml-2"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <div className="p-4 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Menampilkan {rows.length} dari {meta.total} siswa
                        </div>
                        <Pagination links={students?.links ?? []} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
