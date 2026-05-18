import { sileo, type SileoPosition } from "sileo";

export const successToast = (title : string, description: string, position: SileoPosition = "top-center") => {
    sileo.success({
        title,
        description,
        position,
    });
}

export const errorToast = (title : string, description : string, position: SileoPosition = "top-center") => {
    sileo.error({
        title,
        description,
        position: position,
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
        },
        success: (data: T) => {
            setTimeout(() => {
                onSuccess ? onSuccess() : window.location.reload()
            }, 1000)
            
            return ({
                title: "Success",
                description: data?.message || successMessage,
            })
        },
        error: (err: any) => ({
            title: err?.message || "Something went wrong",
        }),
    });
};