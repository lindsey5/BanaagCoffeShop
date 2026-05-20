import Card from "./Card";
import { formatLongDate } from "../../utils/dateUtils";

export default function Header () {
    return (
        <header className="z-30 fixed inset-x-0 top-0">
            <Card className="flex justify-between items-center rounded-none text-white">
                <h1 className="text-xl font-bold flex justify-center items-center gap-2">
                    <img className="w-13 h-13 object-cover" src="/logo.jpg" alt="logo"/>
                    Banaag POS
                </h1>
                <p>{formatLongDate(new Date())}</p>
            </Card>
        </header>
    )
}