import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type PaginationState, type Row, type Table } from "@tanstack/react-table"
import { PaginationControls } from "./Pagination";
import { cn } from "../../utils/utils";

type TableRowProps<T> = {
    row: Row<T>;
    onRowClick?: (row : T) => void;
    index: number;
}

const TableRow = <T,>({ row, onRowClick, index }: TableRowProps<T>) => {
    return (
        <tr 
            onClick={(e) => {
                e.stopPropagation();
                onRowClick?.(row.original)
            }} 
            className={onRowClick && 'cursor-pointer'}
        >
        {row.getVisibleCells().map(cell => {
            const align = (cell.column.columnDef.meta as any)?.align || 'left';
            return (
            <td
                key={cell.id}
                className={cn(
                    `min-w-30 p-3 text-${align} border-b border-gray-400`,
                    index % 2 === 0 ? 'bg-row-even' : 'bg-row-odd'
                )}
            >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
            );
        })}
        </tr>
    );
};

const TableRows = <T, > ({ table, onRowClick } : { table : Table<T>, onRowClick?: (row: T) => void }) => {
    return (
        <tbody>
            {table.getRowModel().rows.map((row, i) => <TableRow key={i} row={row} onRowClick={onRowClick} index={i + 1}/>)}
        </tbody>
    )
}

const TableColumns = <T,>({ table }: { table: Table<T> }) => {
    return (
        <thead>
        {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => {
                const align = (header.column.columnDef.meta as any)?.align || 'left';
                return (
                <th
                    key={header.id}
                    className={`text-gold border-b p-3 font-bold sticky top-0 text-white bg-[#603F26] z-5`}
                    style={{ textAlign: align }}
                >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
                );
            })}
            </tr>
        ))}
        </thead>
    );
};

type TableSkeletonProps = {
    columns: number;
    rows?: number;
};

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
    columns,
    rows = 10,
}) => {
    return (
        <div className="max-h-screen flex flex-col animate-pulse">
            <div className="overflow-auto flex-grow">
                <table className="w-full border-collapse text-sm">

                    {/* HEADER SKELETON */}
                    <thead className="sticky top-0 z-10">
                        <tr>
                            {Array.from({ length: columns }).map((_, idx) => (
                                <th
                                    key={idx}
                                    className="p-3 bg-[var(--bg-main)] border-b border-gray-400"
                                >
                                    <div className="h-5 w-full mx-auto rounded bg-[var(--bg-loading)]" />
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* BODY SKELETON */}
                    <tbody>
                        {Array.from({ length: rows }).map((_, rowIdx) => (
                            <tr
                                key={rowIdx}
                                className={cn(
                                    "hover:bg-row-hover border-gray-400",
                                    rowIdx % 2 === 0 ? "bg-row-even" : "bg-row-odd"
                                )}
                            >
                                {Array.from({ length: columns }).map((_, colIdx) => (
                                    <td
                                        key={colIdx}
                                        className="p-3 border-b border-[var(--border-light)]"
                                    >
                                        <div
                                            className="h-5 w-full rounded bg-[var(--bg-loading)]"
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

type CustomTableProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];         
    totalPages?: number;
    pagination?: PaginationState;
    setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>;
    isLoading: boolean;
    showPagination: boolean;
    total?: number;
    noDataMessage?: string;
    className?: string;
    onRowClick?: (row : T) => void;
};

const CustomizedTable = <T,>({ 
    data,
    totalPages,
    pagination,
    setPagination,
    columns,
    isLoading, 
    showPagination, 
    total,
    className,
    noDataMessage = "No Data Available",
    onRowClick
} : CustomTableProps<T>) => {
    const table = useReactTable({
        data,
        columns,
        pageCount: totalPages,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });
    const rows = table.getRowModel().rows;
    const cols = table.getAllColumns().length;

    return (
        <div className={cn(
            "max-h-screen flex flex-col",
            className
        )}>
            {rows.length < 1 && !isLoading ? <div className="text-center my-20 text-muted font-bold">
                {noDataMessage}
            </div> :
            isLoading ? 
                <TableSkeleton columns={cols}/>
            : 
                <>
                <div className="overflow-auto flex-grow relative">
                    <table className="w-full text-sm">
                        <TableColumns table={table} />
                        <TableRows table={table} onRowClick={onRowClick}/>
                    </table>
                </div>
                {showPagination && rows.length > 0 && <PaginationControls total={total || 0} table={table} />}
                </>
            }
        </div>
    );
};

export default CustomizedTable;