import { useState } from "react";
import { Button, Modal, message, Select, Input } from "antd";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CreateTicketModal = ({ isOpen, onClose, onConfirm }) => {
  const [form, setForm] = useState({ title: "", description: "", type: "" });

  const handleCreate = async () => {
    if (!form.title || !form.description || !form.type) {
      message.error("Please fill in all fields");
      return;
    }

    try {
      await onConfirm(form);
      message.success("Ticket created successfully");
      setForm({ title: "", description: "", type: "" });
      onClose();
    } catch (error) {
      console.error("Error creating ticket:", error);
      message.error("Failed to create ticket");
    }
  };

  return (
    <Modal
      title="Create New Support Ticket"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div className="space-y-4 mt-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Brief description of your issue"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Provide detailed information about your issue"
            rows={4}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="type">Priority</Label>
          <Select
            value={form.type}
            onChange={(value) => setForm((prev) => ({ ...prev, type: value }))}
            placeholder="Select priority level"
            className="mt-1 w-full"
          >
            <Select.Option value="middle">Middle Priority</Select.Option>
            <Select.Option value="normal">Normal Priority</Select.Option>
            <Select.Option value="urgent">Urgent</Select.Option>
          </Select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleCreate}>
            Create Ticket
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateTicketModal;
