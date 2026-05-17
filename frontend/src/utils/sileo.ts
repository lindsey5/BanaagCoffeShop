import { sileo, type SileoPosition } from "sileo";

export const successToast = (title : string, description: string, position: SileoPosition = "top-center") => {
    sileo.success({
        title,
        description,
        position,
        fill: "#171717",
        styles: { description: "text-white/75!" },
    });
}

export const errorToast = (title : string, description : string, position: SileoPosition = "top-center") => {
    sileo.error({
        title,
        description,
        position: position,
        fill: "#171717",
        styles: { description: "text-white/75!" },
    });
}
export const promiseToast = <T extends { message?: string}>(
    promise: Promise<T>,
    position: SileoPosition = "top-center",
    onSuccess?: () => void,
    successMessage?: string,
) => {
    return sileo.promise(promise, {
        position: position,
        loading: { 
            title: "Loading...", 
            fill: "#171717",        
            styles: {
                title: "text-white!",
                description: "text-white/75!",
            }
        },
        success: (data: T) => {
            setTimeout(() => {
                onSuccess ? onSuccess() : window.location.reload()
            }, 1000)
            
            return ({
                title: "Success",
                description: data?.message || successMessage,
                fill: "#171717",
                styles: {
                    title: "text-white!",
                    description: "text-white/75!",
                },
            })
        },
        error: (err: any) => ({
            title: err?.message || "Something went wrong",
        }),
    });
};