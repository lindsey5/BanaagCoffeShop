import { Search } from "lucide-react";
import TextField from "./Textfield";

interface SearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement>{
    onChange: React.ChangeEventHandler<HTMLInputElement, HTMLInputElement> | undefined;
    value: string;
    placeholder: string;
    className?: string;
}

export default function SearchField ({ onChange, value, placeholder, className, ...props } : SearchFieldProps) {
    return (
        <TextField 
            {...props}
            value={value}
            onChange={onChange}
            icon={<Search size={20}/>}
            placeholder={placeholder}
            className={className}
        />
    )
}