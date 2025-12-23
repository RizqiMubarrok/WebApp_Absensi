import React from "react";
import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    if (!links) return null;

    return (
        <nav className="flex items-center justify-center space-x-2">
            {links.map((link, idx) => (
                <span
                    key={idx}
                    className={`${link.url ? "" : "text-gray-500"} `}
                >
                    {link.url ? (
                        <Link
                            href={link.url}
                            className={`px-3 py-1 rounded ${
                                link.active
                                    ? "bg-[#2F59C8] text-white"
                                    : "bg-white border"
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <span
                            className="px-3 py-1 rounded bg-white border"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )}
                </span>
            ))}
        </nav>
    );
}
