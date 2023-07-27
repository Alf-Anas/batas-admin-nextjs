import { ROUTE } from "@/constant/route";
import { Button, Dropdown, Menu } from "antd";
import { useRouter } from "next/router";
import { MenuOutlined } from "@ant-design/icons";
import classes from "./HeaderNav.module.css";

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
    <>
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
        className={classes.menu_nav}
      />

      <Dropdown
        menu={{
          items: headerMenu.map((item) => {
            return {
              ...item,
              onClick: () => router.push(item.key),
              theme: "dark",
            };
          }),
          selectedKeys: [router.pathname],
        }}
        placement="bottomRight"
        className={classes.menu_button}
      >
        <Button size="large" ghost style={{ margin: "auto 0" }}>
          <MenuOutlined />
        </Button>
      </Dropdown>
    </>
  );
}
