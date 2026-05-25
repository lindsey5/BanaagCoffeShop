import TextField from "../ui/Textfield"
import Button from "../ui/Button"
import { useChangePassword } from "../../hooks/user/use-change-password.hook";
import { useForm, type SubmitHandler } from "react-hook-form";
import { changePasswordSchema, type ChangePasswordInput } from "../../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { promiseToast } from "../../utils/sileo";
import type { Dispatch, SetStateAction } from "react";

interface AccountSecurityFormProps {
    setShowChangePassword: Dispatch<SetStateAction<boolean>>;
}

export default function AccountSecurityForm ({ setShowChangePassword } : AccountSecurityFormProps) {
    const changePasswordMutation = useChangePassword();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ChangePasswordInput>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit: SubmitHandler<ChangePasswordInput> = (data) => {
        if (!confirm("Are you sure you want to update your password?")) return;

        promiseToast(changePasswordMutation.mutateAsync(data))
    };

    const handleCancel = () => {
        setShowChangePassword(false);
        reset({})
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Password Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800">
                    Change Password
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                    Keep your account secure.
                </p>
            </div>

            <TextField
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                registration={register('currentPassword')}
                error={errors.currentPassword?.message}
            />

            <TextField
                label="New Password"
                type="password"
                placeholder="Enter new password"
                registration={register('newPassword')}
                error={errors.newPassword?.message}
            />

            <TextField
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
                registration={register('confirmPassword')}
                error={errors.confirmPassword?.message}
            />
            <div className="flex justify-end pt-2 gap-3">
                <button 
                    className="bg-gray-200 rounded-md px-4 py-2 border border-gray-400 cursor-pointer"
                    onClick={handleCancel}
                >Cancel</button>
                <Button className="rounded-md">Change Password</Button>
            </div>
        </form>
    )
}