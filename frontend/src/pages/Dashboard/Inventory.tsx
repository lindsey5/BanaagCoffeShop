import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Pencil, Trash } from "lucide-react";
import type { ColumnDef, PaginationState, Row } from "@tanstack/react-table";
import type { GetInventoryParams, InventoryItem } from "../../types/inventory.type";
import CustomizedTable from "../../components/ui/Table";
import InventoryItemModal from "../../components/Inventory/InventoryItemModal";
import { useGetInventory } from "../../hooks/inventory/use-get-inventory.hook";
import { useDebounce } from "../../hooks/useDebounce";
import IconButton from "../../components/ui/IconButton";
import type { SortOption } from "../../types/types";
import { formatDate } from "../../utils/dateUtils";
import Chip from "../../components/ui/Chip";
import { useDeleteInventory } from "../../hooks/inventory/use-delete-inventory.hook";
import { promiseToast } from "../../utils/sileo";
import InventoryControls from "../../components/Inventory/InventoryControls";
import usePermissions from "../../hooks/usePermissions";
import { PERMISSIONS } from "../../config/permissions";

const getStockStatus = (inventoryItem: InventoryItem) : { label: string, variant: "success" | "warning" | "danger" | "default" } => {
    if (inventoryItem.quantity <= 0) {
        return { label: "Out of Stock", variant: "danger" };
    }

    if (inventoryItem.quantity < inventoryItem.threshold) {
        return { label: "Low Stock", variant: "warning" };
    }

    return { label: "In Stock", variant: "success" };
};

interface GetColumnsParams {
    setInventoryItem: Dispatch<SetStateAction<InventoryItem | null>>;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    hasAnyPermissions: (permissions : string[]) => boolean;
    hasPermissions: (permissions : string[]) => boolean;
    handleDelete: (id: string) => void;
}

const getColumns = ({ setInventoryItem, setShowModal, handleDelete, hasAnyPermissions, hasPermissions } : GetColumnsParams) : ColumnDef<InventoryItem>[] => [
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
        header: "Brand",
        accessorKey: 'brand',
        meta: { align: 'center' }
    },
    {
        header: "Category",
        accessorKey: 'category',
        meta: { align: 'center' }
    },
    {
        header: "Stock",
        cell: ({ row }) => `${row.original.quantity.toFixed(2)} ${row.original.unit.toUpperCase()}`,
        meta: { align: 'center' }
    },
    {
        header: "Threshold",
        accessorKey: 'threshold',
        meta: { align: 'center' }
    },
    {
        header: 'Date Created',
        cell: info => formatDate(info.getValue() as string),
        accessorKey: 'createdAt',
        meta: { align: 'center' }
    },
    {
        header: 'Status',
        cell: ({ row }) => {
            const status = getStockStatus(row.original);

            return <Chip label={status.label} variant={status.variant} />
        },
        meta: { align: 'center' }
    },
    ...(hasAnyPermissions([PERMISSIONS.INVENTORY_UPDATE, PERMISSIONS.INVENTORY_DELETE]) ? 
        [
            {
                header: "Action",
                cell: ({ row } : { row:  Row<InventoryItem>}) => (
                    <div className="flex items-center justify-center">
                        {hasPermissions([PERMISSIONS.INVENTORY_UPDATE]) && (
                            <IconButton 
                                onClick={() => {
                                    setShowModal(true);
                                    setInventoryItem(row.original)
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

export default function Inventory() {
    const deleteInventoryMutation = useDeleteInventory();
    const { hasAnyPermissions, hasPermissions } = usePermissions();
    const [inventoryItem, setInventoryItem] = useState<InventoryItem | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState('');
    const debouncedSearch = useDebounce(search, 0.8);
    const [filter, setFilter] = useState<SortOption>({
        sort: 'createdAt',
        order: 'desc'
    })

    const params = useMemo<GetInventoryParams>(() => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        order: filter.order,
        sort: filter.sort,
        search: debouncedSearch,
        category,
    }), [pagination, filter, debouncedSearch, category]);

    const { data, isFetching } = useGetInventory(params);

    const handleClose = () => {
        setShowModal(false);
        setInventoryItem(null);
    }

    const onRowClick = (row: InventoryItem) => {
        setInventoryItem(row);
        setShowModal(true);
    }

    const handleDelete = (id : string) => {
        const isConfirmed = confirm('Are you sure you want to delete this item?');

        if(!isConfirmed) return;

        promiseToast(deleteInventoryMutation.mutateAsync(id))
    }

    return (
        <div className="space-y-3">
            <h1 className="font-bold text-lg">Inventory List</h1>
            <InventoryControls 
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                filter={filter}
                setFilter={setFilter}
                setShowModal={setShowModal}
            />
            <CustomizedTable 
                isLoading={isFetching}
                data={data?.inventoryItems || []}
                columns={getColumns({ setInventoryItem, setShowModal, handleDelete, hasAnyPermissions, hasPermissions })}
                pagination={pagination}
                setPagination={setPagination}
                totalPages={data?.pagination.totalPages}
                showPagination
                noDataMessage="No Items Found"
                total={data?.pagination.total}
                onRowClick={onRowClick}
            />
            <InventoryItemModal 
                close={handleClose}
                inventoryItem={inventoryItem}
                show={showModal}
            />
        </div>
    );
}