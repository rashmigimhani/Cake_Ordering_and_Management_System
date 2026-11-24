import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  message,
  Space,
  Popconfirm,
  Select,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { orderApi } from "@/api/orderApi";

const { RangePicker } = DatePicker;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [messageApi, contextHolder] = message.useMessage();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [form] = Form.useForm();

  const orderStatusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "In Progress", label: "In Progress" },
    { value: "Out for Delivery", label: "Out for Delivery" },
    { value: "Delivered", label: "Delivered" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderApi.getAllOrders();
      setOrders(data.filter((order) => !order.deleted));
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await orderApi.updateOrder(id, { orderStatus: status });
      messageApi.success("Order status updated successfully");
      fetchOrders();
      setIsUpdateModalOpen(false);
      setSelectedOrder(null);
      form.resetFields();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to update order status");
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await orderApi.deleteOrder(id);
      messageApi.success("Order deleted successfully");
      fetchOrders();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to delete order");
    }
  };

  const handleViewImage = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

const handleExportToPDF = () => {
  let filteredOrders = [...orders];

  // Filter by date range if selected
  if (dateRange && dateRange.length === 2) {
    const [start, end] = dateRange;
    filteredOrders = filteredOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate >= start.startOf("day").toDate() &&
        orderDate <= end.endOf("day").toDate()
      );
    });
  }

  if (filteredOrders.length === 0) {
    messageApi.warning("No orders found for the selected date range");
    return;
  }

  // Group orders by date
  const groupedOrders = filteredOrders.reduce((groups, order) => {
    const dateKey = new Date(order.createdAt).toISOString().split("T")[0];
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(order);
    return groups;
  }, {});

  // Sort groups by date (descending)
  const sortedDates = Object.keys(groupedOrders).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const doc = new jsPDF();
  let currentY = 20;

  // === Report Title ===
  doc.setFontSize(16);
  doc.text(
    dateRange.length
      ? `Order Report (${dateRange[0].format("YYYY-MM-DD")} to ${dateRange[1].format("YYYY-MM-DD")})`
      : "Order Report",
    14,
    currentY
  );

  // === Generated Date & Time at Top Right ===
  const generatedAt = new Date();
  const formattedDateTime = `${generatedAt.toLocaleDateString()} ${generatedAt.toLocaleTimeString()}`;
  doc.setFontSize(10);
  doc.text(`Generated: ${formattedDateTime}`, 200, currentY, {
    align: "right",
  });

  currentY += 10;

  // === Loop through each date group ===
  sortedDates.forEach((date) => {
    const ordersForDate = groupedOrders[date];

    // Add new page if space is low
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(13);
    doc.text(`Date: ${date}`, 14, currentY);
    currentY += 6;

    const headers = [
      "Order ID",
      "Customer",
      "Cake Type",
      "Flavor",
      "Size",
      "Theme",
      "Event Date",
      "Status",
      "Delivery",
      "Total",
    ];

    const rows = ordersForDate.map((order) => [
      order._id.slice(-8).toUpperCase(),
      `${order.customerId?.firstName || "-"} ${order.customerId?.lastName || "-"}`,
      order.cakeType,
      order.flavor,
      order.size,
      order.theme,
      new Date(order.eventDate).toLocaleDateString(),
      order.orderStatus,
      order.deliveryMethod,
      `₹${order.totalPrice}`,
    ]);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: currentY,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        currentY = data.cursor.y + 10;
      },
    });

    currentY += 10;
  });

  const fileName = dateRange.length
    ? `orders-datewise-${dateRange[0].format("YYYY-MM-DD")}-to-${dateRange[1].format("YYYY-MM-DD")}.pdf`
    : "orders-datewise-report.pdf";

  doc.save(fileName);
};



  // Apply search and date filtering before rendering
  const filteredAndSortedOrders = orders
    .filter((order) => {
      const matchSearch =
        order.customerId?.firstName
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        order.customerId?.lastName
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        order.cakeType?.toLowerCase().includes(searchText.toLowerCase()) ||
        order.flavor?.toLowerCase().includes(searchText.toLowerCase()) ||
        order.theme?.toLowerCase().includes(searchText.toLowerCase());

      let matchDate = true;
      if (dateRange && dateRange.length === 2) {
        const [start, end] = dateRange;
        const orderDate = new Date(order.createdAt);
        matchDate =
          orderDate >= start.startOf("day").toDate() &&
          orderDate <= end.endOf("day").toDate();
      }

      return matchSearch && matchDate;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => id.slice(-8).toUpperCase(),
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("_id"),
      }),
    },
    {
      title: "Customer Name",
      dataIndex: "customerId",
      key: "customerId",
      render: (customer) =>
        `${customer?.firstName || "-"} ${customer?.lastName || "-"}`,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("customerId"),
      }),
    },
    {
      title: "Cake Type",
      dataIndex: "cakeType",
      key: "cakeType",
    },
    {
      title: "Flavor",
      dataIndex: "flavor",
      key: "flavor",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Theme",
      dataIndex: "theme",
      key: "theme",
    },
    {
      title: "Custom Image",
      dataIndex: "customImageUrl",
      key: "customImageUrl",
      render: (imageUrl) =>
        imageUrl ? (
          <Button
            type="link"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewImage(imageUrl)}
          />
        ) : (
          "-"
        ),
    },
    {
      title: "Event Date",
      dataIndex: "eventDate",
      key: "eventDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#fff",
            backgroundColor:
              status === "Pending"
                ? "#f0ad4e"
                : status === "Confirmed"
                ? "#5cb85c"
                : status === "In Progress"
                ? "#337ab7"
                : status === "Out for Delivery"
                ? "#d9534f"
                : status === "Delivered"
                ? "#5bc0de"
                : "#6c757d",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Delivery Method",
      dataIndex: "deliveryMethod",
      key: "deliveryMethod",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `₹${price}`,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setSelectedOrder(record);
              form.setFieldsValue({ orderStatus: record.orderStatus });
              setIsUpdateModalOpen(true);
            }}
          >
            Update Status
          </Button>
          {record.orderStatus !== "Confirmed" && (
            <Popconfirm
              title="Are you sure you want to delete this order?"
              onConfirm={() => handleDeleteOrder(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />} size="small">
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h2>Order Management</h2>
        <Space wrap>
          <Input
            placeholder="Search by customer, cake, flavor, theme..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <RangePicker
            onChange={(dates) => setDateRange(dates)}
            format="YYYY-MM-DD"
            allowClear
          />
          <Button
            type="default"
            icon={<DownloadOutlined />}
            onClick={handleExportToPDF}
          >
            Export PDF
          </Button>
        </Space>
      </div>

      <Table
        dataSource={filteredAndSortedOrders}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />

      {/* Update Order Status Modal */}
      <Modal
        title="Update Order Status"
        open={isUpdateModalOpen}
        onCancel={() => {
          setIsUpdateModalOpen(false);
          setSelectedOrder(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Update"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) =>
            handleUpdateStatus(selectedOrder._id, values.orderStatus)
          }
        >
          <Form.Item
            name="orderStatus"
            label="New Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select status" options={orderStatusOptions} />
          </Form.Item>
          <p>
            <strong>Current Status:</strong> {selectedOrder?.orderStatus}
          </p>
          <p>
            <strong>Customer:</strong> {selectedOrder?.customerId?.firstName}{" "}
            {selectedOrder?.customerId?.lastName}
          </p>
          <p>
            <strong>Cake:</strong> {selectedOrder?.cakeType} (
            {selectedOrder?.flavor})
          </p>
          <p>
            <strong>Total:</strong> ₹{selectedOrder?.totalPrice}
          </p>
        </Form>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        title="Custom Image"
        open={isImageModalOpen}
        onCancel={() => {
          setIsImageModalOpen(false);
          setSelectedImageUrl("");
        }}
        footer={null}
        width={600}
        centered
      >
        <div style={{ textAlign: "center" }}>
          <img
            src={selectedImageUrl}
            alt="Custom cake design"
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              objectFit: "contain",
            }}
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='0.35em' font-family='Arial, sans-serif' font-size='12' fill='%23999'%3EImage not found%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default OrderManagement;
