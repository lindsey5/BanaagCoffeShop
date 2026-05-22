import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import PageContainer from "../../components/ui/PageContainer";
import CustomizedTable from "../../components/ui/Table";
import { useDebounce } from "../../hooks/useDebounce";
import type { ColumnDef, PaginationState, Row } from "@tanstack/react-table";
import { useGetUsers } from "../../hooks/user/use-get-users.hook";
import { PERMISSIONS } from "../../config/permissions";

import IconButton from "../../components/ui/IconButton";
import { Pencil, Trash } from "lucide-react";
import type { GetUser } from "../../types/user.type";
import usePermissions from "../../hooks/usePermissions";
import Chip from "../../components/ui/Chip";
import { WhiteCard } from "../../components/ui/Card";
import { formatDate } from "../../utils/dateUtils";
import UserModal from "../../components/user/UserModal";
import UserControls from "../../components/user/UserControls";
import { useDeleteUser } from "../../hooks/user/use-delete-user.hook";
import { promiseToast } from "../../utils/sileo";

interface GetColumnsParams {
    setUser: Dispatch<SetStateAction<GetUser | null>>;
    hasAnyPermissions: (permissions : string[]) => boolean;
    hasPermissions: (permissions : string[]) => boolean;
    handleDelete: (id: string) => void;
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

const getColumns = ({ setUser, handleDelete, hasAnyPermissions, hasPermissions, setShowModal } : GetColumnsParams) : ColumnDef<GetUser>[] => [
    {
        header: "Firstname",
        accessorKey: 'firstname',
    },
    {
        header: "Lastname",
        accessorKey: 'lastname',
        meta: { align: 'center' }
    },
    {
        header: "Email",
        accessorKey: 'email',
        meta: { align: 'center' }
    },
    {
        header: "Role",
        accessorKey: 'role.name',
        cell: info => <Chip label={info.getValue() as string}/>,
        meta: { align: 'center' }
    },
    {
        header: 'Date created',
        accessorKey: 'createdAt',
        cell: info => formatDate(info.getValue() as string),
        meta: { align: 'center' }
    },
    ...(hasAnyPermissions([PERMISSIONS.USER_UPDATE, PERMISSIONS.USER_DELETE]) ? 
        [
            {
                header: "Action",
                cell: ({ row } : { row:  Row<GetUser>}) => (
                    <div className="flex items-center justify-center">
                        {hasPermissions([PERMISSIONS.INVENTORY_UPDATE]) && (
                            <IconButton 
                                onClick={() => {
                                    setShowModal(true);
                                    setUser(row.original)
                                }}
                                icon={<Pencil size={18} />}
                            />
                        )}
                        {hasPermissions([PERMISSIONS.INVENTORY_DELETE]) && (
                            <IconButton 
                                onClick={() => handleDelete(row.original._id)}
                                variant="danger" 
                                icon={<Trash size={18}/>} 
                            />
                        )}
                    </div>
                ),
                meta: { align: 'center' }
            }
        ]
    : [])
]  

export default function Users () {
    const deleteUserMutation = useDeleteUser();
    const { hasAnyPermissions, hasPermissions } = usePermissions();

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 0.8);

    const [role, setRole] = useState("");

    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    const [user, setUser] = useState<GetUser | null>(null);
    const [showModal, setShowModal] = useState(false);

    const params = useMemo(() => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: debouncedSearch,
        role,
    }), [pagination, debouncedSearch, role]);
    
    const { data, isFetching } = useGetUsers(params);

    const handleDelete = (id: string) => {
        const isConfirmed = confirm('Are you sure you want to delete this user?');

        if(!isConfirmed) return;

        promiseToast(deleteUserMutation.mutateAsync(id))
    }

    const onRowClick = (row : GetUser) => {
        if(!hasPermissions([PERMISSIONS.USER_UPDATE])) return;
        setShowModal(true);
        setUser(row);
    }

    const handleClose = () => {
        setUser(null);
        setShowModal(false);
    }

    return (
        <PageContainer
            title="User Management"
            description="View and manage all users"
        >
            <UserModal 
                show={showModal}
                close={handleClose}
                user={user}
            />
            <WhiteCard className="space-y-5">
                <UserControls 
                    search={search}
                    setSearch={setSearch}
                    role={role}
                    setRole={setRole}
                    setPagination={setPagination}
                    setShowModal={setShowModal}
                />
                <CustomizedTable 
                    isLoading={isFetching}
                    data={data?.users || []}
                    columns={getColumns({ 
                        handleDelete,
                        hasAnyPermissions,
                        hasPermissions,
                        setUser,
                        setShowModal
                    })}
                    pagination={pagination}
                    setPagination={setPagination}
                    totalPages={data?.pagination.totalPages}
                    showPagination
                    noDataMessage="No Users Found"
                    total={data?.pagination.total}
                    onRowClick={onRowClick}
                />
            </WhiteCard>
        </PageContainer>
    )
}