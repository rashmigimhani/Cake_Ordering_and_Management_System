import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Space,
  message,
  Popconfirm,
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
import { supplierApi } from "@/api/supplierApi";

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const data = await supplierApi.getAllSuppliers();
      setSuppliers(data);
    } catch (error) {
      messageApi.error("Failed to fetch suppliers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      await supplierApi.createSupplier(values);
      messageApi.success("Supplier created successfully");
      setIsCreateModalOpen(false);
      form.resetFields();
      fetchSuppliers();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to create supplier");
    }
  };

  const handleUpdate = async (values) => {
    try {
      await supplierApi.updateSupplier(selectedSupplier._id, values);
      messageApi.success("Supplier updated successfully");
      setIsEditModalOpen(false);
      setSelectedSupplier(null);
      form.resetFields();
      fetchSuppliers();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to update supplier");
    }
  };

  const handleDelete = async (id) => {
    try {
      await supplierApi.deleteSupplier(id);
      messageApi.success("Supplier deleted successfully");
      fetchSuppliers();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to delete supplier");
    }
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    const headers = [
      "Name",
      "Contact Person",
      "Phone",
      "Email",
      "City",
      "Created At",
    ];
    const rows = suppliers.map((supplier) => [
      supplier.supplierName,
      supplier.contactPerson,
      supplier.phone,
      supplier.email,
      supplier.address?.city || "-",
      new Date(supplier.createdAt).toLocaleDateString(),
    ]);

    doc.setFontSize(16);
    doc.text("Supplier Report", 105, 20, { align: "center" });
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      margin: { top: 40 },
    });
    doc.save("suppliers-report.pdf");
  };

  const filteredAndSortedSuppliers = suppliers
    .filter(
      (supplier) =>
        supplier.supplierName
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        supplier.contactPerson
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchText.toLowerCase())
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
      title: "Supplier Name",
      dataIndex: "supplierName",
      key: "supplierName",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("supplierName"),
      }),
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      key: "contactPerson",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("contactPerson"),
      }),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("phone"),
      }),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("email"),
      }),
    },
    {
      title: "City",
      dataIndex: "address",
      key: "address",
      render: (address) => (address ? address.city : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedSupplier(record);
              form.setFieldsValue(record);
              setIsEditModalOpen(true);
            }}
            size="small"
          />
          <Popconfirm
            title="Are you sure you want to delete this supplier?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />} size="small" />
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
        <h2>Supplier Management</h2>
        <Space>
          <Input
            placeholder="Search by name, contact, email..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add Supplier
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
        dataSource={filteredAndSortedSuppliers}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />

      {/* Create Supplier Modal */}
      <Modal
        title="Add New Supplier"
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
            name="supplierName"
            label="Supplier Name"
            rules={[{ required: true, message: "Please enter supplier name" }]}
          >
            <Input placeholder="Enter supplier name" />
          </Form.Item>
          <Form.Item
            name="contactPerson"
            label="Contact Person"
            rules={[
              { required: true, message: "Please enter contact person name" },
            ]}
          >
            <Input placeholder="Enter contact person name" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please enter phone number" },
              {
                pattern: /^[+]?[0-9\s-]{7,15}$/,
                message: "Invalid phone number",
              },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
          <Form.Item
            name={["address", "street"]}
            label="Street Address"
            rules={[{ required: true, message: "Please enter street address" }]}
          >
            <Input placeholder="Enter street address" />
          </Form.Item>
          <Form.Item
            name={["address", "city"]}
            label="City"
            rules={[{ required: true, message: "Please enter city" }]}
          >
            <Input placeholder="Enter city" />
          </Form.Item>
          <Form.Item
            name={["address", "postalCode"]}
            label="Postal Code"
            rules={[{ required: true, message: "Please enter postal code" }]}
          >
            <Input placeholder="Enter postal code" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Supplier Modal */}
      <Modal
        title="Edit Supplier"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedSupplier(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Update"
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="supplierName"
            label="Supplier Name"
            rules={[{ required: true, message: "Please enter supplier name" }]}
          >
            <Input placeholder="Enter supplier name" />
          </Form.Item>
          <Form.Item
            name="contactPerson"
            label="Contact Person"
            rules={[
              { required: true, message: "Please enter contact person name" },
            ]}
          >
            <Input placeholder="Enter contact person name" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please enter phone number" },
              {
                pattern: /^[+]?[0-9\s-]{7,15}$/,
                message: "Invalid phone number",
              },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
          <Form.Item
            name={["address", "street"]}
            label="Street Address"
            rules={[{ required: true, message: "Please enter street address" }]}
          >
            <Input placeholder="Enter street address" />
          </Form.Item>
          <Form.Item
            name={["address", "city"]}
            label="City"
            rules={[{ required: true, message: "Please enter city" }]}
          >
            <Input placeholder="Enter city" />
          </Form.Item>
          <Form.Item
            name={["address", "postalCode"]}
            label="Postal Code"
            rules={[{ required: true, message: "Please enter postal code" }]}
          >
            <Input placeholder="Enter postal code" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierManagement;
