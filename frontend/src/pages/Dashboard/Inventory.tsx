import { useState } from "react";
import PageContainer from "../../components/ui/PageContainer";
import SearchField from "../../components/ui/SearchField";

export default function Inventory () {
    const [search, setSearch] = useState('');

    return (
        <PageContainer title="Inventory">
            <SearchField 
                className="max-w-100"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Search inventory items..."
            />
        </PageContainer>
    )
}