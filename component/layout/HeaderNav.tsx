import { ROUTE } from "@/constant/route";
import { Menu } from "antd";
import { useRouter } from "next/router";

const headerMenu = [
    {
        key: ROUTE.ABOUT.URL,
        label: ROUTE.ABOUT.TITLE,
    },
    {
        key: ROUTE.ABOUT.PRIVACY_POLICY.URL,
        label: ROUTE.ABOUT.PRIVACY_POLICY.TITLE,
    },
    {
        key: ROUTE.ABOUT.TERMS_AND_CONDITIONS.URL,
        label: ROUTE.ABOUT.TERMS_AND_CONDITIONS.TITLE,
    },
];

export default function HeaderNav() {
    const router = useRouter();
    return (
        <Menu
            theme="dark"
            mode="horizontal"
            style={{ minWidth: 0, flex: "auto" }}
            selectedKeys={[router.pathname]}
            items={headerMenu.map((item) => {
                return {
                    ...item,
                    onClick: () => router.push(item.key),
                };
            })}
        />
    );
}
