import Card from "../ui/Card"

export default function RoleCardSkeleton () {
    return (
        <Card className="space-y-3">
            <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-loading rounded-md animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                        <div className="w-[70%] h-5 bg-loading animate-pulse" />
                        <div className="w-[70%] h-5 bg-loading animate-pulse" />
                    </div>
            </div>
            <div className="h-[2px] bg-loading animate-pulse"/>
            <div className="w-[70%] h-5 mt-2 bg-loading animate-pulse" />
            <div className="w-1/2 h-5 mt-2 bg-loading animate-pulse" />
            <div className="flex flex-wrap gap-2">
                <div className="w-20 h-6 mt-2 bg-loading rounded-full animate-pulse" />
                <div className="w-20 h-6 mt-2 bg-loading rounded-full animate-pulse" />
                <div className="w-20 h-6 mt-2 bg-loading rounded-full animate-pulse" />
                <div className="w-20 h-6 mt-2 bg-loading rounded-full animate-pulse" />
            </div>
        </Card>
    )
}