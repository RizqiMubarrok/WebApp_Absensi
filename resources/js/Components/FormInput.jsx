import React from "react";
import TextInput from "./TextInput";
import InputLabel from "./InputLabel";
import InputError from "./InputError";

export default function FormInput({ label, error, className = "", ...props }) {
    return (
        <div className={"mb-4 " + className}>
            {label && <InputLabel>{label}</InputLabel>}
            <TextInput {...props} className="w-full px-3 py-2" />
            {error && <InputError message={error} />}
        </div>
    );
}
