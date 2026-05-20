import Card from "../ui/Card";

export default function ProductSkeleton () {
    return (
        <Card className="animate-pulse flex flex-col items-center gap-3 p-3">
            <div className="w-full h-35 bg-loading rounded" />
            <div className="w-3/4 h-4 bg-loading rounded" />
            <div className="w-1/2 h-4 bg-loading rounded" />
            <div className="w-full h-9 bg-loading rounded" />
        </Card>
    );
}
