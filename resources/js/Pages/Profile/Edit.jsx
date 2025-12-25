import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2
                    className="font-semibold text-xl text-gray-800 leading-tight truncate"
                    title="Profile"
                >
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-3 w-full px-3 sm:px-4 lg:px-6">
                <div className="space-y-4 w-full">
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="bg-white p-4 rounded-xl shadow">
                            <div
                                className="text-lg font-medium text-gray-800 truncate"
                                title="Profile"
                            >
                                Profile
                            </div>
                        </div>
                    </div>

                    <div className="p-3 sm:p-6 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* CSV Template card */}
                    <div className="p-3 sm:p-6 bg-white shadow sm:rounded-lg">
                        <div className="max-w-xl">
                            <div className="text-lg font-semibold text-gray-800 mb-2">
                                Template CSV Siswa
                            </div>
                            <div className="text-sm text-gray-600 mb-4">
                                Tombol ini mengunduh file template CSV untuk
                                impor data siswa. Gunakan template tersebut
                                untuk menyesuaikan struktur dan format data
                                (mis. kolom:
                                nis,name,gender,class,phone,address,email)
                                sehingga proses impor berjalan lancar dan
                                meminimalkan kesalahan.
                            </div>

                            <a
                                href={route("students.import.template")}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-150 inline-flex items-center gap-2 w-44 justify-center cursor-pointer whitespace-nowrap"
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
                                </svg>
                                <span>Unduh Template CSV</span>
                            </a>
                        </div>
                    </div>

                    <div className="p-3 sm:p-6 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-3 sm:p-6 bg-white shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
