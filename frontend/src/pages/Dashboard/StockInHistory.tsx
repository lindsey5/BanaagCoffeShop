import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import CustomizedTable from "../../components/ui/Table";
import { useMemo, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import Chip from "../../components/ui/Chip";
import { formatDate } from "../../utils/dateUtils";
import type { GetStockInHistoryParams, StockIn } from "../../types/stockIn.type";
import { useGetStockInHistory } from "../../hooks/stock-in/use-get-stock-ins.hook";
import { formatToPeso } from "../../utils/utils";
import SearchField from "../../components/ui/SearchField";
import Dropdown from "../../components/ui/Dropdown";
import { categoryOptions } from "../../lib/contants/inventory";
import DateInput from "../../components/ui/DateInput";
import FiltersMenu from "../../components/ui/FiltersMenu";

const columns : ColumnDef<StockIn>[]= [
    {
        header: "Stock In Id",
        accessorKey: 'stock_in_id',
    },
    {
        header: "Item Name",
        accessorKey: 'inventoryItem.name',
        meta: { align: 'center' }
    },
    {
        header: 'Category',
        accessorKey: 'inventoryItem.category',
        meta: { align: 'center' }
    },
    {
        header: 'Supplier',
        accessorKey: 'supplier.name',
        meta: { align: 'center' }
    },
    {
        header: "Qty Received",
        cell: ({ row }) => <Chip label={ `+${row.original.unit !== 'pcs' ? row.original.quantity.toFixed(2) : row.original.quantity} ${row.original.unit.toUpperCase()}`}/>,
        meta: { align: 'center'}
    },
    {
        header: 'Unit Cost',
        accessorKey: "unit_cost",
        cell: info => formatToPeso(Number(info.getValue())),
        meta: { align: 'center'}
    },
    {
        header: 'Total Cost',
        accessorKey: "total_cost",
        cell: info => formatToPeso(Number(info.getValue())),
        meta: { align: 'center'}
    },
    {
        header: 'Date Received',
        accessorKey: 'createdAt',
        cell: info => formatDate(info.getValue() as string),
        meta: { align: 'center'}
    }
] 

export default function StockInHistory () {
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 0.8);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [category, setCategory] = useState('');

    const params = useMemo<GetStockInHistoryParams>(() => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: debouncedSearch,
        startDate,
        endDate,
        category
    }), [pagination, debouncedSearch, startDate, endDate, category]);

    const { data, isFetching } = useGetStockInHistory(params)

    return (
        <div className="space-y-3">
            <h1 className="font-bold text-lg">Stock In</h1>
            <div className="flex-1 flex gap-3 items-end justify-between">
                <SearchField
                    className="max-w-50 lg:max-w-100"
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPagination(prev => ({ ...prev, pageIndex: 0 }))
                    }}
                    value={search}
                    placeholder="Search stock in (Stock In Id / Item Name / Supplier)"
                />

                <div className="lg:flex gap-3 items-center hidden">
                    <Dropdown 
                        className="w-40"
                        onChange={(value) => {
                            setCategory(value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }))
                        }}
                        options={[{ label: 'All', value: '' }, ...categoryOptions]}
                        value={category}
                        label="Category"
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
                            setCategory(value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }))
                        }}
                        options={[{ label: 'All', value: '' }, ...categoryOptions]}
                        value={category}
                        label="Category"
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
            </div>
            <CustomizedTable 
                isLoading={isFetching}
                data={data?.stockIns || []}
                columns={columns}
                pagination={pagination}
                setPagination={setPagination}
                totalPages={data?.pagination.totalPages}
                showPagination
                noDataMessage="No Items Found"
                total={data?.pagination.total}
            />
        </div>
    )
}