import { useMemo, useState } from "react";
import { WhiteCard } from "../../components/ui/Card";
import PageContainer from "../../components/ui/PageContainer";
import { useGetMenus } from "../../hooks/menu/use-get-menus.hook";
import type { ColumnDef, PaginationState, Row } from "@tanstack/react-table";
import { useDebounce } from "../../hooks/useDebounce";
import type { SortOption } from "../../types/types";
import CustomizedTable from "../../components/ui/Table";
import { type Menu } from "../../types/menu.type";
import { formatToPeso } from "../../utils/utils";
import { Pencil, Trash } from "lucide-react";
import MenuModal from "../../components/menu/MenuModal";
import Chip from "../../components/ui/Chip";
import IconButton from "../../components/ui/IconButton";
import { PERMISSIONS } from "../../config/permissions";
import usePermissions from "../../hooks/usePermissions";
import { useDeleteMenu } from "../../hooks/menu/use-delete-menu.hook";
import { promiseToast } from "../../utils/sileo";
import { formatDate } from "../../utils/dateUtils";
import MenuControls from "../../components/menu/MenuControls";

interface GetColumnsParams {
    handleEdit: (menu : Menu) => void;
    handleDelete: (id: string) => void;
    hasAnyPermissions: (permissions : string[]) => boolean;
    hasPermissions: (permissions : string[]) => boolean;
}

const getColumns = ({ handleEdit, hasAnyPermissions, hasPermissions, handleDelete } : GetColumnsParams) : ColumnDef<Menu>[] => [
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
        header: "Category",
        accessorKey: 'category',
        meta: { align: 'center' },
    },
    {
        header: "Price",
        accessorKey: 'price',
        cell: info => formatToPeso(Number(info.getValue())),
        meta: { align: 'center' }
    },
    {
        header: 'Status',
        accessorKey: 'status',
        cell: info => <Chip variant={info.getValue() as string === 'available' ? 'success' : 'danger' } label={(info.getValue() as string).toUpperCase()} />,
        meta: { align: 'center' }
    },
    {
        header: 'Date Created',
        accessorKey: 'createdAt',
        cell: info => formatDate(info.getValue() as string),
        meta: { align: 'center' }
    },
    ...(hasAnyPermissions([PERMISSIONS.MENU_UPDATE, PERMISSIONS.MENU_DELETE]) ? [
        {
            header: "Action",
            cell: ({ row } : { row : Row<Menu>}) => (
                <div className="flex items-center justify-center">
                    {hasPermissions([PERMISSIONS.MENU_UPDATE]) && (
                        <IconButton 
                            onClick={() => handleEdit(row.original)}
                            icon={<Pencil size={18} />}
                        />
                    )}
                    {hasPermissions([PERMISSIONS.MENU_DELETE]) && (
                        <IconButton 
                            variant="danger"
                            onClick={() => handleDelete(row.original._id)}
                            icon={<Trash size={18}/>}
                        />
                    )}
                </div>
            ),
            meta: { align: 'center' }
        }
    ] : [])
]  

export default function Menu () {
    const { hasAnyPermissions, hasPermissions } = usePermissions();
    const deleteMenuMutation = useDeleteMenu();
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState('');
    const debouncedSearch = useDebounce(search, 0.8);
    const [filter, setFilter] = useState<SortOption>({
        sort: 'createdAt',
        order: 'desc'
    })

    const params = useMemo(() => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        order: filter.order,
        sort: filter.sort,
        search: debouncedSearch,
        category,
    }), [pagination, filter, debouncedSearch, category]);


    const { data, isFetching } = useGetMenus(params);

    const handleClose = () => {
        setShowModal(false);
        setSelectedMenu(null);
    }
    
    const handleEdit = (menu : Menu) => {
        setSelectedMenu(menu);
        setShowModal(true);
    }

    const handleDelete = (id: string) => {
        const isConfirmed = confirm('Are you sure you want to delete this?');

        if(!isConfirmed) return;

        promiseToast(deleteMenuMutation.mutateAsync(id));
    }

    const onRowClick = (row : Menu) => {
        setSelectedMenu(row);
        setShowModal(true);
    }

    return (
        <PageContainer
            title="Menu Management"
            description="Manage your menu items for your POS system."
        >
            <WhiteCard className="space-y-5">
                <MenuControls 
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
                    data={data?.menus || []}
                    columns={getColumns({ handleEdit, hasAnyPermissions, hasPermissions, handleDelete })}
                    pagination={pagination}
                    setPagination={setPagination}
                    totalPages={data?.pagination.totalPages}
                    showPagination
                    noDataMessage="No Items Found"
                    total={data?.pagination.total}
                    onRowClick={onRowClick}
                />
            </WhiteCard>
            <MenuModal 
                close={handleClose}
                selectedMenu={selectedMenu}
                show={showModal}
            />
        </PageContainer>
    )
}