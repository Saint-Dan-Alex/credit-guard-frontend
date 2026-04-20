import SettingsSidebar from "@/components/settings/sidebar";

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            <SettingsSidebar />
            <main className="flex-1 overflow-y-auto p-12">
                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
