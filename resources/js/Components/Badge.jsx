import React from "react";

const colors = {
    present: "bg-blue-50 text-blue-600",
    permit: "bg-yellow-50 text-yellow-600",
    absent: "bg-red-50 text-red-600",
    sick: "bg-green-50 text-green-600",
};

export default function Badge({ children, type = "present" }) {
    return (
        <span
            className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium min-w-[48px] ${
                colors[type] ?? "bg-gray-100 text-gray-800"
            }`}
        >
            {children}
        </span>
    );
}
