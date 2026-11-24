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
import { deliveryPersonApi } from "@/api/deliveryPersonApi";

const DeliveryPersonManagement = () => {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const availabilityStatusOptions = [
    { value: "Available", label: "Available" },
    { value: "On Delivery", label: "On Delivery" },
    { value: "Off Duty", label: "Off Duty" },
  ];

  useEffect(() => {
    fetchDeliveryPersons();
  }, []);

  const fetchDeliveryPersons = async () => {
    try {
      const data = await deliveryPersonApi.getAllDeliveryPersons();
      setDeliveryPersons(data);
    } catch (error) {
      console.error("Error fetching delivery persons:", error);
      messageApi.error("Failed to fetch delivery personnel");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      await deliveryPersonApi.createDeliveryPerson(values);
      messageApi.success("Delivery person created successfully");
      setIsCreateModalOpen(false);
      form.resetFields();
      fetchDeliveryPersons();
    } catch (error) {
      console.error("Error creating delivery person:", error);
      messageApi.error("Failed to create delivery person");
    }
  };

  const handleUpdate = async (values) => {
    try {
      await deliveryPersonApi.updateDeliveryPerson(
        selectedDeliveryPerson._id,
        values
      );
      messageApi.success("Delivery person updated successfully");
      setIsEditModalOpen(false);
      setSelectedDeliveryPerson(null);
      form.resetFields();
      fetchDeliveryPersons();
    } catch (error) {
      console.error("Error updating delivery person:", error);
      messageApi.error("Failed to update delivery person");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deliveryPersonApi.deleteDeliveryPerson(id);
      messageApi.success("Delivery person deleted successfully");
      fetchDeliveryPersons();
    } catch (error) {
      console.error("Error deleting delivery person:", error);
      messageApi.error("Failed to delete delivery person");
    }
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    const headers = ["Full Name", "Phone Number", "Status", "Created At"];
    const rows = deliveryPersons.map((person) => [
      person.fullName,
      person.phoneNumber,
      person.availabilityStatus,
      new Date(person.createdAt).toLocaleDateString(),
    ]);

    doc.setFontSize(16);
    doc.text("Delivery Personnel Report", 105, 20, { align: "center" });
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      margin: { top: 40 },
    });
    doc.save("delivery-personnel-report.pdf");
  };

  const filteredAndSortedDeliveryPersons = deliveryPersons
    .filter(
      (person) =>
        person.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        person.phoneNumber.includes(searchText)
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
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("fullName"),
      }),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("phoneNumber"),
      }),
    },
    {
      title: "Status",
      dataIndex: "availabilityStatus",
      key: "availabilityStatus",
      render: (status) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#fff",
            backgroundColor:
              status === "Available"
                ? "#5cb85c"
                : status === "On Delivery"
                ? "#f0ad4e"
                : "#6c757d",
          }}
        >
          {status}
        </span>
      ),
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("availabilityStatus"),
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
              setSelectedDeliveryPerson(record);
              form.setFieldsValue(record);
              setIsEditModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this delivery person?"
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
        <h2>Delivery Personnel Management</h2>
        <Space>
          <Input
            placeholder="Search by name or phone..."
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
            Add Delivery Person
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
        dataSource={filteredAndSortedDeliveryPersons}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />

      {/* Create Delivery Person Modal */}
      <Modal
        title="Add New Delivery Person"
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
            name="fullName"
            label="Full Name"
            rules={[
              { required: true, message: "Please enter full name" },
              { whitespace: true, message: "Full name cannot be empty" },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter phone number" },
              {
                pattern: /^[+]?[0-9\s-]{7,15}$/,
                message: "Invalid phone number format",
              },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            name="availabilityStatus"
            label="Availability Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select
              placeholder="Select status"
              options={availabilityStatusOptions}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Delivery Person Modal */}
      <Modal
        title="Edit Delivery Person"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedDeliveryPerson(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Update"
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[
              { required: true, message: "Please enter full name" },
              { whitespace: true, message: "Full name cannot be empty" },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter phone number" },
              {
                pattern: /^[+]?[0-9\s-]{7,15}$/,
                message: "Invalid phone number format",
              },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            name="availabilityStatus"
            label="Availability Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select
              placeholder="Select status"
              options={availabilityStatusOptions}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeliveryPersonManagement;
