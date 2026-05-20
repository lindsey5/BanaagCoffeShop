import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { WhiteCard } from "../../components/ui/Card";
import PageContainer from "../../components/ui/PageContainer";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useDebounce } from "../../hooks/useDebounce";
import { useGetOrders } from "../../hooks/order/use-get-orders.hook";
import type { Order } from "../../types/order.type";
import CustomizedTable from "../../components/ui/Table";
import { formatToPeso } from "../../utils/utils";
import IconButton from "../../components/ui/IconButton";
import { Eye } from "lucide-react";
import Receipt from "../../components/shared/Receipt";
import SearchField from "../../components/ui/SearchField";
import Dropdown from "../../components/ui/Dropdown";
import DateInput from "../../components/ui/DateInput";
import FiltersMenu from "../../components/ui/FiltersMenu";
import { formatDate, formatLongDate } from "../../utils/dateUtils";

const paymentMethods = [
    { label: 'All', value: '' }, 
    { label: 'Cash', value: 'cash' },
    { label: 'E-Wallet', value: 'e-wallet' },
    { label: 'Card', value: 'card' }
]

const getColumns = (setOrder : Dispatch<SetStateAction<Order | null>>) : ColumnDef<Order>[] => [
    {
        header: "Order #",
        accessorKey: 'order_no',
    },
    {
        header: 'Order ID',
        accessorKey: 'order_id',
        meta: { align: 'center' }
    },
    {
        header: 'Customer Name',
        accessorKey: 'customer_name',
        meta: { align: 'center' }
    },
    {
        header: 'Payment Method',
        accessorKey: 'payment_method',
        cell: info => (info.getValue() as string).toUpperCase(),
        meta: { align: 'center' }
    },
    {
        header: 'Total Items',
        cell: ({ row }) => row.original.orderItems.length,
        meta: { align: 'center' }
    },
    {
        header: 'Total',
        accessorKey: 'grandTotal',
        cell: info => formatToPeso(Number(info.getValue())),
        meta: { align: 'center' }
    },
    {
        header: 'Date',
        accessorKey: 'createdAt',
        cell: info => formatLongDate(info.getValue() as string),
        meta: { align: 'center' }
    },
    {
        header: 'Action',
        cell: ({ row }) => (
            <div className="flex justify-center">
                <IconButton icon={<Eye size={20}/>} onClick={() => setOrder(row.original)}/>
            </div>
        ),
        meta: { align: 'center' }
    }
]  

export default function Orders () {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 0.8);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [paymentMethod, setPaymentMethod] = useState('');

    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
     
    const [order, setOrder] = useState<Order | null>(null);

    const params = useMemo(() => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: debouncedSearch,
        paymentMethod: paymentMethod,
        startDate,
        endDate
    }), [pagination, debouncedSearch, paymentMethod, startDate, endDate]);

    const { data, isFetching } = useGetOrders(params);

    const onRowClick = (row: Order) => {
        setOrder(row)
    }

    return (
        <PageContainer title="Order History" description="View all POS order history">
            <Receipt 
                order={order}
                close={() => setOrder(null)}
                show={order !== null}
            />
            <WhiteCard className="space-y-5">
                <div className="flex-1 flex gap-3 items-end justify-between">
                    <SearchField
                        className="max-w-50 lg:max-w-100"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        placeholder="Search orders..."
                    />

                    <div className="lg:flex gap-3 items-center hidden">
                        <Dropdown 
                            className="w-40"
                            onChange={(value) => setPaymentMethod(value)}
                            options={paymentMethods}
                            value={paymentMethod}
                            label="Payment Method"
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
                            onChange={(value) => setPaymentMethod(value)}
                            options={paymentMethods}
                            value={paymentMethod}
                            label="Payment Method"
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
                    data={data?.orders || []}
                    columns={getColumns(setOrder)}
                    pagination={pagination}
                    setPagination={setPagination}
                    totalPages={data?.pagination.totalPages}
                    showPagination
                    noDataMessage="No Orders Found"
                    total={data?.pagination.total}
                    onRowClick={onRowClick}
                />
            </WhiteCard>
        </PageContainer>
    )
}