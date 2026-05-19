import { useState } from "react";
import PageContainer from "../../components/ui/PageContainer";
import { menuCategories } from "../../lib/contants/menu";
import Card from "../../components/ui/Card";

export default function POS () {
    const [category, setCategory] = useState('All');

    return (
        <PageContainer
            title="Point of Sale"
            description="Create new orders, apply discounts, and generate receipts."
        >
            <div className="flex relative">
                <div className="min-w-0 flex-1">
                    <div className="min-w-0 flex-1 flex overflow-x-auto gap-2 pb-3">
                        {['All', ...menuCategories].map((item) => {
                            const active = category === item;

                            return (
                                <button
                                    onClick={() => setCategory(item)}
                                    className={`cursor-pointer min-w-30 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                                        active
                                            ? "bg-accent text-white"
                                            : "bg-main/40 hover:bg-main"
                                    }`}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}