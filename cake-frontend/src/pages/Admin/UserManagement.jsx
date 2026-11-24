import React, { useState, useEffect } from "react";
import { Table, Button, Input, Popconfirm, message, Space } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { customerApi } from "@/api/customerApi";

const UserManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await customerApi.getAllCustomers();
      setCustomers(data.filter((c) => !c.deleted));
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await customerApi.deleteCustomer(id);
      message.success("Customer deleted successfully");
      fetchCustomers();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete customer");
    }
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    const headers = ["Name", "Email", "Phone", "City", "Created At"];
    const rows = customers.map((customer) => [
      `${customer.firstName} ${customer.lastName}`,
      customer.email,
      customer.phoneNumber,
      customer.address?.[0]?.city || "-",
      new Date(customer.createdAt).toLocaleDateString(),
    ]);

    doc.setFontSize(16);
    doc.text("Customer Report", 105, 20, { align: "center" });
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      margin: { top: 40 },
    });
    doc.save("customers-report.pdf");
  };

  const filteredAndSortedCustomers = customers
    .filter(
      (customer) =>
        customer.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchText.toLowerCase())
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
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      sorter: true,
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("firstName"),
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
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("phoneNumber"),
      }),
    },
    {
      title: "City",
      dataIndex: "address",
      key: "address",
      render: (address) =>
        address && address.length > 0 ? address[0].city : "-",
    },
    {
      title: "Loyality Points",
      dataIndex: "loyaltyPoints",
      key: "loyaltyPoints",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      render: (date) => new Date(date).toLocaleDateString(),
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
          <Popconfirm
            title="Are you sure you want to delete this customer?"
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
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Customer Management</h2>
        <Space>
          <Input
            placeholder="Search by name, email..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExportToPDF}
          >
            Export PDF
          </Button>
        </Space>
      </div>

      <Table
        dataSource={filteredAndSortedCustomers}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default UserManagement;
