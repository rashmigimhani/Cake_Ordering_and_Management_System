import { useState } from "react";
import { Button, Modal, message, Select } from "antd";

const UpdateTicketModal = ({ isOpen, onClose, ticket, onConfirm }) => {
  const [form, setForm] = useState({ status: ticket?.status || "" });

  const handleUpdate = async () => {
    if (!form.status) {
      message.error("Please select a status");
      return;
    }

    try {
      await onConfirm(ticket._id, form);
      message.success("Ticket updated successfully");
      setForm({ status: "" });
      onClose();
    } catch (error) {
      console.error("Error updating ticket:", error);
      message.error("Failed to update ticket");
    }
  };

  return (
    <Modal
      title="Update Ticket Status"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      {ticket && (
        <div className="space-y-4 mt-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{ticket.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{ticket.description}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              value={form.status}
              onChange={(value) => setForm({ status: value })}
              placeholder="Select status"
              className="w-full"
            >
              <Select.Option value="open">Open</Select.Option>
              <Select.Option value="in-progress">In Progress</Select.Option>
              <Select.Option value="resolved">Resolved</Select.Option>
              <Select.Option value="closed">Closed</Select.Option>
            </Select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={handleUpdate}>
              Update Status
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UpdateTicketModal;
