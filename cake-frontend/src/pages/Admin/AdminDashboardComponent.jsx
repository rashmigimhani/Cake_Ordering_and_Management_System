import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Space,
  Progress,
  Typography,
  Avatar,
  List,
  Badge,
  Spin,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  TruckOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Column, Pie } from "@ant-design/charts";
import { customerApi } from "@/api/customerApi";
import { deliveryPersonApi } from "@/api/deliveryPersonApi";
import { orderApi } from "@/api/orderApi";
import { paymentApi } from "@/api/paymentApi";
import { supplierApi } from "@/api/supplierApi";
import { ticketApi } from "@/api/ticketApi";

const { Title: AntTitle, Text } = Typography;

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale
);

const AdminDashboardComponent = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    customers: [],
    deliveryPersons: [],
    orders: [],
    payments: [],
    suppliers: [],
    tickets: [],
  });

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [customers, deliveryPersons, orders, payments, suppliers, tickets] =
        await Promise.all([
          customerApi.getAllCustomers(),
          deliveryPersonApi.getAllDeliveryPersons(),
          orderApi.getAllOrders(),
          paymentApi.getAllTransactions(),
          supplierApi.getAllSuppliers(),
          ticketApi.getAllTicketsForAdmin(),
        ]);

      setDashboardData({
        customers,
        deliveryPersons,
        orders,
        payments,
        suppliers,
        tickets,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Calculate statistics
  const stats = {
    totalCustomers: dashboardData.customers.length,
    totalOrders: dashboardData.orders.length,
    totalRevenue: dashboardData.payments.reduce(
      (sum, payment) =>
        payment.paymentStatus === "Completed" ? sum + payment.amount : sum,
      0
    ),
    totalDeliveryPersons: dashboardData.deliveryPersons.length,
    pendingOrders: dashboardData.orders.filter(
      (order) => order.orderStatus === "Pending"
    ).length,
    completedOrders: dashboardData.orders.filter(
      (order) => order.orderStatus === "Completed"
    ).length,
    openTickets: dashboardData.tickets.filter(
      (ticket) => ticket.status === "open"
    ).length,
    availableDrivers: dashboardData.deliveryPersons.filter(
      (dp) => dp.availabilityStatus === "Available"
    ).length,
  };

  // Order Status Distribution
  const orderStatusData = dashboardData.orders.reduce((acc, order) => {
    acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
    return acc;
  }, {});

  const orderStatusChartData = {
    labels: Object.keys(orderStatusData),
    datasets: [
      {
        data: Object.values(orderStatusData),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Revenue Chart Data (Last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const revenueData = last7Days.map((date) => {
    const dayRevenue = dashboardData.payments
      .filter(
        (payment) =>
          payment.paymentStatus === "Completed" &&
          new Date(payment.createdAt).toISOString().split("T")[0] === date
      )
      .reduce((sum, payment) => sum + payment.amount, 0);
    return dayRevenue;
  });

  const revenueChartData = {
    labels: last7Days.map((date) =>
      new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Daily Revenue (LKR)",
        data: revenueData,
        borderColor: "#1890ff",
        backgroundColor: "rgba(24, 144, 255, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Cake Type Popularity
  const cakeTypeData = dashboardData.orders.reduce((acc, order) => {
    acc[order.cakeType] = (acc[order.cakeType] || 0) + 1;
    return acc;
  }, {});

  const cakeTypeChartConfig = {
    data: Object.entries(cakeTypeData).map(([type, count]) => ({
      type,
      count,
    })),
    xField: "count",
    yField: "type",
    colorField: "type",
    height: 200,
  };

  // Recent Orders Table
  const recentOrdersColumns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <Text code>{id.slice(-8)}</Text>,
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <span>
            {record.customerId?.firstName} {record.customerId?.lastName}
          </span>
        </Space>
      ),
    },
    {
      title: "Cake Type",
      dataIndex: "cakeType",
      key: "cakeType",
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => (
        <Tag
          color={
            status === "Completed"
              ? "green"
              : status === "Pending"
              ? "orange"
              : status === "Confirmed"
              ? "blue"
              : "default"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => <Text strong>LKR {price.toLocaleString()}</Text>,
    },
  ];

  // Delivery Person Status
  const deliveryStatusData = dashboardData.deliveryPersons.reduce((acc, dp) => {
    acc[dp.availabilityStatus] = (acc[dp.availabilityStatus] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <AntTitle level={2} style={{ marginBottom: "24px" }}>
        Admin Dashboard
      </AntTitle>

      {/* Key Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={stats.totalCustomers}
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix={<DollarOutlined style={{ color: "#faad14" }} />}
              suffix="LKR"
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Available Drivers"
              value={stats.availableDrivers}
              prefix={<TruckOutlined style={{ color: "#722ed1" }} />}
              suffix={`/ ${stats.totalDeliveryPersons}`}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Secondary Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Pending Orders"
              value={stats.pendingOrders}
              prefix={
                <ExclamationCircleOutlined style={{ color: "#fa541c" }} />
              }
              valueStyle={{ color: "#fa541c" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Completed Orders"
              value={stats.completedOrders}
              prefix={<RiseOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Open Tickets"
              value={stats.openTickets}
              prefix={<TeamOutlined style={{ color: "#eb2f96" }} />}
              valueStyle={{ color: "#eb2f96" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} lg={12}>
          <Card title="Order Status Distribution" style={{ height: "400px" }}>
            <div
              style={{
                height: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Doughnut
                data={orderStatusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Daily Revenue (Last 7 Days)" style={{ height: "400px" }}>
            <div style={{ height: "300px" }}>
              <Line
                data={revenueChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Additional Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} lg={12}>
          <Card title="Popular Cake Types" style={{ height: "350px" }}>
            <Column {...cakeTypeChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Delivery Team Status" style={{ height: "350px" }}>
            <div style={{ padding: "20px" }}>
              {Object.entries(deliveryStatusData).map(([status, count]) => (
                <div key={status} style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span>{status}</span>
                    <span>
                      {count} / {stats.totalDeliveryPersons}
                    </span>
                  </div>
                  <Progress
                    percent={Math.round(
                      (count / stats.totalDeliveryPersons) * 100
                    )}
                    strokeColor={
                      status === "Available"
                        ? "#52c41a"
                        : status === "On Delivery"
                        ? "#faad14"
                        : "#f5222d"
                    }
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title="Recent Orders"
            extra={<Badge count={stats.pendingOrders} />}
          >
            <Table
              dataSource={dashboardData.orders.slice(0, 5)}
              columns={recentOrdersColumns}
              pagination={false}
              rowKey="_id"
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="Recent Tickets"
            extra={<Badge count={stats.openTickets} />}
          >
            <List
              dataSource={dashboardData.tickets.slice(0, 5)}
              renderItem={(ticket) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<ExclamationCircleOutlined />}
                        style={{
                          backgroundColor:
                            ticket.type === "urgent" ? "#ff4d4f" : "#1890ff",
                        }}
                      />
                    }
                    title={
                      <Space>
                        <Text ellipsis style={{ maxWidth: "150px" }}>
                          {ticket.title}
                        </Text>
                        <Tag
                          color={ticket.status === "open" ? "red" : "green"}
                          size="small"
                        >
                          {ticket.status}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {ticket.customer?.firstName} {ticket.customer?.lastName}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboardComponent;
