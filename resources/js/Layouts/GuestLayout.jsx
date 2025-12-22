import { Link } from "@inertiajs/react";
import LeftImage from "../../../UI/5782453.jpg";

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex bg-white">
            {/* Left decorative panel (hidden on small screens) */}
            <div className="hidden lg:block lg:w-3/5 h-screen">
                <img
                    src={LeftImage}
                    alt="Login artwork"
                    className="h-screen w-full object-cover"
                />
            </div>

            {/* Right side: form container */}
            <div className="flex-1 lg:w-2/5 flex items-center justify-center px-6 lg:px-12 min-h-screen">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}
