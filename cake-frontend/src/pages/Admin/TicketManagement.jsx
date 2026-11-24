import React, { useState, useEffect } from "react";
import {
  Card,
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
import { ticketApi } from "@/api/ticketApi";

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const ticketStatusOptions = [
    { value: "open", label: "Open" },
    { value: "in-progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];

  const ticketTypeColors = {
    urgent: "#d9534f",
    middle: "#f0ad4e",
    normal: "#5bc0de",
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await ticketApi.getAllTicketsForAdmin();
      setTickets(data.filter((ticket) => !ticket.deleteStatus));
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await ticketApi.updateTicket(id, { status });
      messageApi.success("Ticket status updated successfully");
      fetchTickets();
      setIsUpdateModalOpen(false);
      setSelectedTicket(null);
      form.resetFields();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to update ticket status");
    }
  };

  const handleDeleteTicket = async (id) => {
    try {
      await ticketApi.deleteTicket(id);
      messageApi.success("Ticket deleted successfully");
      fetchTickets();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to delete ticket");
    }
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    const headers = [
      "Ticket ID",
      "Customer Name",
      "Email",
      "Title",
      "Description",
      "Type",
      "Status",
      "Created At",
    ];
    const rows = tickets.map((ticket) => [
      ticket._id.slice(-8).toUpperCase(),
      `${ticket.customer?.firstName || "-"} ${
        ticket.customer?.lastName || "-"
      }`,
      ticket.customer?.email || "-",
      ticket.title,
      ticket.description,
      ticket.type,
      ticket.status,
      new Date(ticket.createdAt).toLocaleDateString(),
    ]);

    doc.setFontSize(16);
    doc.text("Support Tickets Report", 105, 20, { align: "center" });
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      margin: { top: 40 },
    });
    doc.save("tickets-report.pdf");
  };

const filteredAndSortedTickets = tickets
  .filter((ticket) => {
    const searchTextLower = searchText.toLowerCase();

    // Existing text-based fields
    const matchesText =
      ticket.customer?.firstName?.toLowerCase().includes(searchTextLower) ||
      ticket.customer?.lastName?.toLowerCase().includes(searchTextLower) ||
      ticket.customer?.email?.toLowerCase().includes(searchTextLower) ||
      ticket.title.toLowerCase().includes(searchTextLower) ||
      ticket.description.toLowerCase().includes(searchTextLower);

    // New: Check createdAt date string
    const createdAtString = new Date(ticket.createdAt)
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .toLowerCase(); // e.g., "04/05/2025"

    const matchesDate = createdAtString.includes(searchTextLower);

    return matchesText || matchesDate;
  })
  .sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "#f0ad4e";
      case "in-progress":
        return "#337ab7";
      case "resolved":
        return "#5cb85c";
      case "closed":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

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
        <h2>Support Ticket Management</h2>
        <Space>
          <Input
            placeholder="Search by customer, email, title..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredAndSortedTickets.length === 0 ? (
          <Card style={{ textAlign: "center", gridColumn: "1 / -1" }}>
            <p>No tickets found.</p>
          </Card>
        ) : (
          filteredAndSortedTickets.map((ticket) => (
            <Card
              key={ticket._id}
              hoverable
              style={{
                minHeight: "400px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              actions={[
                <Button
                  type="primary"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedTicket(ticket);
                    form.setFieldsValue({ status: ticket.status });
                    setIsUpdateModalOpen(true);
                  }}
                >
                  Update Status
                </Button>,
                <Popconfirm
                  title="Are you sure you want to delete this ticket?"
                  onConfirm={() => handleDeleteTicket(ticket._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="danger" size="small" icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>,
              ]}
            >
              <div style={{ marginBottom: "10px" }}>
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  {ticket.title}
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "10px",
                      fontWeight: "bold",
                      color: "#fff",
                      backgroundColor:
                        ticketTypeColors[ticket.type] || "#6c757d",
                    }}
                  >
                    {ticket.type}
                  </span>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "10px",
                      fontWeight: "bold",
                      color: "#fff",
                      backgroundColor: getStatusColor(ticket.status),
                    }}
                  >
                    {ticket.status}
                  </span>
                </div>
                <p style={{ margin: "8px 0", color: "#666", fontSize: "13px" }}>
                  <strong>Ticket ID:</strong>{" "}
                  {ticket._id.slice(-8).toUpperCase()}
                </p>
                <p style={{ margin: "8px 0", color: "#666", fontSize: "13px" }}>
                  <strong>Customer:</strong> {ticket.customer?.firstName}{" "}
                  {ticket.customer?.lastName}
                </p>
                <p style={{ margin: "8px 0", color: "#666", fontSize: "13px" }}>
                  <strong>Email:</strong> {ticket.customer?.email}
                </p>
                <p style={{ margin: "8px 0", color: "#666", fontSize: "13px" }}>
                  <strong>Created:</strong>{" "}
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div
                style={{
                  flex: 1,
                  marginBottom: "10px",
                  overflowY: "auto",
                  maxHeight: "120px",
                  border: "1px solid #eee",
                  padding: "10px",
                  borderRadius: "4px",
                  backgroundColor: "#fafafa",
                }}
              >
                <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.4" }}>
                  {ticket.description}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Update Ticket Status Modal */}
      <Modal
        title="Update Ticket Status"
        open={isUpdateModalOpen}
        onCancel={() => {
          setIsUpdateModalOpen(false);
          setSelectedTicket(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Update"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) =>
            handleUpdateStatus(selectedTicket._id, values.status)
          }
        >
          <Form.Item
            name="status"
            label="New Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select status" options={ticketStatusOptions} />
          </Form.Item>
          <p>
            <strong>Current Status:</strong> {selectedTicket?.status}
          </p>
          <p>
            <strong>Type:</strong> {selectedTicket?.type}
          </p>
          <p>
            <strong>Title:</strong> {selectedTicket?.title}
          </p>
          <p>
            <strong>Customer:</strong> {selectedTicket?.customer?.firstName}{" "}
            {selectedTicket?.customer?.lastName}
          </p>
          <p>
            <strong>Email:</strong> {selectedTicket?.customer?.email}
          </p>
          <p>
            <strong>Description:</strong> {selectedTicket?.description}
          </p>
        </Form>
      </Modal>
    </div>
  );
};

export default TicketManagement;
