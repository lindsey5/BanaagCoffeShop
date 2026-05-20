import type { Dispatch, SetStateAction } from "react";
import { menuCategories } from "../../lib/contants/menu";

interface CategoryTabProps {
    category: string;
    setCategory: Dispatch<SetStateAction<string>>;
}

export default function CategoryTab ({ category, setCategory } : CategoryTabProps) {
    return (
        <div className="flex overflow-x-auto gap-2 pb-3">
            {["All", ...menuCategories].map((item) => {
                const active = category === item;

                return (
                    <button
                        key={item}
                        onClick={() => setCategory(item)}
                        className={`cursor-pointer min-w-20 flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
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
    )
}