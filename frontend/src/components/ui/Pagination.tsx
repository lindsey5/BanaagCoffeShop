import { type Table } from "@tanstack/react-table";
import { cn } from "../../utils/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationButtonProps {
    onClick: () => void;
    disabled?: boolean;
    tooltip?: string;
    children: React.ReactNode;
    className?: string;
}

export const PaginationButton = ({
    onClick,
    disabled = false,
    tooltip,
    children,
    className = "",
}: PaginationButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "disabled:text-gray disabled:opacity-50 disabled:cursor-not-allowed relative group",
                !disabled && 'cursor-pointer',
                className
            )}
        >
            {tooltip && !disabled && (
                <span className="pointer-events-none select-none absolute -top-full left-1/2 transform -translate-x-1/2 ml-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition">
                    {tooltip}
                </span>
            )}
            {children}
        </button>
    );
};

interface PaginationControlsProps<T> {
    table: Table<T>;
    total: number;
}

export const PaginationControls = <T,>({ table, total }: PaginationControlsProps<T>) => {
    const { pageIndex, pageSize } = table.getState().pagination;
    const pageCount = table.getPageCount();

    const delta = 2;

    const getPageNumbers = () => {
        const range: (number | string)[] = [];
        const left = Math.max(0, pageIndex - delta);
        const right = Math.min(pageCount - 1, pageIndex + delta);

        for (let i = 0; i < pageCount; i++) {
            if (i === 0 || i === pageCount - 1 || (i >= left && i <= right)) {
                range.push(i);
            } else if (range[range.length - 1] !== "...") {
                range.push("...");
            }
        }

        return range;
    };

    const startRow = pageIndex * pageSize + 1;
    const endRow = Math.min((pageIndex + 1) * pageSize, total);

    return (
        <div className="flex items-center justify-between gap-3 mt-10 lg:text-sm xxl:text-md text-black flex-wrap">
            <div className="flex items-center gap-2">
                <span className="text-xs xl:text-sm">Rows per page:</span>
                <select
                    value={pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-xs xl:text-sm"
                >
                    {[5, 10, 20, 50, 100].map((size) => (
                        <option key={size} value={size} className="bg-panel">
                        {size}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-5">
                <div className="text-xs xl:text-sm">
                    Showing {startRow} - {endRow} of {total}
                </div>
                {/* Pagination buttons */}
                <div className="flex items-center justify-end gap-2 flex-wrap">
                    <PaginationButton
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        tooltip="Prev"
                    >
                        <ChevronLeft 
                            className={cn(
                                table.getCanPreviousPage() && "hover:text-brown"
                            )}
                        />
                    </PaginationButton>

                    {/* Page numbers */}
                    {getPageNumbers().map((p, idx) =>
                        typeof p === "number" ? (
                            <button
                                key={idx}
                                onClick={() => table.setPageIndex(p)}
                                className={cn(
                                    "text-sm w-7 h-7 cursor-pointer rounded-full",
                                    p === pageIndex
                                    ? "bg-gold font-semibold bg-brown text-white"
                                    : "hover:bg-brown"
                                )}
                            >
                            {p + 1}
                            </button>
                        ) : (
                            <span key={idx} className="px-2 py-1 text-muted">{p}</span>
                        )
                    )}
                    <PaginationButton
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        tooltip="Next"
                    >
                        <ChevronRight 
                            className={cn(
                                table.getCanNextPage() && "hover:text-gold"
                            )}
                        />
                    </PaginationButton>
                </div>
            </div>
        </div>
    );
};