import { useMemo, useState } from "react";
import { WhiteCard } from "../../components/ui/Card";
import PageContainer from "../../components/ui/PageContainer";
import { useGetMenus } from "../../hooks/menu/use-get-menus.hook";
import type { ColumnDef, PaginationState, Row } from "@tanstack/react-table";
import { useDebounce } from "../../hooks/useDebounce";
import type { SortOption } from "../../types/types";
import CustomizedTable from "../../components/ui/Table";
import { type Menu } from "../../types/menu.type";
import Dropdown from "../../components/ui/Dropdown";
import { formatToPeso, getKeyByValue } from "../../utils/utils";
import { Pencil, Plus, Trash } from "lucide-react";
import FiltersMenu from "../../components/ui/FiltersMenu";
import SearchField from "../../components/ui/SearchField";
import { menuCategoryOptions } from "../../lib/contants/menu";
import Button from "../../components/ui/Button";
import MenuModal from "../../components/menu/MenuModal";
import Chip from "../../components/ui/Chip";
import IconButton from "../../components/ui/IconButton";
import { PERMISSIONS } from "../../config/permissions";
import usePermissions from "../../hooks/usePermissions";
import { useDeleteMenu } from "../../hooks/menu/use-delete-menu.hook";
import { promiseToast } from "../../utils/sileo";

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

const filterOptions :  Record<string, SortOption> = {
    'Newest': { sort: 'createdAt', order: 'desc' },
    'Oldest': { sort: 'createdAt', order: 'asc' },
    'A-Z' : { sort: 'name', order: 'asc' },
    'Z-A' : { sort: 'name', order: 'desc' }
}

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

    return (
        <PageContainer
            title="Menu Management"
            description="Manage your menu items for your POS system."
        >
            <WhiteCard className="space-y-5">
                <div className="flex-1 flex gap-3 items-end justify-between">
                    <SearchField
                        className="max-w-50 lg:max-w-100"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        placeholder="Search menu..."
                    />
                    <div className="flex items-end gap-3">
                        <div className="lg:flex gap-3 items-center hidden">
                            <Dropdown 
                                className="w-40"
                                onChange={(value) => setCategory(value)}
                                options={[{ label: 'All', value: '' }, ...menuCategoryOptions]}
                                value={category}
                                label="Category"
                            />
                            <Dropdown 
                                onChange={(value) => setFilter(filterOptions[value])}
                                options={Object.keys(filterOptions).map(opt => ({ label: opt, value: opt }))}
                                value={getKeyByValue(filterOptions, filter) || ""}
                                label="Sort"
                            />
                        </div>
                        <Button className="w-35 text-sm rounded-md" onClick={() => setShowModal(true)}>
                            <Plus size={18}/>
                            Create Menu
                        </Button>
                        <FiltersMenu 
                            className="lg:hidden"
                            containerStyle="space-y-3"
                        >
                            <Dropdown 
                                onChange={(value) => setCategory(value)}
                                options={[{ label: 'All', value: '' }, ...menuCategoryOptions]}
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
                    data={data?.menus || []}
                    columns={getColumns({ handleEdit, hasAnyPermissions, hasPermissions, handleDelete })}
                    pagination={pagination}
                    setPagination={setPagination}
                    totalPages={data?.pagination.totalPages}
                    showPagination
                    noDataMessage="No Items Found"
                    total={data?.pagination.total}
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