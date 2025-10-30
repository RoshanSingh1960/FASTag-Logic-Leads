import React, { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, ...props }) => {
    const inputId = id || label.toLowerCase().replace(/\s/g, '-');
    return (
        <div className="mb-4">
            <label htmlFor={inputId} className="block text-gray-700 text-sm font-bold mb-2">
                {label}
            </label>
            <input
                id={inputId}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                {...props}
            />
        </div>
    );
};

export default InputField;