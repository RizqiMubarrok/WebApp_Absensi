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
