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
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { paymentApi } from "@/api/paymentApi";

const PaymentManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const paymentStatusOptions = (status) => {
    console.log(status)
   return status === 'Completed' ? [
      
      { value: "Failed", label: "Failed" },
      { value: "Refunded", label: "Refunded" },
    ] : [
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
    { value: "Failed", label: "Failed" },
    { value: "Refunded", label: "Refunded" },
  ];
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await paymentApi.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      messageApi.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      await paymentApi.updateTransaction(selectedTransaction._id, values);
      messageApi.success("Transaction updated successfully");
      setIsEditModalOpen(false);
      setSelectedTransaction(null);
      form.resetFields();
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
      messageApi.error("Failed to update transaction");
    }
  };

  const handleDelete = async (id) => {
    try {
      await paymentApi.deleteTransaction(id);
      messageApi.success("Transaction deleted successfully");
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      messageApi.error("Failed to delete transaction");
    }
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    const headers = [
      "Transaction ID",
      "Customer",
      "Order ID",
      "Payment Method",
      "Amount",
      "Currency",
      "Status",
      "Created At",
    ];

    const rows = transactions.map((transaction) => [
      transaction._id.slice(-8), // Show last 8 chars of ID
      `${transaction.customerId?.firstName} ${transaction.customerId?.lastName}`,
      transaction.orderId?._id?.slice(-8) || "N/A",
      transaction.paymentMethod,
      transaction.amount,
      transaction.currency,
      transaction.paymentStatus,
      new Date(transaction.createdAt).toLocaleDateString(),
    ]);

    doc.setFontSize(16);
    doc.text("Transaction Report", 105, 20, { align: "center" });
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      margin: { top: 40 },
    });
    doc.save("transaction-report.pdf");
  };

  const filteredAndSortedTransactions = transactions
    .filter((transaction) => {
      const customerName = `${transaction.customerId?.firstName || ""} ${transaction.customerId?.lastName || ""
        }`;
      const searchLower = searchText.toLowerCase();

      return (
        customerName.toLowerCase().includes(searchLower) ||
        transaction._id.toLowerCase().includes(searchLower) ||
        transaction.paymentMethod.toLowerCase().includes(searchLower) ||
        transaction.paymentStatus.toLowerCase().includes(searchLower) ||
        transaction.amount.toString().includes(searchText)
      );
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nested objects for sorting
      if (sortConfig.key === "customerName") {
        aValue = `${a.customerId?.firstName || ""} ${a.customerId?.lastName || ""
          }`;
        bValue = `${b.customerId?.firstName || ""} ${b.customerId?.lastName || ""
          }`;
      }

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
      title: "Transaction ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (
        <span style={{ fontFamily: "monospace" }}>{id.slice(-8)}</span>
      ),
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("_id"),
      }),
    },
    {
      title: "Customer",
      key: "customerName",
      render: (_, record) => (
        <div>
          <div>{`${record.customerId?.firstName || ""} ${record.customerId?.lastName || ""
            }`}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.customerId?.email}
          </div>
        </div>
      ),
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("customerName"),
      }),
    },
    {
      title: "Order Details",
      key: "orderDetails",
      render: (_, record) => (
        <div>
          <div style={{ fontFamily: "monospace", fontSize: "12px" }}>
            ID: {record.orderId?._id?.slice(-8) || "N/A"}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.orderId?.cakeType} - {record.orderId?.flavor}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            Size: {record.orderId?.size}
          </div>
        </div>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("paymentMethod"),
      }),
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => (
        <span style={{ fontWeight: "bold" }}>
          {record.currency} {record.amount.toLocaleString()}
        </span>
      ),
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("amount"),
      }),
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#fff",
            backgroundColor:
              status === "Completed"
                ? "#5cb85c"
                : status === "Pending"
                  ? "#f0ad4e"
                  : status === "Failed"
                    ? "#d9534f"
                    : "#6c757d",
          }}
        >
          {status}
        </span>
      ),
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("paymentStatus"),
      }),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
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
              setSelectedTransaction(record);
              form.setFieldsValue({
                paymentStatus: record.paymentStatus,
              });
              setIsEditModalOpen(true);
            }}
          >
            Edit Status
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this transaction?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />} size="small">
              
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
        <h2>Payment Management</h2>
        <Space>
          <Input
            placeholder="Search by customer, ID, method, status..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 350 }}
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
        dataSource={filteredAndSortedTransactions}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} transactions`,
        }}
        scroll={{ x: "max-content" }}
      />

      {/* Edit Transaction Status Modal */}
      <Modal
        title="Update Payment Status"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedTransaction(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Update"
      >
        {selectedTransaction && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              backgroundColor: "#f5f5f5",
              borderRadius: 4,
            }}
          >
            <div>
              <strong>Transaction ID:</strong> {selectedTransaction._id}
            </div>
            <div>
              <strong>Customer:</strong>{" "}
              {`${selectedTransaction.customerId?.firstName} ${selectedTransaction.customerId?.lastName}`}
            </div>
            <div>
              <strong>Amount:</strong> {selectedTransaction.currency}{" "}
              {selectedTransaction.amount.toLocaleString()}
            </div>
            <div>
              <strong>Payment Method:</strong>{" "}
              {selectedTransaction.paymentMethod}
            </div>
          </div>
        )}

        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="paymentStatus"
            label="Payment Status"
            rules={[
              { required: true, message: "Please select payment status" },
            ]}
          >
            <Select
              placeholder="Select payment status"
              options={paymentStatusOptions(selectedTransaction?.paymentStatus)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentManagement;
