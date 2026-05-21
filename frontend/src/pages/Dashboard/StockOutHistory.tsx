import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import CustomizedTable from "../../components/ui/Table";
import type { GetStockOutHistoryParams, StockOut } from "../../types/stockOut.type";
import { useMemo, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useGetStockOutHistory } from "../../hooks/stock-out/use-get-stock-outs.hook";
import Chip from "../../components/ui/Chip";
import { formatDate } from "../../utils/dateUtils";
import StockOutControls from "../../components/Inventory/StockOutControls";

const columns : ColumnDef<StockOut>[]= [
    {
        header: "Stock Out Id",
        accessorKey: 'stock_out_id',
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
        header: "Qty Used",
        cell: ({ row }) => `${row.original.unit !== 'pcs' ? row.original.quantity.toFixed(2) : row.original.quantity} ${row.original.unit.toUpperCase()}`,
        meta: { align: 'center'}
    },
    {
        header: 'Transaction Type',
        accessorKey: 'transaction_type',
        cell: info => (
            <Chip 
                className="capitalize"
                variant="default" 
                label={info.getValue() as string} 
            />
        ),
        meta: { align: 'center'}
    },
    {
        header: 'Date',
        accessorKey: 'createdAt',
        cell: info => formatDate(info.getValue() as string),
        meta: { align: 'center'}
    }
] 

export default function StockOutHistory () {
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState('');
    const debouncedSearch = useDebounce(search, 0.8);
    const [transactionType, setTransactionType] = useState('');
     const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const params = useMemo<GetStockOutHistoryParams>(() => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: debouncedSearch,
        category,
        startDate,
        endDate,
        transactionType,
    }), [pagination, debouncedSearch, category]);

    const { data, isFetching } = useGetStockOutHistory(params)

    return (
        <div className="space-y-3">
            <h1 className="font-bold text-lg">Stock Out</h1>
            <StockOutControls 
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                transactionType={transactionType}
                setTransactionType={setTransactionType}
                setPagination={setPagination}
            />
            <CustomizedTable 
                isLoading={isFetching}
                data={data?.stockOuts || []}
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