import React, { useState } from "react";
import { Button, Form, Input, Card, message } from "antd";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    if (values.email === "admin@admin.com" && values.password === "admin123") {
      messageApi.open({
        type: "success",
        content: "Login successful!",
        duration: 2,
      });
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1500);
    } else {
      messageApi.open({
        type: "error",
        content: "Invalid email or password",
        duration: 3,
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {contextHolder}
      <Card title="Admin Login" style={{ width: 400 }} className="shadow-lg">
        <Form
          name="adminLogin"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;
