import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <div className="bg-white">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                        Selamat Datang Kembali!
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Silakan masuk untuk melanjutkan ke sistem absensi
                        digital sekolah Anda.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        {/* accessible label but visually hidden */}
                        <InputLabel
                            htmlFor="email"
                            value="Username"
                            className="sr-only"
                        />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Username"
                            value={data.email}
                            className="mt-1 block w-full px-4 py-3"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={data.password}
                            className="mt-1 block w-full px-4 py-3"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="pt-3">
                        <PrimaryButton
                            className="w-full px-6 py-3 rounded-lg bg-[#295DC3] hover:bg-[#254aa3] text-white normal-case text-lg font-semibold h-14 flex items-center justify-center"
                            disabled={processing}
                        >
                            Login
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
