import { zodResolver } from "@hookform/resolvers/zod";
import { supplierSchema, type SupplierFormData } from "../../schemas/supplierSchema";
import Modal from "../ui/Modal";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { Supplier } from "../../types/supplier.type";
import { WhiteCard } from "../ui/Card";
import { X } from "lucide-react";
import TextField from "../ui/Textfield";
import Button from "../ui/Button";
import { useCreateSupplier } from "../../hooks/supplier/use-create-supplier.hook";
import { useUpdateSupplier } from "../../hooks/supplier/use-update-supplier.hook";
import { promiseToast } from "../../utils/sileo";
import { useEffect } from "react";
import Dropdown from "../ui/Dropdown";
import { categoryOptions } from "../../lib/contants/inventory";

interface SupplierModalProps {
    show: boolean;
    close: () => void;
    supplier: Supplier | null;
}

export default function SupplierModal ({
    show,
    close,
    supplier
} : SupplierModalProps) {
    const createSupplierMutation = useCreateSupplier();
    const updateSupplierMutation = useUpdateSupplier();
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<SupplierFormData>({
        resolver: zodResolver(supplierSchema),
    });
    
    const handleClose = () => {
        close();
        reset({})
    }

    const onSubmit: SubmitHandler<SupplierFormData> = (data) => {
        const isConfirmed = confirm(
            supplier
                ? "Are you sure you want to update this supplier?"
                : "Are you sure you want to create this supplier?"
        );

        if (!isConfirmed) return;


        supplier ? promiseToast(updateSupplierMutation.mutateAsync({ data, id: supplier._id })) : 
            promiseToast(createSupplierMutation.mutateAsync(data))
    }

    useEffect(() => {
        if(supplier) reset({
            code: supplier.code,
            email: supplier.email,
            name: supplier.name,
            phone: supplier.phone,
            category: supplier.category
        })
    }, [supplier])

    return (
        <Modal
            onClose={handleClose}
            open={show}
        >
            <WhiteCard>
            <form className="space-y-3 relative" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="font-bold text-xl">{supplier ? 'Update Supplier' : 'Create Supplier' }</h1>
                <button type="button" className="absolute top-0 right-0 cursor-pointer" onClick={handleClose}>
                    <X size={20} />
                </button>
                <TextField 
                    label="Code"
                    placeholder="Enter code"
                    registration={register('code')}
                    error={errors.code?.message}
                />
                <TextField 
                    label="Name"
                    placeholder="Enter name"
                    registration={register('name')}
                    error={errors.name?.message}
                />
                <TextField 
                    label="Email (Optional)"
                    type="email"
                    placeholder="Enter email"
                    registration={register('email')}
                    error={errors.email?.message}
                />
                <TextField 
                    type="number"
                    label="Phone (Optional)"
                    placeholder="Enter phone number"
                    registration={register('phone')}
                    error={errors.phone?.message}
                />
                <Dropdown 
                    label="Category"
                    options={categoryOptions}
                    onChange={(value) => setValue('category', value)}
                    value={watch('category')}
                    error={errors.category?.message}
                />
                <div className="flex justify-end">
                    <Button className="text-sm px-5" type="submit" disabled={createSupplierMutation.isPending || updateSupplierMutation.isPending}>
                        {supplier ? 'Save changes' : 'Submit' }
                    </Button>
                </div>
            </form>
            </WhiteCard>
        </Modal>
    )
}