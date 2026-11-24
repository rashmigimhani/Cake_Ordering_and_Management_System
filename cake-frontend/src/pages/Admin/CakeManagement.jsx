import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  message,
  Space,
  Select,
  InputNumber,
  Image,
  Tag,
  Switch,
  Card,
  Row,
  Col,
  Divider,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  MinusOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { cakeApi } from "@/api/cakeApi";

const CakeManagement = () => {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedCake, setSelectedCake] = useState(null);
  const [stockAction, setStockAction] = useState(""); // "add" or "reduce"
  const [form] = Form.useForm();
  const [stockForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      const data = await cakeApi.getAllCakes();
      setCakes(data.filter((cake) => !cake.deleted));
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to fetch cakes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      await cakeApi.createCake(values);
      messageApi.success("Cake created successfully");
      setIsCreateModalOpen(false);
      form.resetFields();
      fetchCakes();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to create cake");
    }
  };

  const handleUpdate = async (values) => {
    try {
      await cakeApi.updateCake(selectedCake._id, values);
      messageApi.success("Cake updated successfully");
      setIsEditModalOpen(false);
      setSelectedCake(null);
      form.resetFields();
      fetchCakes();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to update cake");
    }
  };

  const handleDelete = async (id) => {
    try {
      await cakeApi.deleteCake(id);
      messageApi.success("Cake deleted successfully");
      fetchCakes();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to delete cake");
    }
  };

  const handleStockUpdate = async (values) => {
    try {
      if (stockAction === "add") {
        await cakeApi.addStock(selectedCake._id, values.amount);
        messageApi.success("Stock added successfully");
      } else {
        await cakeApi.reduceStock(selectedCake._id, values.amount);
        messageApi.success("Stock reduced successfully");
      }
      setIsStockModalOpen(false);
      setSelectedCake(null);
      setStockAction("");
      stockForm.resetFields();
      fetchCakes();
    } catch (error) {
      console.error(error);
      messageApi.error(error.response?.data?.message || "Failed to update stock");
    }
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    const headers = [
      "Name",
      "Type",
      "Description",
      "Base Price",
      "Current Price",
      "Stock Amount",
      "Category",
      "Featured",
      "Flavors",
      "Status",
      "Created At",
    ];
    const rows = cakes.map((cake) => [
      cake.name,
      cake.cakeType || 'custom',
      cake.description.length > 30 
        ? cake.description.substring(0, 30) + "..." 
        : cake.description,
      `$${cake.basePrice?.toFixed(2) || '0.00'}`,
      `$${cake.price?.toFixed(2) || '0.00'}`,
      cake.inStockAmount,
      cake.category || 'general',
      cake.isFeatured ? "Yes" : "No",
      cake.flavors?.join(', ') || 'None',
      cake.inStockAmount > 0 ? "In Stock" : "Out of Stock",
      new Date(cake.createdAt).toLocaleDateString(),
    ]);

    doc.setFontSize(16);
    doc.text("Cakes Report", 105, 20, { align: "center" });
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      margin: { top: 40 },
    });
    doc.save("cakes-report.pdf");
  };

  const filteredAndSortedCakes = cakes
    .filter(
      (cake) =>
        cake.name.toLowerCase().includes(searchText.toLowerCase()) ||
        cake.description.toLowerCase().includes(searchText.toLowerCase()) ||
        cake.cakeType?.toLowerCase().includes(searchText.toLowerCase()) ||
        cake.category?.toLowerCase().includes(searchText.toLowerCase()) ||
        cake.flavors?.some(flavor => flavor.toLowerCase().includes(searchText.toLowerCase()))
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
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 80,
      render: (imageUrl) => (
        imageUrl ? (
          <Image
            width={50}
            height={50}
            src={imageUrl}
            style={{ objectFit: "cover", borderRadius: 4 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        ) : (
          <div style={{ 
            width: 50, 
            height: 50, 
            backgroundColor: "#f0f0f0", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            borderRadius: 4,
            fontSize: 12,
            color: "#999"
          }}>
            No Image
          </div>
        )
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("name"),
      }),
    },
    {
      title: "Type",
      dataIndex: "cakeType",
      key: "cakeType",
      render: (type) => <Tag color="blue">{type}</Tag>,
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("cakeType"),
      }),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 200,
    },
    {
      title: "Base Price",
      dataIndex: "basePrice",
      key: "basePrice",
      render: (price) => `$${price?.toFixed(2) || '0.00'}`,
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("basePrice"),
      }),
    },
    {
      title: "Current Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price?.toFixed(2) || '0.00'}`,
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("price"),
      }),
    },
    {
      title: "Stock Amount",
      dataIndex: "inStockAmount",
      key: "inStockAmount",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("inStockAmount"),
      }),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        if (record.inStockAmount > 0) {
          return <Tag color="green">In Stock</Tag>;
        }
        return <Tag color="red">Out of Stock</Tag>;
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="purple">{category || 'general'}</Tag>,
    },
    {
      title: "Featured",
      dataIndex: "isFeatured",
      key: "isFeatured",
      render: (featured) => (
        <Tag color={featured ? "gold" : "default"}>
          {featured ? "Featured" : "Regular"}
        </Tag>
      ),
    },
    {
      title: "Flavors",
      dataIndex: "flavors",
      key: "flavors",
      render: (flavors) => (
        <div>
          {flavors?.slice(0, 2).map((flavor, index) => (
            <Tag key={index} size="small">{flavor}</Tag>
          ))}
          {flavors?.length > 2 && <Tag size="small">+{flavors.length - 2}</Tag>}
        </div>
      ),
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
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedCake(record);
              form.setFieldsValue(record);
              setIsEditModalOpen(true);
            }}
            size="small"
          />
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              setSelectedCake(record);
              setStockAction("add");
              stockForm.resetFields();
              setIsStockModalOpen(true);
            }}
            size="small"
            title="Add Stock"
          />
          <Button
            icon={<MinusOutlined />}
            onClick={() => {
              setSelectedCake(record);
              setStockAction("reduce");
              stockForm.resetFields();
              setIsStockModalOpen(true);
            }}
            size="small"
            title="Reduce Stock"
          />
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            size="small"
          />
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
        <h2>Cake Management</h2>
        <Space>
          <Input
            placeholder="Search by name, type, category, or flavors..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 350 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setIsCreateModalOpen(true);
            }}
          >
            Add Cake
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
        dataSource={filteredAndSortedCakes}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />

      {/* Create Cake Modal */}
      <Modal
        title="Add New Cake"
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Create"
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Cake Name"
                rules={[
                  { required: true, message: "Please enter cake name" },
                  { whitespace: true, message: "Cake name cannot be empty" },
                  { max: 100, message: "Cake name cannot exceed 100 characters" },
                ]}
              >
                <Input placeholder="Enter cake name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cakeType"
                label="Cake Type"
                rules={[{ required: true, message: "Please select cake type" }]}
              >
                <Select placeholder="Select cake type">
                  <Select.Option value="vanilla">Vanilla</Select.Option>
                  <Select.Option value="chocolate">Chocolate</Select.Option>
                  <Select.Option value="strawberry">Strawberry</Select.Option>
                  <Select.Option value="redVelvet">Red Velvet</Select.Option>
                  <Select.Option value="lemon">Lemon</Select.Option>
                  <Select.Option value="carrot">Carrot</Select.Option>
                  <Select.Option value="funfetti">Funfetti</Select.Option>
                  <Select.Option value="custom">Custom</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter cake description" },
              { whitespace: true, message: "Description cannot be empty" },
              { max: 500, message: "Description cannot exceed 500 characters" },
            ]}
          >
            <Input.TextArea 
              placeholder="Enter cake description" 
              rows={3}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="basePrice"
                label="Base Price"
                rules={[
                  { required: true, message: "Please enter base price" },
                  {
                    type: "number",
                    min: 0,
                    message: "Base price must be a positive number",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter base price"
                  min={0}
                  step={0.01}
                  precision={2}
                  prefix="$"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Current Price"
                rules={[
                  { required: true, message: "Please enter current price" },
                  {
                    type: "number",
                    min: 0,
                    message: "Price must be a positive number",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter current price"
                  min={0}
                  step={0.01}
                  precision={2}
                  prefix="$"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="inStockAmount"
                label="Stock Amount"
                rules={[
                  { required: true, message: "Please enter stock amount" },
                  {
                    type: "number",
                    min: 0,
                    message: "Stock amount must be non-negative",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter stock amount"
                  min={0}
                  step={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select placeholder="Select category">
                  <Select.Option value="general">General</Select.Option>
                  <Select.Option value="birthday">Birthday</Select.Option>
                  <Select.Option value="wedding">Wedding</Select.Option>
                  <Select.Option value="anniversary">Anniversary</Select.Option>
                  <Select.Option value="seasonal">Seasonal</Select.Option>
                  <Select.Option value="holiday">Holiday</Select.Option>
                  <Select.Option value="corporate">Corporate</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="flavors"
            label="Available Flavors"
            rules={[{ required: true, message: "Please enter at least one flavor" }]}
          >
            <Select
              mode="tags"
              placeholder="Enter flavors (press Enter to add)"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="preparationTime"
                label="Preparation Time (hours)"
                rules={[
                  {
                    type: "number",
                    min: 1,
                    message: "Preparation time must be at least 1 hour",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter preparation time"
                  min={1}
                  step={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="minOrderQuantity"
                label="Min Order Quantity"
                rules={[
                  {
                    type: "number",
                    min: 1,
                    message: "Minimum order quantity must be at least 1",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter minimum order quantity"
                  min={1}
                  step={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="imageUrl"
            label="Image URL"
            rules={[
              {
                type: "url",
                message: "Please enter a valid URL",
              },
            ]}
          >
            <Input placeholder="Enter image URL (optional)" />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
          >
            <Select
              mode="tags"
              placeholder="Enter tags (press Enter to add)"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="isFeatured"
            label="Featured Cake"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Cake Modal */}
      <Modal
        title="Edit Cake"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedCake(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Update"
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Cake Name"
                rules={[
                  { required: true, message: "Please enter cake name" },
                  { whitespace: true, message: "Cake name cannot be empty" },
                  { max: 100, message: "Cake name cannot exceed 100 characters" },
                ]}
              >
                <Input placeholder="Enter cake name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cakeType"
                label="Cake Type"
                rules={[{ required: true, message: "Please select cake type" }]}
              >
                <Select placeholder="Select cake type">
                  <Select.Option value="vanilla">Vanilla</Select.Option>
                  <Select.Option value="chocolate">Chocolate</Select.Option>
                  <Select.Option value="strawberry">Strawberry</Select.Option>
                  <Select.Option value="redVelvet">Red Velvet</Select.Option>
                  <Select.Option value="lemon">Lemon</Select.Option>
                  <Select.Option value="carrot">Carrot</Select.Option>
                  <Select.Option value="funfetti">Funfetti</Select.Option>
                  <Select.Option value="custom">Custom</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter cake description" },
              { whitespace: true, message: "Description cannot be empty" },
              { max: 500, message: "Description cannot exceed 500 characters" },
            ]}
          >
            <Input.TextArea 
              placeholder="Enter cake description" 
              rows={3}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="basePrice"
                label="Base Price"
                rules={[
                  { required: true, message: "Please enter base price" },
                  {
                    type: "number",
                    min: 0,
                    message: "Base price must be a positive number",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter base price"
                  min={0}
                  step={0.01}
                  precision={2}
                  prefix="$"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Current Price"
                rules={[
                  { required: true, message: "Please enter current price" },
                  {
                    type: "number",
                    min: 0,
                    message: "Price must be a positive number",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter current price"
                  min={0}
                  step={0.01}
                  precision={2}
                  prefix="$"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="inStockAmount"
                label="Stock Amount"
                rules={[
                  { required: true, message: "Please enter stock amount" },
                  {
                    type: "number",
                    min: 0,
                    message: "Stock amount must be non-negative",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter stock amount"
                  min={0}
                  step={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select placeholder="Select category">
                  <Select.Option value="general">General</Select.Option>
                  <Select.Option value="birthday">Birthday</Select.Option>
                  <Select.Option value="wedding">Wedding</Select.Option>
                  <Select.Option value="anniversary">Anniversary</Select.Option>
                  <Select.Option value="seasonal">Seasonal</Select.Option>
                  <Select.Option value="holiday">Holiday</Select.Option>
                  <Select.Option value="corporate">Corporate</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="flavors"
            label="Available Flavors"
            rules={[{ required: true, message: "Please enter at least one flavor" }]}
          >
            <Select
              mode="tags"
              placeholder="Enter flavors (press Enter to add)"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="preparationTime"
                label="Preparation Time (hours)"
                rules={[
                  {
                    type: "number",
                    min: 1,
                    message: "Preparation time must be at least 1 hour",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter preparation time"
                  min={1}
                  step={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="minOrderQuantity"
                label="Min Order Quantity"
                rules={[
                  {
                    type: "number",
                    min: 1,
                    message: "Minimum order quantity must be at least 1",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter minimum order quantity"
                  min={1}
                  step={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="imageUrl"
            label="Image URL"
            rules={[
              {
                type: "url",
                message: "Please enter a valid URL",
              },
            ]}
          >
            <Input placeholder="Enter image URL (optional)" />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
          >
            <Select
              mode="tags"
              placeholder="Enter tags (press Enter to add)"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="isFeatured"
            label="Featured Cake"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Stock Update Modal */}
      <Modal
        title={`${stockAction === "add" ? "Add" : "Reduce"} Stock - ${selectedCake?.name}`}
        open={isStockModalOpen}
        onCancel={() => {
          setIsStockModalOpen(false);
          setSelectedCake(null);
          setStockAction("");
          stockForm.resetFields();
        }}
        onOk={() => stockForm.submit()}
        okText={stockAction === "add" ? "Add Stock" : "Reduce Stock"}
      >
        <Form form={stockForm} layout="vertical" onFinish={handleStockUpdate}>
          <Form.Item
            name="amount"
            label={`Amount to ${stockAction === "add" ? "Add" : "Reduce"}`}
            rules={[
              { required: true, message: `Please enter amount to ${stockAction}` },
              {
                type: "number",
                min: 1,
                message: "Amount must be at least 1",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder={`Enter amount to ${stockAction}`}
              min={1}
              step={1}
            />
          </Form.Item>
          {stockAction === "reduce" && (
            <div style={{ color: "#ff4d4f", fontSize: 12 }}>
              Current stock: {selectedCake?.inStockAmount}
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default CakeManagement;
