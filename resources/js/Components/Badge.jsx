import React from "react";

const colors = {
    present: "bg-green-100 text-green-800",
    absent: "bg-red-100 text-red-800",
    sick: "bg-yellow-100 text-yellow-800",
    permit: "bg-blue-100 text-blue-800",
};

export default function Badge({ children, type = "present" }) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                colors[type] ?? "bg-gray-100 text-gray-800"
            }`}
        >
            {children}
        </span>
    );
}
