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
  DatePicker,
  InputNumber,
  Alert,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { ingredientApi } from "@/api/ingredientApi";
import { supplierApi } from "@/api/supplierApi";
import moment from "moment";
const IngredientManagement = () => {
  const [ingredients, setIngredients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supplierLoading, setSupplierLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchIngredients();
    fetchSuppliers();
  }, []);

  const fetchIngredients = async () => {
    try {
      const data = await ingredientApi.getAllIngredients();
      setIngredients(data.filter((ing) => !ing.deleted));
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to fetch ingredients");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const data = await supplierApi.getAllSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to fetch suppliers");
    } finally {
      setSupplierLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      await ingredientApi.createIngredient(values);
      messageApi.success("Ingredient created successfully");
      setIsCreateModalOpen(false);
      form.resetFields();
      fetchIngredients();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to create ingredient");
    }
  };

  const handleUpdate = async (values) => {
    try {
      await ingredientApi.updateIngredient(selectedIngredient._id, values);
      messageApi.success("Ingredient updated successfully");
      setIsEditModalOpen(false);
      setSelectedIngredient(null);
      form.resetFields();
      fetchIngredients();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to update ingredient");
    }
  };

  const handleDelete = async (id) => {
    try {
      await ingredientApi.deleteIngredient(id);
      messageApi.success("Ingredient deleted successfully");
      fetchIngredients();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to delete ingredient");
    }
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    const headers = [
      "Name",
      "Quantity",
      "Unit",
      "Reorder Level",
      "Supplier",
      "Expiry Date",
      "Created At",
    ];
    const rows = ingredients.map((ingredient) => [
      ingredient.ingredientName,
      `${ingredient.quantityAvailable} ${ingredient.unit}`,
      ingredient.unit,
      ingredient.reorderLevel,
      ingredient.supplierId?.supplierName || "-",
      ingredient.expiryDate
        ? new Date(ingredient.expiryDate).toLocaleDateString()
        : "-",
      new Date(ingredient.createdAt).toLocaleDateString(),
    ]);

    doc.setFontSize(16);
    doc.text("Ingredients Report", 105, 20, { align: "center" });
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      margin: { top: 40 },
    });
    doc.save("ingredients-report.pdf");
  };

  const filteredAndSortedIngredients = ingredients
    .filter(
      (ingredient) =>
        ingredient.ingredientName
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        ingredient.supplierId?.supplierName
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

  // Calculate stock statistics
  const criticalStockItems = ingredients.filter(
    (ingredient) => ingredient.quantityAvailable <= ingredient.reorderLevel * 0.5
  );
  const lowStockItems = ingredients.filter(
    (ingredient) => 
      ingredient.quantityAvailable < ingredient.reorderLevel && 
      ingredient.quantityAvailable > ingredient.reorderLevel * 0.5
  );
  const totalItems = ingredients.length;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const columns = [
    {
      title: "Ingredient Name",
      dataIndex: "ingredientName",
      key: "ingredientName",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("ingredientName"),
      }),
    },
    {
      title: "Quantity Available",
      dataIndex: "quantityAvailable",
      key: "quantityAvailable",
      render: (qty, record) => `${qty} ${record.unit}`,
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("quantityAvailable"),
      }),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("unit"),
      }),
    },
    {
      title: "Reorder Level",
      dataIndex: "reorderLevel",
      key: "reorderLevel",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("reorderLevel"),
      }),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const isLowStock = record.quantityAvailable < record.reorderLevel;
        const isCriticalStock = record.quantityAvailable <= record.reorderLevel * 0.5;
        
        if (isCriticalStock) {
          return (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '4px 8px',
              backgroundColor: '#fff2f0',
              border: '1px solid #ffccc7',
              borderRadius: '4px'
            }}>
              <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />
              <span style={{ 
                color: '#ff4d4f', 
                fontWeight: 'bold',
                fontSize: '12px'
              }}>
                CRITICAL STOCK
              </span>
            </div>
          );
        }
        
        if (isLowStock) {
          return (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '4px 8px',
              backgroundColor: '#fff7e6',
              border: '1px solid #ffd591',
              borderRadius: '4px'
            }}>
              <ExclamationCircleOutlined style={{ color: '#fa8c16', fontSize: '16px' }} />
              <span style={{ 
                color: '#fa8c16', 
                fontWeight: 'bold',
                fontSize: '12px'
              }}>
                REORDER NEEDED
              </span>
            </div>
          );
        }
        
        return (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '4px 8px',
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: '4px'
          }}>
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
            <span style={{ 
              color: '#52c41a', 
              fontWeight: 'bold',
              fontSize: '12px'
            }}>
              STOCK OK
            </span>
          </div>
        );
      },
    },
    {
      title: "Supplier",
      dataIndex: "supplierId",
      key: "supplierId",
      render: (supplier) => supplier?.supplierName || "-",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("supplierId"),
      }),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
      sorter: true,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        onClick: () => handleSort("expiryDate"),
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
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedIngredient(record);
              form.setFieldsValue({
                ...record,
                supplierId: record.supplierId?._id || record.supplierId,
                expiryDate: record.expiryDate
                  ? moment(record.expiryDate)
                  : null,
              });
              setIsEditModalOpen(true);
            }}
            size="small"
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
        <h2>Ingredient Management</h2>
        <Space>
          <Input
            placeholder="Search by name or supplier..."
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
            Add Ingredient
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

      {/* Stock Alert Summary */}
      {(criticalStockItems.length > 0 || lowStockItems.length > 0) && (
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title="Critical Stock"
                value={criticalStockItems.length}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Low Stock"
                value={lowStockItems.length}
                valueStyle={{ color: '#fa8c16' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Total Items"
                value={totalItems}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Col>
          </Row>
          
          {criticalStockItems.length > 0 && (
            <Alert
              message="Critical Stock Alert"
              description={`${criticalStockItems.length} ingredient(s) are critically low on stock and need immediate attention.`}
              type="error"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
          
          {lowStockItems.length > 0 && criticalStockItems.length === 0 && (
            <Alert
              message="Low Stock Warning"
              description={`${lowStockItems.length} ingredient(s) are below reorder level and should be restocked soon.`}
              type="warning"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
        </div>
      )}

      <Table
        dataSource={filteredAndSortedIngredients}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />

      {/* Create Ingredient Modal */}
      <Modal
        title="Add New Ingredient"
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
            name="ingredientName"
            label="Ingredient Name"
            rules={[
              { required: true, message: "Please enter ingredient name" },
              { whitespace: true, message: "Ingredient name cannot be empty" },
            ]}
          >
            <Input placeholder="Enter ingredient name" />
          </Form.Item>
          <Form.Item
            name="quantityAvailable"
            label="Quantity Available"
            rules={[
              { required: true, message: "Please enter quantity available" },
              {
                type: "number",
                min: 0,
                message: "Quantity must be non-negative",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter quantity"
              min={0}
              step={0.1}
            />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Unit"
            rules={[{ required: true, message: "Please select unit" }]}
          >
            <Select placeholder="Select unit">
              <Select.Option value="kg">kg</Select.Option>
              <Select.Option value="g">g</Select.Option>
              <Select.Option value="l">L</Select.Option>
              <Select.Option value="ml">mL</Select.Option>
              <Select.Option value="pcs">Pcs</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="reorderLevel"
            label="Reorder Level"
            rules={[
              { required: true, message: "Please enter reorder level" },
              {
                type: "number",
                min: 0,
                message: "Reorder level must be non-negative",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter reorder level"
              min={0}
              step={0.1}
            />
          </Form.Item>
          <Form.Item
            name="supplierId"
            label="Supplier"
            rules={[{ required: true, message: "Please select a supplier" }]}
          >
            <Select
              placeholder="Select supplier"
              loading={supplierLoading}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {suppliers.map((supplier) => (
                <Select.Option
                  key={supplier._id}
                  value={supplier._id}
                  label={supplier.supplierName}
                >
                  {supplier.supplierName} ({supplier.contactPerson})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="expiryDate" label="Expiry Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Ingredient Modal */}
      <Modal
        title="Edit Ingredient"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedIngredient(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Update"
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="ingredientName"
            label="Ingredient Name"
            rules={[
              { required: true, message: "Please enter ingredient name" },
              { whitespace: true, message: "Ingredient name cannot be empty" },
            ]}
          >
            <Input placeholder="Enter ingredient name" />
          </Form.Item>
          <Form.Item
            name="quantityAvailable"
            label="Quantity Available"
            rules={[
              { required: true, message: "Please enter quantity available" },
              {
                type: "number",
                min: 0,
                message: "Quantity must be non-negative",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter quantity"
              min={0}
              step={0.1}
            />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Unit"
            rules={[{ required: true, message: "Please select unit" }]}
          >
            <Select placeholder="Select unit">
              <Select.Option value="kg">kg</Select.Option>
              <Select.Option value="g">g</Select.Option>
              <Select.Option value="l">L</Select.Option>
              <Select.Option value="ml">mL</Select.Option>
              <Select.Option value="pcs">Pcs</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="reorderLevel"
            label="Reorder Level"
            rules={[
              { required: true, message: "Please enter reorder level" },
              {
                type: "number",
                min: 0,
                message: "Reorder level must be non-negative",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter reorder level"
              min={0}
              step={0.1}
            />
          </Form.Item>
          <Form.Item
            name="supplierId"
            label="Supplier"
            rules={[{ required: true, message: "Please select a supplier" }]}
          >
            <Select
              placeholder="Select supplier"
              loading={supplierLoading}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {suppliers.map((supplier) => (
                <Select.Option
                  key={supplier._id}
                  value={supplier._id}
                  label={supplier.supplierName}
                >
                  {supplier.supplierName} ({supplier.contactPerson})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="expiryDate" label="Expiry Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IngredientManagement;
