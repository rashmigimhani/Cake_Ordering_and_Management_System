import { ticketApi } from "@/api/ticketApi";
import { useState, useEffect } from "react";
import { Button, message, Spin, Modal } from "antd";
import {
  Plus,
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import CreateTicketModal from "@/app-components/CreateTicketModal";
import UpdateTicketModal from "@/app-components/UpdateTicketModal";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const customerId = localStorage.getItem("userId");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await ticketApi.getAllTickets(customerId);
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      message.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (formData) => {
    const ticketData = {
      customer: customerId,
      title: formData.title,
      description: formData.description,
      type: formData.type,
    };
    await ticketApi.createTicket(ticketData);
    fetchTickets();
  };

  const handleUpdateTicket = async (ticketId, formData) => {
    await ticketApi.updateTicket(ticketId, { status: formData.status });
    fetchTickets();
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      await ticketApi.deleteTicket(ticketId);
      message.success("Ticket deleted successfully");
      fetchTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
      message.error("Failed to delete ticket");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedTicket(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return <Clock className="w-4 h-4" />;
      case "in-progress":
        return <AlertTriangle className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      case "closed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Ticket className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Support Tickets
            </h1>
            <p className="text-gray-600 mt-2">
              Create and manage your support requests
            </p>
          </div>
          <Button
            type="primary"
            icon={<Plus />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Ticket
          </Button>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No tickets yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first support ticket to get help with your orders.
            </p>
            <Button
              type="primary"
              icon={<Plus />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Your First Ticket
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <Card
                key={ticket._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {ticket.title}
                    </CardTitle>
                    <div className="flex flex-col space-y-2 ml-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {getStatusIcon(ticket.status)}
                        <span className="ml-1 capitalize">{ticket.status}</span>
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                          ticket.type
                        )}`}
                      >
                        <span className="capitalize">{ticket.type}</span>
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {ticket.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Created: {formatDate(ticket.createdAt)}</span>
                    <span>Updated: {formatDate(ticket.updatedAt)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Ticket ID: #{ticket._id.slice(-8).toUpperCase()}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        size="small"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setIsUpdateModalOpen(true);
                        }}
                        type="default"
                      >
                        Update Status
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setIsDeleteModalOpen(true);
                        }}
                        type="danger"
                        icon={<Trash2 className="w-4 h-4" />}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <CreateTicketModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onConfirm={handleCreateTicket}
        />

        <UpdateTicketModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          ticket={selectedTicket}
          onConfirm={handleUpdateTicket}
        />

        <Modal
          title="Delete Ticket"
          open={isDeleteModalOpen}
          onCancel={() => setIsDeleteModalOpen(false)}
          onOk={() => handleDeleteTicket(selectedTicket?._id)}
          okText="Delete"
          okType="danger"
          cancelText="Cancel"
        >
          <p>
            Are you sure you want to delete this ticket? This action cannot be
            undone.
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default MyTickets;
