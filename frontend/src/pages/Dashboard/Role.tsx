import { useParams } from "react-router-dom";
import PageContainer from "../../components/ui/PageContainer";
import { getPermissionKey, PERMISSION_DESCRIPTIONS, PERMISSIONS } from "../../config/permissions";
import usePermissions from "../../hooks/usePermissions";
import { useCreateRole } from "../../hooks/role/use-create-role.hook";
import { useGetRoleById } from "../../hooks/role/use-get-role.hook";
import { useUpdateRole } from "../../hooks/role/use-update-role.hook";
import { useDeleteRole } from "../../hooks/role/use-delete-role.hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleSchema, type RoleFormData } from "../../schemas/roleSchema";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { promiseToast } from "../../utils/sileo";
import { WhiteCard } from "../../components/ui/Card";
import TextField from "../../components/ui/Textfield";
import PermissionsContainer from "../../components/role/PermissionContainer";
import Button from "../../components/ui/Button";
import RoleDetailsSkeleton from "../../components/role/RoleSkeleton";

function CategorizedPermissions () {
    const result: Record<string, { description: string, value: string}[]> = {};
    
    Object.values(PERMISSIONS).forEach((perm) => {
        for (const [category, perms] of Object.entries(PERMISSION_DESCRIPTIONS)) {
            const permissionKey = getPermissionKey(perm) || "";

            if (permissionKey in perms) {
                if (!result[category]) result[category] = [];

                result[category].push({
                    description: perms[permissionKey as keyof typeof perms],
                    value: perm
                });
            }
        }
    });

    return result;
}

export default function Role () {
    const params = useParams();
    const id = params.id;
    const { hasPermissions, hasAnyPermissions } = usePermissions();
    const hasDeletePermission = hasPermissions([PERMISSIONS.ROLE_DELETE])
    const createRoleMutation = useCreateRole();
    const updateRoleMutation = useUpdateRole();
    const deleteRoleMutation = useDeleteRole();
    const { data, isFetching } = useGetRoleById(id || "");

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<RoleFormData>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: '',
            description: '',
            permissions: []
        }
    });

    useEffect(() => {
        if(data?.role) {
            reset({
                name: data.role.name,
                description: data.role.description,
                permissions: data.permissions
            })
        }
    }, [data])

    const onSubmit: SubmitHandler<RoleFormData> = (data) => {
        const isConfirm = confirm(
            id
            ? "Are you sure you want to update this role?"
            : "Are you sure you want to create this role?"
        );

        if (!isConfirm) return;
        
        if(id){
            promiseToast(updateRoleMutation.mutateAsync({ 
                id: id,
                data,
            }), "top-center", () => window.location.href = '/dashboard/roles')
            
        }else {
            promiseToast(createRoleMutation.mutateAsync(data), "top-center", () => window.location.href = '/dashboard/roles')
        }
    }

    const handleDelete = () => {
        const isConfirm = confirm("Are you sure you want to delete this role?");

        if (!isConfirm) return;

        promiseToast(deleteRoleMutation.mutateAsync(id || ""))
    }
    
    return (
        <PageContainer title={id ? 'Update Role' : 'Create Role'} description={id? 'Update role details and modify assigned permissions' : 'Create a new role and define system access permissions'}>
            {isFetching ? <RoleDetailsSkeleton /> : (
                <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                <WhiteCard>
                    <h1 className="text-sm lg:text-md font-bold">Role Details</h1>
                    <div className="flex flex-col lg:flex-row gap-5 mt-4">
                        <TextField 
                            label="Name"
                            registration={register("name")}
                            placeholder="Enter role name"
                            error={errors.name?.message}
                        />
                        <TextField 
                            label="Description"
                            registration={register("description")}
                            placeholder="Enter role description"
                            error={errors.description?.message}
                        />
                    </div>
                </WhiteCard>
                <WhiteCard>
                    <h1 className="text-md font-bold mb-4">Role Permissions</h1>
                    {errors.permissions && <span className="text-xs text-red-500">{errors.permissions.message}</span>}
                    {Object.entries(CategorizedPermissions()).map(([category, perms]) => (
                        <PermissionsContainer 
                            key={category}
                            category={category} 
                            watch={watch}
                            setValue={setValue}
                            permissions={perms}
                        />
                    ))}
                    <div className="flex justify-end gap-5">
                    {id && hasDeletePermission && (
                        <Button 
                            type="button"
                            className="bg-red-600 text-white rounded-md font-semibold text-sm"
                            disabled={deleteRoleMutation.isPending || createRoleMutation.isPending || updateRoleMutation.isPending}
                            onClick={handleDelete}
                        >Delete Role</Button>
                    )}
                    {hasAnyPermissions([PERMISSIONS.ROLE_UPDATE, PERMISSIONS.ROLE_CREATE]) && (
                        <Button className="rounded-md" type="submit" disabled={deleteRoleMutation.isPending || createRoleMutation.isPending || updateRoleMutation.isPending}>
                            {id ? 'Update Role' : 'Create Role'}
                        </Button>
                    )}
                    </div>
                </WhiteCard>
            </form>
            )}
        </PageContainer>
    )
}