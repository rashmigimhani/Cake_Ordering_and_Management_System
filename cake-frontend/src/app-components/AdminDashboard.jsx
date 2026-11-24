import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  ShopOutlined,
  TruckOutlined,
  UserAddOutlined,
  BoxPlotOutlined,
  OrderedListOutlined,
  MessageOutlined,
  PayCircleOutlined,
  LogoutOutlined,
  WeiboSquareOutlined
} from "@ant-design/icons";
import { ChartArea } from "lucide-react";
import AdminDashboardComponent from "@/pages/Admin/AdminDashboardComponent";
import UserManagement from "@/pages/Admin/UserManagement";
import OrderManagement from "@/pages/Admin/OrderManagement";
import PaymentManagement from "@/pages/Admin/PaymentManagement";
import DeliveryMangement from "@/pages/Admin/DeliveryMangement";
import DeliveryPersonManagement from "@/pages/Admin/DeliveryPersonManagement";
import SupplierManagement from "@/pages/Admin/SupplierManagement";
import IngredientManagement from "@/pages/Admin/IngredientManagement";
import TicketManagement from "@/pages/Admin/TicketManagement";
import CakeManagement from "@/pages/Admin/CakeManagement";


const { Sider } = Layout;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeKey, setActiveKey] = useState("dashboard");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <ChartArea />,
      label: "Dashboard",
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Users",
    },
    {
      key: "suppliers",
      icon: <ShopOutlined />,
      label: "Suppliers",
    },
    {
      key: "delivery",
      icon: <TruckOutlined />,
      label: "Delivery",
    },
    {
      key: "delivery-persons",
      icon: <UserAddOutlined />,
      label: "Delivery Persons",
    },
    {
      key: "ingredients",
      icon: <BoxPlotOutlined />,
      label: "Ingredients",
    },
    {
      key: "orders",
      icon: <OrderedListOutlined />,
      label: "Orders",
    },
    {
      key: "support-tickets",
      icon: <MessageOutlined />,
      label: "Support Tickets",
    },
    {
      key: "payments",
      icon: <PayCircleOutlined />,
      label: "Payment Transactions",
    },
    {
      key: "cake",
      icon: < WeiboSquareOutlined/>,
      label: "Cake Management",
    },
  ];

  const content = {
    dashboard: <AdminDashboardComponent />,
    users: <UserManagement />,
    orders: <OrderManagement />,
    payments: <PaymentManagement />,
    delivery: <DeliveryMangement />,
    "delivery-persons": <DeliveryPersonManagement />,
    suppliers: <SupplierManagement />,
    ingredients: <IngredientManagement />,
    "support-tickets": <TicketManagement />,
    "cake" : <CakeManagement/>,
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={240} className="site-layout-background">
        <div className="p-4 text-white bg-blue-600 text-center font-bold text-lg">
          Sweet Bliss Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
          style={{ height: "100%", borderRight: 0 }}
          onClick={(key) => {
            setActiveKey(key.key);
          }}
        />
        <div className="p-4 absolute bottom-0 w-full">
          <Button
            type="text"
            icon={<LogoutOutlined />}
            block
            onClick={handleLogout}
            className="text-left text-gray-300 hover:text-white hover:bg-gray-700"
          >
            Logout
          </Button>
        </div>
      </Sider>
      <Layout>
        <div style={{ padding: 24, minHeight: 360 }}>{content[activeKey]}</div>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
