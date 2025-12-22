import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Edit({ student, auth }) {
    const { data, setData, put, processing, errors } = useForm({
        nis: student.nis,
        name: student.name,
        gender: student.gender || "",
        class: student.class || "",
        phone: student.phone || "",
        address: student.address || "",
    });

    function submit(e) {
        e.preventDefault();
        put(route("students.update", student.id));
    }

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <h2
                    className="font-semibold text-xl truncate"
                    title="Edit Siswa"
                >
                    Edit Siswa
                </h2>
            }
        >
            <Head title="Edit Siswa" />

            <div className="py-3 w-full px-3 sm:px-4 lg:px-6">
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    NISN Siswa
                                </label>
                                <input
                                    value={data.nis}
                                    onChange={(e) =>
                                        setData("nis", e.target.value)
                                    }
                                    placeholder="Masukan NISN Siswa"
                                    className="mt-1 block w-full border rounded px-3 py-2"
                                />
                                {errors.nis && (
                                    <div className="text-sm text-red-600">
                                        {errors.nis}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nama Siswa
                                </label>
                                <input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Masukan Nama Siswa"
                                    className="mt-1 block w-full border rounded px-3 py-2"
                                />
                                {errors.name && (
                                    <div className="text-sm text-red-600">
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Jenis Kelamin
                                </label>
                                <select
                                    value={data.gender}
                                    onChange={(e) =>
                                        setData("gender", e.target.value)
                                    }
                                    className="mt-1 block w-full border rounded px-3 py-2"
                                >
                                    <option value="">
                                        Pilih Jenis Kelamin
                                    </option>
                                    <option value="male">LAKI-LAKI</option>
                                    <option value="female">PEREMPUAN</option>
                                </select>
                                {errors.gender && (
                                    <div className="text-sm text-red-600">
                                        {errors.gender}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Kelas
                                </label>
                                <input
                                    value={data.class}
                                    onChange={(e) =>
                                        setData("class", e.target.value)
                                    }
                                    placeholder="Pilih Kelas"
                                    className="mt-1 block w-full border rounded px-3 py-2"
                                />
                                {errors.class && (
                                    <div className="text-sm text-red-600">
                                        {errors.class}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nomor HP Siswa
                                </label>
                                <input
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    placeholder="Masukan Nomor HP Siswa"
                                    className="mt-1 block w-full border rounded px-3 py-2"
                                />
                                {errors.phone && (
                                    <div className="text-sm text-red-600">
                                        {errors.phone}
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Alamat
                                </label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    placeholder="Masukan alamat"
                                    className="mt-1 block w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 text-white px-6 py-2 rounded"
                            >
                                Simpan
                            </button>
                            <a
                                href={route("students.index")}
                                className="bg-red-600 text-white px-6 py-2 rounded"
                            >
                                Batalkan
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
