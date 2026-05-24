import { useState } from "react";
import AccountDetailsForm from "../../components/account/AccountDetailsForm";
import AccountSecurityForm from "../../components/account/AccountSecurityForm";
import { WhiteCard } from "../../components/ui/Card";
import PageContainer from "../../components/ui/PageContainer";

export default function Account() {
    const [showChangePassword, setShowChangePassword] = useState(false);

    return (
        <PageContainer
            title="Account Settings"
            description="Edit your account details and password"
        >
            <WhiteCard>
                <div className="flex flex-col gap-6 p-2">
                    <AccountDetailsForm 
                        setShowChangePassword={setShowChangePassword}
                        showChangePassword={showChangePassword}
                    />
                    {/* Divider */}
                    <div className="w-full h-px bg-hover"></div>
                    {showChangePassword && (
                        <AccountSecurityForm 
                            setShowChangePassword={setShowChangePassword}
                        />
                    )}
                </div>
            </WhiteCard>
        </PageContainer>
    );
}