import { Search } from "lucide-react";
import TextField from "./Textfield";

interface SearchFieldProps {
    onChange: React.ChangeEventHandler<HTMLInputElement, HTMLInputElement> | undefined;
    value: string;
    placeholder: string;
    className?: string;
}

export default function SearchField ({ onChange, value, placeholder, className } : SearchFieldProps) {
    return (
        <TextField 
            value={value}
            onChange={onChange}
            icon={<Search size={20}/>}
            placeholder={placeholder}
            className={className}
        />
    )
}