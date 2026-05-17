import { useForm, type SubmitHandler } from "react-hook-form";
import Button from "../../components/ui/Button";
import TextField from "../../components/ui/Textfield";
import { loginSchema, type LoginFormData } from "../../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../../hooks/auth/use-login-hook";
import { useAuthStore } from "../../lib/store/authStore";
import { Navigate } from "react-router-dom";

export default function Login() {
    const { isAuthenticated } = useAuthStore();
    const loginMutation = useLogin();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit: SubmitHandler<LoginFormData> = (data) => {
        loginMutation.mutate(data)
    };

    if(isAuthenticated()) return <Navigate to="/dashboard" />

    return (
        <div className="relative w-full h-screen flex items-center justify-center">

            <video autoPlay muted loop
                className="absolute w-full h-full object-cover z-0"
            >
                <source src="/coffee-bg.mp4" type="video/mp4"/>
            </video>

            <form className="w-[80%] max-w-[800px] bg-base rounded-2xl flex h-110 z-5 overflow-hidden"
                onSubmit={handleSubmit(onSubmit)}
            >
                <img 
                    src="logo.jpg" alt="coffee-logo" 
                    className="w-1/2 h-full hidden md:block"
                />
                <div className="flex flex-col gap-2 justify-center items-center w-full md:w-1/2 h-full p-10">
                    <h1 className="text-brown font-bold text-3xl">Sign In</h1>
                    <div className="w-full mt-4 space-y-5">
                        <TextField
                            placeholder="Email Address"
                            registration={register('email')}
                            error={errors.email?.message}
                        />
                        <TextField
                            placeholder="Password"
                            type="password"
                            registration={register('password')}
                            error={errors.password?.message}
                        />
                        <Button
                            className="w-full"
                        
                        >Login</Button>
                    </div>
                </div>  
            </form>
        </div>
    )
}