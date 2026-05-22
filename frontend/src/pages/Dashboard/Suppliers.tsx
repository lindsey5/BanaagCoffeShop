import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import type { ColumnDef, PaginationState, Row } from "@tanstack/react-table";
import { useGetSuppliers } from "../../hooks/supplier/use-get-supplier.hook";
import CustomizedTable from "../../components/ui/Table";
import type { Supplier } from "../../types/supplier.type";
import { formatDate } from "../../utils/dateUtils";
import { PERMISSIONS } from "../../config/permissions";
import IconButton from "../../components/ui/IconButton";
import { Pencil, Plus, Trash } from "lucide-react";
import usePermissions from "../../hooks/usePermissions";
import SupplierModal from "../../components/supplier/SupplierModal";
import SearchField from "../../components/ui/SearchField";
import Button from "../../components/ui/Button";
import { useDeleteSupplier } from "../../hooks/supplier/use-delete-supplier.hook";
import { promiseToast } from "../../utils/sileo";

interface GetColumnsParams {
    setSupplier: Dispatch<SetStateAction<Supplier | null>>;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    hasAnyPermissions: (permissions : string[]) => boolean;
    hasPermissions: (permissions : string[]) => boolean;
    handleDelete: (id: string) => void;
}

const getColumns = ({ setSupplier, setShowModal, handleDelete, hasAnyPermissions, hasPermissions } : GetColumnsParams) : ColumnDef<Supplier>[] => [
    {
        header: 'Code',
        accessorKey: 'code'
    },
    {
        header: "Name",
        accessorKey: 'name',
        meta: { align: 'center' }
    },
    {
        header: "Email",
        accessorKey: 'email',
        cell: info => info.getValue() ? info.getValue() : 'N/A',
        meta: { align: 'center' }
    },
    {
        header: "Phone",
        accessorKey: 'phone',
        cell: info => info.getValue() ? info.getValue() : 'N/A',
        meta: { align: 'center' }
    },
    {
        header: 'Date Created',
        cell: info => formatDate(info.getValue() as string),
        accessorKey: 'createdAt',
        meta: { align: 'center' }
    },
    ...(hasAnyPermissions([PERMISSIONS.INVENTORY_UPDATE, PERMISSIONS.INVENTORY_DELETE]) ? 
        [
            {
                header: "Action",
                cell: ({ row } : { row:  Row<Supplier>}) => (
                    <div className="flex items-center justify-center">
                        {hasPermissions([PERMISSIONS.INVENTORY_UPDATE]) && (
                            <IconButton
                                onClick={() => {
                                    setShowModal(true);
                                    setSupplier(row.original)
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

export default function Suppliers () {
    const deleteSupplierMutation = useDeleteSupplier();
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [showModal, setShowModal] = useState(false);

    const { hasAnyPermissions, hasPermissions } = usePermissions();

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 0.8);
    
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });

    const params = useMemo(() => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: debouncedSearch
    }), [debouncedSearch, pagination]);

    const { data, isFetching } = useGetSuppliers(params);

    const handleDelete = (id: string) => {
        const isConfirmed = confirm('Are you sure you want to delete this supplier?');

        if(!isConfirmed) return;

        promiseToast(deleteSupplierMutation.mutateAsync(id))
    }

    const onRowClick = (row : Supplier) => {
        if(!hasPermissions([PERMISSIONS.SUPPLIER_UPDATE])) return;
        
        setSupplier(row);
        setShowModal(true);
    }

    const handleClose = () => {
        setSupplier(null);
        setShowModal(false)
    }

    return (
        <div className="space-y-3">
            <h1 className="font-bold text-lg">Suppliers</h1>
            <SupplierModal 
                close={handleClose}
                show={showModal}
                supplier={supplier}
            />
            <div className="flex-1 flex gap-3 items-end justify-between">
                <SearchField
                    className="max-w-75 lg:max-w-100"
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPagination(prev => ({ ...prev, pageIndex: 0 }))
                    }}
                    value={search}
                    placeholder="Search suppliers (Code/Name/Email)"
                />
                {hasPermissions([PERMISSIONS.SUPPLIER_CREATE]) && (
                    <Button className="w-40 text-sm rounded-md" onClick={() => setShowModal(true)}>
                        <Plus size={18}/>
                        Create Supplier
                    </Button>
                )}
            </div>
            <CustomizedTable 
                isLoading={isFetching}
                data={data?.suppliers || []}
                columns={getColumns({ setSupplier, setShowModal, handleDelete, hasAnyPermissions, hasPermissions })}
                pagination={pagination}
                setPagination={setPagination}
                totalPages={data?.pagination.totalPages}
                showPagination
                noDataMessage="No Suppliers Found"
                total={data?.pagination.total}
                onRowClick={onRowClick}
            />
        </div>
    )
}