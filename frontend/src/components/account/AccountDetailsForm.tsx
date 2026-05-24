import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useAuthStore } from "../../lib/store/authStore";
import Button from "../ui/Button";
import TextField from "../ui/Textfield";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema, type UserFormData } from "../../schemas/userSchema";
import { useForm, type SubmitHandler } from "react-hook-form";
import IconButton from "../ui/IconButton";
import { Edit, Lock } from "lucide-react";
import { useUpdateProfile } from "../../hooks/user/use-update-profile.hook";
import { promiseToast } from "../../utils/sileo";

interface AccountDetailsFormProps {
    showChangePassword: boolean;
    setShowChangePassword: Dispatch<SetStateAction<boolean>>;
}

export default function AccountDetailsForm ({ setShowChangePassword, showChangePassword } : AccountDetailsFormProps) {
    const { user } = useAuthStore();
    const updateProfileMutation = useUpdateProfile();
    const [showEdit, setShowEdit] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
        resolver: zodResolver(UserSchema),
    });

    const handleCancel = () => {
        if(user){
            reset({
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            })
            setShowEdit(false)
        }
    }

    const onSubmit: SubmitHandler<UserFormData> = (data) => {
        const isConfirm = confirm("Are you sure you want to update your profile information?");
        if(!isConfirm) return;

        promiseToast(updateProfileMutation.mutateAsync(data), "top-center", () => setShowEdit(false));
    }

    useEffect(() => {
        if(user) {
            reset({
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            })
        }
    }, [user])

     return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Personal Information */}
            <div className="flex justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        Personal Information
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        Update your personal details.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {!showChangePassword && (
                        <IconButton 
                            tooltip="Change Password"
                            icon={<Lock size={20} />} 
                            onClick={() => setShowChangePassword(true)}
                        />
                    )}
                    {!showEdit && (
                        <IconButton 
                            tooltip="Edit Information"    
                            icon={<Edit size={20}/>} 
                            onClick={() => setShowEdit(true)}
                        />
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                    label="Firstname"
                    placeholder="Enter your firstname"
                    disabled={!showEdit}
                    registration={register('firstname')}
                    error={errors.firstname?.message}
                />

                <TextField
                    label="Lastname"
                    placeholder="Enter your lastname"
                    disabled={!showEdit}
                    registration={register('lastname')}
                    error={errors.lastname?.message}
                />

                <TextField
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    disabled={!showEdit}
                    registration={register('email')}
                    error={errors.email?.message}
                />
            </div>

            {/* Button */}
            {showEdit && (
                <div className="flex justify-end pt-2 gap-3">
                    <button 
                        className="bg-gray-200 rounded-md px-4 py-2 border border-gray-400 cursor-pointer"
                        onClick={handleCancel}
                    >Cancel</button>
                    <Button className="rounded-md">Save Changes</Button>
                </div>
            )}
        </form>
     )
}