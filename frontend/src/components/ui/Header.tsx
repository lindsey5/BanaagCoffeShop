import { Coffee } from "lucide-react";
import Card from "./Card";
import { formatLongDate } from "../../utils/dateUtils";

export default function Header () {
    return (
        <header className="">
            <Card className="flex justify-between items-center text-white">
                <h1 className="text-xl font-bold flex justify-center items-center gap-2">
                    <Coffee size={25} />
                    Banaag POS
                </h1>
                <p>{formatLongDate(new Date())}</p>
            </Card>
        </header>
    )
}