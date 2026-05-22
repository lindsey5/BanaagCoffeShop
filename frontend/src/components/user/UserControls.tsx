import type { PaginationState } from "@tanstack/react-table";
import type { Dispatch, SetStateAction } from "react";
import SearchField from "../ui/SearchField";
import { useGetRoles } from "../../hooks/role/use-get-roles.hook";
import Dropdown from "../ui/Dropdown";
import usePermissions from "../../hooks/usePermissions";
import { PERMISSIONS } from "../../config/permissions";
import Button from "../ui/Button";
import { Plus } from "lucide-react";

interface UserControlsProps{
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    role: string;
    setRole: Dispatch<SetStateAction<string>>;
    setPagination: Dispatch<SetStateAction<PaginationState>>;
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function UserControls ({ 
    search,
    setSearch,
    role,
    setRole,
    setPagination,
    setShowModal
} : UserControlsProps) {
    const { data } = useGetRoles();
    const { hasPermissions } = usePermissions();

    return (
        <div className="flex-1 flex gap-3 items-end justify-between">
            <SearchField
                className="max-w-60 lg:max-w-100"
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination(prev => ({ ...prev, pageIndex: 0 }))
                }}
                value={search}
                placeholder="Search user (Firstname/Lastname/Email)"
            />
            <div className="flex items-end gap-3">
                <Dropdown 
                    className="w-30"
                    onChange={(value) => {
                        setRole(value)
                        setPagination(prev => ({ ...prev, pageIndex: 0 }))
                    }}
                    options={[ { label: 'All', value: ''} ,...data?.roles.map(role => ({ label: role.name, value: role.name })) || []]}
                    value={role}
                    label="Role"
                />
                {hasPermissions([PERMISSIONS.USER_CREATE]) && (
                    <Button className="w-35 text-sm rounded-md" onClick={() => setShowModal(true)}>
                        <Plus size={18}/>
                        Create User
                    </Button>
                )}
            </div>
        </div>
    )
}