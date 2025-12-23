export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    // If the caller provided a bg- class we shouldn't force the default dark background.
    const hasBg = /\bbg-/.test(className);
    const base = `inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
        disabled ? "opacity-25" : ""
    }`;
    const classes =
        (hasBg ? base : `bg-gray-800 ${base}`) +
        (className ? ` ${className}` : "");

    return (
        <button {...props} className={classes} disabled={disabled}>
            {children}
        </button>
    );
}
