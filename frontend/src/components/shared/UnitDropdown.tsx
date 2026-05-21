import { useEffect, useState } from "react";
import type { InventoryItem } from "../../types/inventory.type";
import { units } from "../../lib/contants/menu";
import Dropdown from "../ui/Dropdown";

interface UnitDropdownProps {
    onChange: (value : string) => void; 
    value: string;
    item: InventoryItem;
    error?: string;
}

export default function UnitDropdown ({ item, onChange, value, error } : UnitDropdownProps) {
    const [options, setOptions] = useState<{ label: string, value: string}[]>([]);

    useEffect(() => {
        if(item){
            let options : string[] = [];
            if(item.unit === 'kg') {
                options = units.filter(unit => ['kg', 'g'].includes(unit))
            }else if(item.unit === 'g') {
                options = units.filter(unit => unit === 'g')
            }else if(item.unit === 'l') {
                options = units.filter(unit => ['l', 'ml'].includes(unit))
            }else if(item.unit === 'ml') {
                options = units.filter(unit => unit === 'ml')
            }else {
                options = units.filter(unit => unit === 'pcs')
            }

            setOptions(options.map(opt => ({ label: opt, value: opt })))
        }

    }, [item])

    return (
        <Dropdown 
            options={options}
            onChange={(value) => onChange(value)}
            value={value}
            label="Unit"
            className="min-w-20"
            error={error}
        />
    )
}