import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import SearchField from "../../components/ui/SearchField";
import Button from "../../components/ui/Button";
import { Pencil, Plus, Trash } from "lucide-react";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import type { GetInventoryParams, InventoryItem } from "../../types/inventory.type";
import CustomizedTable from "../../components/ui/Table";
import InventoryItemModal from "../../components/Inventory/InventoryItemModal";
import { useGetInventory } from "../../hooks/inventory/use-get-inventory.hook";
import { useDebounce } from "../../hooks/useDebounce";
import Dropdown from "../../components/ui/Dropdown";
import IconButton from "../../components/ui/IconButton";
import { getKeyByValue } from "../../utils/utils";
import type { SortOption } from "../../types/types";
import { formatDate } from "../../utils/dateUtils";
import FiltersMenu from "../../components/ui/FiltersMenu";
import { categoryOptions } from "../../lib/contants/category";

interface GetColumnsParams {
    setInventoryItem: Dispatch<SetStateAction<InventoryItem | null>>;
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

const getColumns = ({ setInventoryItem, setShowModal } : GetColumnsParams) : ColumnDef<InventoryItem>[] => [
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
        cell: ({ row }) => `${row.original.quantity} ${row.original.unit}`,
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
        header: "Action",
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <IconButton 
                    onClick={() => {
                        setShowModal(true);
                        setInventoryItem(row.original)
                    }}
                    icon={<Pencil size={18} />}
                />
                <IconButton variant="danger" icon={<Trash size={18}/>} />
            </div>
        ),
        meta: { align: 'center' }
    }
]  

const filterOptions :  Record<string, SortOption> = {
    'Newest': { sort: 'createdAt', order: 'desc' },
    'Oldest': { sort: 'createdAt', order: 'asc' },
}

export default function Inventory() {
    const [inventoryItem, setInventoryItem] = useState<InventoryItem | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState('');
    const debouncedSearch = useDebounce(search, 0.8);
    const [filter, setFilter] = useState({
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
        setInventoryItem(row)
    }

    return (
        <div className="space-y-5">
            <h1 className="font-bold text-lg">Inventory List</h1>
            <div className="flex-1 flex gap-3 items-center justify-between">
                <SearchField
                    className="max-w-50 lg:max-w-100"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    placeholder="Search inventory items..."
                />
                <div className="flex items-center gap-3">
                    <div className="lg:flex gap-3 items-center hidden">
                        <Dropdown 
                            className="w-40"
                            onChange={(value) => setCategory(value)}
                            options={[{ label: 'All', value: '' }, ...categoryOptions]}
                            value={category}
                        />
                        <Dropdown 
                            onChange={(value) => setFilter(filterOptions[value])}
                            options={Object.keys(filterOptions).map(opt => ({ label: opt, value: opt }))}
                            value={getKeyByValue(filterOptions, filter) || ""}
                        />
                    </div>
                    <Button className="w-30 text-sm rounded-md" onClick={() => setShowModal(true)}>
                        <Plus size={18}/>
                        Add Item
                    </Button>
                    <FiltersMenu 
                        className="lg:hidden"
                        containerStyle="space-y-3"
                    >
                        <Dropdown 
                            onChange={(value) => setCategory(value)}
                            options={[{ label: 'All', value: '' }, ...categoryOptions]}
                            value={category}
                            label="Category"
                        />
                        <Dropdown 
                            onChange={(value) => setFilter(filterOptions[value])}
                            options={Object.keys(filterOptions).map(opt => ({ label: opt, value: opt }))}
                            value={getKeyByValue(filterOptions, filter) || ""}
                            label="Sort"
                        />
                    </FiltersMenu>
                </div>
            </div>
            <CustomizedTable 
                isLoading={isFetching}
                data={data?.inventoryItems || []}
                columns={getColumns({ setInventoryItem, setShowModal })}
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