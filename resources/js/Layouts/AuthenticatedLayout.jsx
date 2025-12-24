import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-transparent border-b-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-12">
                        <div className="flex">
                            {/* Top left removed: no logo and no dashboard link as requested */}
                        </div>

                        {/* Responsive hamburger for mobile */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>
                </div>
            </nav>

            {/* Top header removed per design request */}

            <div className="flex">
                {/* Sidebar fixed to top on md+ */}
                <div className="hidden md:flex md:fixed md:top-0 md:left-0 md:h-screen md:w-56">
                    <aside className="bg-[#2F59C8] text-white h-full flex flex-col justify-between p-6">
                        <div>
                            <div className="mb-8">
                                <div className="font-bold tracking-wide text-lg text-center">
                                    ABSENSIQ
                                </div>
                            </div>

                            <nav className="space-y-4">
                                <Link
                                    href={route("dashboard")}
                                    className={
                                        route().current("dashboard")
                                            ? "w-full flex items-center gap-3 text-sm bg-white/20 px-3 py-2 rounded-md"
                                            : "w-full flex items-center gap-3 text-sm bg-transparent text-white hover:bg-white/10 px-3 py-2 rounded-md"
                                    }
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
                                    className={
                                        route().current("attendances.index")
                                            ? "w-full flex items-center gap-3 text-sm bg-white/20 px-3 py-2 rounded-md"
                                            : "w-full flex items-center gap-3 text-sm bg-transparent text-white hover:bg-white/10 px-3 py-2 rounded-md"
                                    }
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
                                    className={
                                        route().current("students.index")
                                            ? "w-full flex items-center gap-3 text-sm bg-white/20 px-3 py-2 rounded-md"
                                            : "w-full flex items-center gap-3 text-sm bg-transparent text-white hover:bg-white/10 px-3 py-2 rounded-md"
                                    }
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
                                    className={
                                        route().current("profile.edit")
                                            ? "w-full flex items-center gap-3 text-sm bg-white/20 px-3 py-2 rounded-md"
                                            : "w-full flex items-center gap-3 text-sm bg-transparent text-white hover:bg-white/10 px-3 py-2 rounded-md"
                                    }
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
                                    className={
                                        route().current("newpage")
                                            ? "w-full flex items-center gap-3 text-sm bg-white/20 px-3 py-2 rounded-md"
                                            : "w-full flex items-center gap-3 text-sm bg-transparent text-white hover:bg-white/10 px-3 py-2 rounded-md"
                                    }
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
                                            d="M12 4v16M4 12h16"
                                        />
                                    </svg>
                                    <span>Halaman Baru</span>
                                </Link>
                            </nav>
                        </div>

                        <div>
                            <Link
                                method="post"
                                href={route("logout")}
                                className={
                                    "w-full flex items-center gap-3 text-sm px-3 py-2 rounded-md transition-colors duration-150 text-white bg-transparent hover:bg-white/10"
                                }
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
                    </aside>
                </div>

                <main className="flex-1 md:ml-56 px-3 sm:px-4 lg:px-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
