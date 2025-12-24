import React from "react";
import { Link } from "@inertiajs/react";

export default function Sidebar() {
    const itemClass = (active) =>
        `w-full flex items-center gap-3 text-sm px-3 py-2 rounded-md transition-colors duration-150 ${
            active
                ? "bg-white/20 text-white"
                : "text-white bg-transparent hover:bg-white/10"
        }`;

    return (
        <aside className="w-56 hidden md:block bg-[#2F59C8] text-white h-full">
            <div className="p-6 flex flex-col justify-between h-full">
                <div>
                    <div className="mb-8">
                        <div className="font-bold tracking-wide text-lg text-center">
                            ABSENSIQ
                        </div>
                    </div>

                    <nav className="space-y-4">
                        <Link
                            href={route("dashboard")}
                            className={itemClass(route().current("dashboard"))}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"
                                />
                            </svg>
                            <span>Dashboard</span>
                        </Link>

                        <Link
                            href={route("attendances.index")}
                            className={itemClass(
                                route().current("attendances.index")
                            )}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
                                />
                            </svg>
                            <span>Absensi Siswa</span>
                        </Link>

                        <Link
                            href={route("students.index")}
                            className={itemClass(
                                route().current("students.index")
                            )}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m0-6a4 4 0 110 8 4 4 0 010-8z"
                                />
                            </svg>
                            <span>Data Siswa</span>
                        </Link>

                        <Link
                            href={route("profile.edit")}
                            className={itemClass(
                                route().current("profile.edit")
                            )}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5.121 17.804A4 4 0 0112 15a4 4 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            <span>Profile</span>
                        </Link>

                        <Link
                            href={route("newpage")}
                            className={itemClass(route().current("newpage"))}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16" />
                            </svg>
                            <span>Halaman Baru</span>
                        </Link>
                    </nav>
                </div>

                <div>
                    <Link
                        method="post"
                        href={route("logout")}
                        className={itemClass(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 16l4-4m0 0l-4-4m4 4H7"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 8v8"
                            />
                        </svg>
                        <span>Logout</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
