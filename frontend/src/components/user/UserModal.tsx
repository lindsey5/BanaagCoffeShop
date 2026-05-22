import { X } from "lucide-react";
import type { GetUser } from "../../types/user.type";
import Modal from "../ui/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserSchema, UpdateUserSchema, type CreateUserFormData, type UpdateUserFormData } from "../../schemas/userSchema";
import { useForm, type SubmitHandler, type UseFormClearErrors, type UseFormSetError } from "react-hook-form";
import { useEffect } from "react";
import { WhiteCard } from "../ui/Card";
import TextField from "../ui/Textfield";
import Dropdown from "../ui/Dropdown";
import { useGetRoles } from "../../hooks/role/use-get-roles.hook";
import Button from "../ui/Button";
import { userService } from "../../services/userService";
import { useCreateUser } from "../../hooks/user/use-create-user.hook";
import { useUpdateUser } from "../../hooks/user/use-update-user.hook";
import { promiseToast } from "../../utils/sileo";

export const checkIfEmailExist = async (
    setError: UseFormSetError<CreateUserFormData | UpdateUserFormData>,
    clearErrors: UseFormClearErrors<CreateUserFormData | UpdateUserFormData>,
    email: string,
    id?: string,
) =>  {
    try{
        clearErrors("email");
        const response = await userService.isEmailExist({id, email});
        if (response.success) {
            setError("email", {
                type: "manual",
                message: "Email already exists",
            });
            return true; 
        }

        return false;
    }catch(err){
        console.error(err);
        return false;
    }
}

interface UserModalProps {
    show: boolean;
    close: () => void;
    user: GetUser | null;
}

type UserFormData = CreateUserFormData | UpdateUserFormData

export default function UserModal ({ close, show, user } : UserModalProps) {
    const { data } = useGetRoles();
    const createUserMutation = useCreateUser();
    const updateUserMutation = useUpdateUser();
    const { 
        register, 
        handleSubmit, 
        formState: { errors}, 
        reset, 
        setValue,
        watch,
        setError,
        clearErrors
    } = useForm<UserFormData>({
        resolver: zodResolver(user ? UpdateUserSchema : CreateUserSchema)
    })

    const handleClose = () => {
        close();
        reset({
            firstname: undefined,
            lastname: undefined,
            email: undefined,
            password: undefined,
            confirmPassword: undefined,
            role_id: ""
        })
    }

    const onSubmit : SubmitHandler<UserFormData> = async (data) => {
        const isConfirm = confirm(
            user
            ? "Are you sure you want to update this user?"
            : "Are you sure you want to create this user?"
        );

        if (!isConfirm) return;

        const isEmailExist = await checkIfEmailExist(
            setError,
            clearErrors,
            data.email,
            user?._id
        )

        if(isEmailExist) return;

        user ? promiseToast(updateUserMutation.mutateAsync({ data: data as UpdateUserFormData, id: user._id }))
            : promiseToast(createUserMutation.mutateAsync(data as CreateUserFormData))
    }
    
    useEffect(() => {
        if(user) reset({ 
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role_id: user.role_id
         })
    }, [user])

    return (
        <Modal
            open={show}
            onClose={handleClose}
        >
            <WhiteCard>
                <form 
                    className="space-y-3 relative"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className="font-bold text-xl">{user ? 'Update User' : 'Create User' }</h1>
                    <button type="button" className="absolute top-0 right-0 cursor-pointer" onClick={handleClose}>
                        <X size={20} />
                    </button>
                    <div className="flex flex-col md:flex-row gap-2"> 
                        <TextField 
                            label="Firstname"
                            error={errors.firstname?.message}
                            placeholder="Enter firstname"
                            registration={register('firstname')}
                           
                        />
                        <TextField 
                            label="Lastname"
                            error={errors.lastname?.message}
                            placeholder="Enter lastname"
                            registration={register('lastname')}
                            
                        />
                    </div>
                    <TextField 
                        label="Email"
                        error={errors.email?.message}
                        placeholder="Enter email"
                        
                        registration={register('email')}
                    />
                    <div className="flex flex-col md:flex-row gap-2"> 
                        <TextField 
                            label={`Password ${user ? '(Optional)' : ''}`}
                            type="password"
                            error={errors.password?.message}
                            placeholder="Enter password"
                            
                            registration={register('password')}
                        />
                        <TextField 
                            label={`Confirm Password ${user ? '(Optional)' : ''}`}
                            type="password"
                            error={errors.confirmPassword?.message}
                            placeholder="Confirm Password"
                            registration={register('confirmPassword')}
                        />
                    </div>
                    <Dropdown 
                        label="Role"
                        className="h-16"
                        options={data?.roles.map(role => ({ label: role.name, value: role._id})) || []}
                        onChange={(value) => setValue("role_id", value)}
                        value={watch('role_id')}
                        error={errors.role_id?.message}
                    />
                    <div className="flex justify-end gap-3 pt-3">
                        <Button 
                            type="submit" 
                            className="text-sm"
                            disabled={createUserMutation.isPending || updateUserMutation.isPending}
                        >
                            {user ? 'Save changes' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </WhiteCard>

        </Modal>
    )
}