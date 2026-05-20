import { Pencil, Shield, User } from "lucide-react";
import Card from "../../components/ui/Card";
import PageContainer from "../../components/ui/PageContainer";
import { useGetRoles } from "../../hooks/role/use-get-roles.hook";
import { useNavigate } from "react-router-dom";
import { getPermissionKey, PERMISSIONS } from "../../config/permissions";
import Chip from "../../components/ui/Chip";
import RoleCardSkeleton from "../../components/roles/RoleCardSkeleton";
import Button from "../../components/ui/Button";
import usePermissions from "../../hooks/usePermissions";

export default function Roles () {
    const navigate = useNavigate();
    const { data, isFetching } = useGetRoles();
    const { hasPermissions } = usePermissions();

    return (
        <PageContainer title="Role Management" description="Manage user roles and permissions">
            {hasPermissions([PERMISSIONS.ROLE_CREATE]) && (
                <div className="flex justify-end">
                    <Button onClick={() => navigate('/dashboard/create-role')}>Create Role</Button>
                </div>
            )}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {isFetching ? (
                Array.from({ length: 6 }).map((_, index) => (
                    <RoleCardSkeleton key={index} />
                ))
            ) : (
                data?.roles.map(role => (
                    <Card className="space-y-3" key={role._id}>
                        <div className="flex justify-between gap-3">
                            <div className="flex items-center gap-3">
                                {role.name === 'Admin' ? <Shield size={35}/> : <User size={35} />}
                                <div>
                                    <h1 className="font-bold text-md">{role.name}</h1>
                                    <p className="text-sm">Users: {role.usersCount}</p>
                                </div>
                            </div>
                            <button className="hover:opacity-50 cursor-pointer" onClick={() => navigate(`/dashboard/role/${role._id}`)}>
                                <Pencil size={20} />
                        </button>
                        </div>
                        <div className="h-[2px] bg-white/50"/>
                        <p className="text-white/80 text-sm xl:text-md">{role.description}</p>
                        <p className="text-white/60 text-xs xl:text-sm mt-2">Permissions ({role.permissions.length})</p>
                        <div className="flex flex-wrap gap-2">
                            {role.permissions.slice(0, 5).map(perm => (
                                <Chip key={perm.action} label={getPermissionKey(perm.action) || ""} />
                            ))}
                            {role.permissions.length > 5 && (
                                <Chip label={`+${role.permissions.length - 5}`}/>
                            )}
                        </div>
                    </Card>
                ))
            )}
            </div>
        </PageContainer>
    )
}