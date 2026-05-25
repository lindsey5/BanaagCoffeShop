import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import usePermissions from "../../hooks/usePermissions";
import { useDebounce } from "../../hooks/useDebounce";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import type { PurchaseOrder } from "../../types/purchaseOrder.type";
import IconButton from "../../components/ui/IconButton";
import { Eye, Plus } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import Chip from "../../components/ui/Chip";
import { useGetPurchaseOrders } from "../../hooks/purchase-order/use-get-purchase-orders.hook";
import CustomizedTable from "../../components/ui/Table";
import SearchField from "../../components/ui/SearchField";
import Dropdown from "../../components/ui/Dropdown";
import FiltersMenu from "../../components/ui/FiltersMenu";
import DateInput from "../../components/ui/DateInput";
import { PERMISSIONS } from "../../config/permissions";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import PurchaseOrderModal from "../../components/purchase-order/PurchaseOrderModal";
import { formatToPeso } from "../../utils/utils";

const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Received', value: 'received' },
    { label: 'Cancelled', value: 'cancelled' }
]

function PurchaseOrderStatus ({ status } : { status : string }) {
    if(status === 'received'){
        return <Chip className="capitalize" label={status} variant="success" />
    }else if(status === 'cancelled'){
        return <Chip className="capitalize" label={status} variant="danger" />
    }
    return <Chip className="capitalize" label={status} />
}

interface GetColumnsParams {
    setPurchaseOrder: Dispatch<SetStateAction<PurchaseOrder | null>>;
}

const getColumns = ({ setPurchaseOrder } : GetColumnsParams) : ColumnDef<PurchaseOrder>[] => [
    {
        header: 'PO #',
        accessorKey: 'poNumber'
    },
    {
        header: "Supplier",
        accessorKey: 'supplier.name',
        meta: { align: 'center' }
    },
    {
        header: "Total Items",
        cell: ({ row }) => row.original.items.length,
        meta: { align: 'center' }
    },
    {
        header: "Status",
        accessorKey: 'status',
        cell: info => <PurchaseOrderStatus status={info.getValue() as string} />,
        meta: { align: 'center' }
    },
    {
        header: 'Date Created',
        cell: info => formatDate(info.getValue() as string),
        accessorKey: 'createdAt',
        meta: { align: 'center' }
    },
    {
        header: 'Date Received',
        accessorKey: 'dateReceived',
        cell: info => info.getValue() ? formatDate(info.getValue() as string) : 'N/A',
        meta: { align: 'center' }
    },
    {
        header: "Total Cost",
        cell: ({ row }) => formatToPeso(row.original.grandTotal),
        meta: { align: 'center' }
    },
    {
        header: "Action",
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <IconButton
                    onClick={() => setPurchaseOrder(row.original)}
                    icon={<Eye size={18} />}
                />
            </div>
        ),
        meta: { align: 'center' }
    }
]  

export default function PurchaseOrders () {
    const navigate = useNavigate();
    const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
    const { hasPermissions } = usePermissions();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [status, setStatus] = useState("");

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 0.8);
    
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });

    const params = useMemo(() => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: debouncedSearch,
        startDate,
        endDate,
        status
    }), [debouncedSearch, pagination, startDate, endDate, status]);

    const { data, isFetching } = useGetPurchaseOrders(params);

    const onRowClick = (row : PurchaseOrder) => {
        setPurchaseOrder(row);
    }

    return (
        <div className="space-y-3">
            <PurchaseOrderModal 
                close={() => setPurchaseOrder(null)}
                show={purchaseOrder !== null}
                purchaseOrder={purchaseOrder}
            />
            <h1 className="font-bold text-lg">Purchase Orders</h1>
            <div className="flex-1 flex gap-3 items-end justify-between">
                <SearchField
                    className="max-w-80 lg:max-w-100"
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPagination(prev => ({ ...prev, pageIndex: 0 }))
                    }}
                    value={search}
                    placeholder="Search purchase orders (PO # / Supplier)"
                />

                <div className="flex items-end gap-3">
                    <div className="lg:flex gap-3 items-center hidden">
                        <Dropdown 
                            className="w-40"
                            onChange={(value) => {
                                setStatus(value);
                                setPagination(prev => ({ ...prev, pageIndex: 0 }))
                            }}
                            options={statusOptions}
                            value={status}
                            label="Status"
                        />
                        <DateInput 
                            label="From"
                            onChange={(value) => {
                                setPagination(prev => ({ ...prev, pageIndex: 0 }));
                                setStartDate(value);
                            }}
                        />

                        <DateInput 
                            label="To"
                            onChange={(value) => {
                                setPagination(prev => ({ ...prev, pageIndex: 0 }));
                                setEndDate(value);
                            }}
                        />
                    </div>
                    <FiltersMenu 
                        className="lg:hidden"
                        containerStyle="space-y-3"
                    >
                        <Dropdown 
                            onChange={(value) => { 
                                setStatus(value);
                                setPagination(prev => ({ ...prev, pageIndex: 0 }))
                            }}
                            options={statusOptions}
                            value={status}
                            label="Status"
                        />
                        <DateInput 
                            label="From"
                            onChange={(value) => {
                                setPagination(prev => ({ ...prev, pageIndex: 0 }));
                                setStartDate(value);
                            }}
                        />

                        <DateInput 
                            label="To"
                            onChange={(value) => {
                                setPagination(prev => ({ ...prev, pageIndex: 0 }));
                                setEndDate(value);
                            }}
                        />
                    </FiltersMenu>
                    {hasPermissions([PERMISSIONS.PURCHASE_ORDER_CREATE]) && (
                        <Button className="w-50 text-sm rounded-md" onClick={() => navigate('/dashboard/purchase-order/create')}>
                            <Plus size={18}/>
                            Create Purchase Order
                        </Button>
                    )}
                </div>
            </div>
            <CustomizedTable 
                isLoading={isFetching}
                data={data?.purchaseOrders || []}
                columns={getColumns({ setPurchaseOrder})}
                pagination={pagination}
                setPagination={setPagination}
                totalPages={data?.pagination.totalPages}
                showPagination
                noDataMessage="No Purchase Orders Found"
                total={data?.pagination.total}
                onRowClick={onRowClick}
            />
        </div>
    )
}