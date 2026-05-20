import { PERMISSION_DESCRIPTIONS } from "../../config/permissions";
import { WhiteCard } from "../ui/Card";

export default function RoleDetailsSkeleton () {
    return (
        <>
            <WhiteCard>
                <div className="bg-loading w-full h-8 animate-pulse"></div>
                <div className="w-full h-[2px] my-2 bg-loading animate-pulse"></div>
                <div className="flex gap-5 mt-4">
                    <div className="bg-loading flex-1 h-11 animate-pulse"></div>
                    <div className="bg-loading flex-1 h-11 animate-pulse"></div>
                </div>
            </WhiteCard>
            <WhiteCard>
                <div className="bg-loading w-full h-5 animate-pulse"></div>
                <div className="w-full h-[2px] my-5 bg-loading animate-pulse"></div>

                {Object.entries(PERMISSION_DESCRIPTIONS).map((_, i) => (
                    <div key={i} className="mb-8">
                        <div className="bg-loading w-full h-5 animate-pulse"></div>
                        <div className="bg-loading w-full h-8 mt-3 animate-pulse"></div>
                        <div className="w-full h-[2px] my-5 bg-loading animate-pulse"></div>
                    </div>
                ))}
            </WhiteCard>
        </>
    )
}