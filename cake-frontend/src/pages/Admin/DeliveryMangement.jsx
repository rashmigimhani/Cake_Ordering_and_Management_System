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
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { deliveryApi } from "@/api/deliveryApi";
import { orderApi } from "@/api/orderApi";
import { deliveryPersonApi } from "@/api/deliveryPersonApi";
import moment from "moment";
const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(true);
  const [deliveryPersonLoading, setDeliveryPersonLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const deliveryStatusOptions = [
    { value: "Assigned", label: "Assigned" },
    { value: "Out for Delivery", label: "Out for Delivery" },
    { value: "Delivered", label: "Delivered" },
    { value: "Failed", label: "Failed" },
  ];

  useEffect(() => {
    fetchDeliveries();
    fetchOrders();
    fetchDeliveryPersons();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const data = await deliveryApi.getAllDeliveries();
      setDeliveries(data.filter((d) => !d.deleted));
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      messageApi.error("Failed to fetch deliveries");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await orderApi.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      messageApi.error("Failed to fetch orders");
    } finally {
      setOrderLoading(false);
    }
  };

  const fetchDeliveryPersons = async () => {
    try {
      const data = await deliveryPersonApi.getAllDeliveryPersons();
      setDeliveryPersons(data);
    } catch (error) {
      console.error("Error fetching delivery persons:", error);
      messageApi.error("Failed to fetch delivery personnel");
    } finally {
      setDeliveryPersonLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      const formattedValues = {
        orderId: values.orderId,
        deliveryPersonId: values.deliveryPersonId,
        status: values.status,
        deliveryDate: values.deliveryDate.toISOString(),
        notes: values.notes,
      };
      await deliveryApi.createDelivery(formattedValues);
      messageApi.success("Delivery created successfully");
      setIsCreateModalOpen(false);
      form.resetFields();
      fetchDeliveries();
    } catch (error) {
      console.error("Error creating delivery:", error);
      messageApi.error("Failed to create delivery");
    }
  };

  const handleUpdate = async (values) => {
    try {
      await deliveryApi.updateDelivery(selectedDelivery._id, values);
      messageApi.success("Delivery updated successfully");
      setIsEditModalOpen(false);
      setSelectedDelivery(null);
      form.resetFields();
      fetchDeliveries();
    } catch (error) {
      console.error("Error updating delivery:", error);
      messageApi.error("Failed to update delivery");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deliveryApi.deleteDelivery(id);
      messageApi.success("Delivery deleted successfully");
      fetchDeliveries();
    } catch (error) {
      console.error("Error deleting delivery:", error);
      messageApi.error("Failed to delete delivery");
    }
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    const headers = [
      "Delivery ID",
      "Order ID",
      "Customer Name",
      "Cake Type",
      "Delivery Person",
      "Status",
      "Delivery Date",
      "Notes",
      "Created At",
    ];
    const rows = deliveries.map((delivery) => {
      const order = orders.find((o) => o._id === delivery.orderId);
      const deliveryPerson = deliveryPersons.find(
        (dp) => dp._id === delivery.deliveryPersonId
      );
      return [
        delivery._id.slice(-8).toUpperCase(),
        order?._id.slice(-8).toUpperCase() || "-",
        order?.customerId?.firstName
          ? `${order.customerId.firstName} ${order.customerId.lastName}`
          : "-",
        order?.cakeType || "-",
        deliveryPerson ? `${deliveryPerson.fullName}` : "-",
        delivery.status,
        delivery.deliveryDate
          ? new Date(delivery.deliveryDate).toLocaleDateString()
          : "-",
        delivery.notes || "-",
        new Date(delivery.createdAt).toLocaleDateString(),
      ];
    });

    doc.setFontSize(16);
    doc.text("Deliveries Report", 105, 20, { align: "center" });
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      margin: { top: 40 },
    });
    doc.save("deliveries-report.pdf");
  };

  const filteredAndSortedDeliveries = deliveries
    .filter(
      (delivery) =>
        delivery._id.toLowerCase().includes(searchText.toLowerCase()) ||
        delivery.orderId?.deliveryAddress?.street
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        delivery.orderId?.deliveryAddress?.city
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        delivery.orderId?.cakeType
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        delivery.deliveryPersonId?.fullName
          .toLowerCase()
          .includes(searchText.toLowerCase())
    )
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
      title: "Delivery ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => id.slice(-8).toUpperCase(),
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("_id"),
      }),
    },
    {
      title: "Order ID",
      dataIndex: ["orderId", "_id"],
      key: "orderId",
      render: (id) => id?.slice(-8).toUpperCase() || "-",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("orderId"),
      }),
    },
    {
      title: "Customer Address",
      dataIndex: ["orderId", "deliveryAddress"],
      key: "address",
      render: (address) =>
        address
          ? `${address.street}, ${address.city} ${address.postalCode}`
          : "-",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("address"),
      }),
    },
    {
      title: "Cake Details",
      dataIndex: "orderId",
      key: "cakeDetails",
      render: (order) =>
        order ? `${order.cakeType} - ${order.flavor} (${order.size})` : "-",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("cakeDetails"),
      }),
    },
    {
      title: "Delivery Person",
      dataIndex: ["deliveryPersonId", "fullName"],
      key: "deliveryPerson",
      render: (name) => name || "-",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("deliveryPersonId"),
      }),
    },
    {
      title: "Contact Number",
      dataIndex: ["deliveryPersonId", "phoneNumber"],
      key: "phoneNumber",
      render: (phone) => phone || "-",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("phoneNumber"),
      }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#fff",
            backgroundColor:
              status === "Assigned"
                ? "#337ab7"
                : status === "Out for Delivery"
                ? "#f0ad4e"
                : status === "Delivered"
                ? "#5cb85c"
                : "#d9534f",
          }}
        >
          {status}
        </span>
      ),
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("status"),
      }),
    },
    {
      title: "Delivery Date",
      dataIndex: "deliveryDate",
      key: "deliveryDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("deliveryDate"),
      }),
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (notes) =>
        notes
          ? notes.length > 30
            ? `${notes.substring(0, 30)}...`
            : notes
          : "-",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("notes"),
      }),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("createdAt"),
      }),
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
              setSelectedDelivery(record);
              form.setFieldsValue({
                orderId: record.orderId._id,
                deliveryPersonId: record.deliveryPersonId._id,
                status: record.status,
                deliveryDate: moment(record.deliveryDate),
                notes: record.notes,
              });
              setIsEditModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this delivery?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
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
        }}
      >
        <h2>Delivery Management</h2>
        <Space>
          <Input
            placeholder="Search by delivery ID, customer, cake, or person..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setIsCreateModalOpen(true);
            }}
          >
            Add Delivery
          </Button>
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
        dataSource={filteredAndSortedDeliveries}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />

      {/* Create Delivery Modal */}
      <Modal
        title="Add New Delivery"
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Create"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="orderId"
            label="Order"
            rules={[{ required: true, message: "Please select an order" }]}
          >
            <Select
              placeholder="Select order"
              loading={orderLoading}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {orders.map((order) => (
                <Select.Option
                  key={order._id}
                  value={order._id}
                  label={`${order.cakeType} - ${order.deliveryAddress?.city}`}
                >
                  {order._id.slice(-8).toUpperCase()} - {order.cakeType} (
                  {order.deliveryAddress?.city})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="deliveryPersonId"
            label="Delivery Person"
            rules={[
              { required: true, message: "Please select a delivery person" },
            ]}
          >
            <Select
              placeholder="Select delivery person"
              loading={deliveryPersonLoading}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {deliveryPersons.map((person) => (
                <Select.Option
                  key={person._id}
                  value={person._id}
                  label={person.fullName}
                >
                  {person.fullName} ({person.phoneNumber})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select
              placeholder="Select status"
              options={deliveryStatusOptions}
            />
          </Form.Item>
          <Form.Item
            name="deliveryDate"
            label="Delivery Date"
            rules={[{ required: true, message: "Please select delivery date" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea placeholder="Enter delivery notes" rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Delivery Modal */}
      <Modal
        title="Edit Delivery"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedDelivery(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Update"
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="orderId"
            label="Order"
            rules={[{ required: true, message: "Please select an order" }]}
          >
            <Select
              placeholder="Select order"
              loading={orderLoading}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {orders.map((order) => (
                <Select.Option
                  key={order._id}
                  value={order._id}
                  label={`${order.cakeType} - ${order.deliveryAddress?.city}`}
                >
                  {order._id.slice(-8).toUpperCase()} - {order.cakeType} (
                  {order.deliveryAddress?.city})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="deliveryPersonId"
            label="Delivery Person"
            rules={[
              { required: true, message: "Please select a delivery person" },
            ]}
          >
            <Select
              placeholder="Select delivery person"
              loading={deliveryPersonLoading}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {deliveryPersons.map((person) => (
                <Select.Option
                  key={person._id}
                  value={person._id}
                  label={person.fullName}
                >
                  {person.fullName} ({person.phoneNumber})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select
              placeholder="Select status"
              options={deliveryStatusOptions}
            />
          </Form.Item>
          <Form.Item
            name="deliveryDate"
            label="Delivery Date"
            rules={[{ required: true, message: "Please select delivery date" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea placeholder="Enter delivery notes" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeliveryManagement;
