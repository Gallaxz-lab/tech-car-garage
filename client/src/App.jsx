import React, { useState, useEffect } from 'react';
import {
  Layout, Typography, Flex, Button, Row, Col, Card,
  Modal, Form, Input, InputNumber, Popconfirm, message, Tag, Empty, Pagination
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, CarOutlined
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const API_URL = 'http://localhost:5000';

export default function App() {
  const [cars, setCars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchCars = async () => {
    try {
      const res = await fetch(`${API_URL}/api/cars?page=${page}`);
      const data = await res.json();
      setCars(data.cars || []);
      setTotal(data.total || 0);
    } catch {
      message.error('Failed to load cars from server');
    }
  };

  useEffect(() => {
    fetchCars();
  }, [page]);

  const openModal = (car = null) => {
    setEditingCar(car);
    if (car) {
      form.setFieldsValue(car);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSave = async (values) => {
    const url = editingCar
      ? `${API_URL}/api/cars/${editingCar.id}`
      : `${API_URL}/api/cars`;
    const method = editingCar ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error();

      message.success(editingCar ? 'Car updated!' : 'Car added!');
      setIsModalOpen(false);
      fetchCars();
    } catch {
      message.error('Failed to save car');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/cars/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();

      message.success('Car deleted!');
      fetchCars();
    } catch {
      message.error('Failed to delete car');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header style={{ background: '#001529', display: 'flex', alignItems: 'center' }}>
        <Title level={4} style={{ color: '#fff', margin: 0 }}>
          <CarOutlined style={{ marginRight: 8 }} />
          Car Inventory Management
        </Title>
      </Header>

      <Content style={{ maxWidth: 1100, width: '100%', margin: '24px auto', padding: '0 16px' }}>

        <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
          <Title level={4} style={{ margin: 0 }}>
            All Cars ({total})
          </Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Add New Car
          </Button>
        </Flex>


        {cars.length === 0 ? (
          <Empty description="No cars recorded yet" style={{ margin: '48px 0' }} />
        ) : (
          <Row gutter={[16, 16]}>
            {cars.map((car) => (
              <Col xs={24} sm={12} md={8} key={car.id}>
                <Card
                  hoverable
                  actions={[
                    <Button type="text" icon={<EditOutlined />} onClick={() => openModal(car)}>
                      Edit
                    </Button>,
                    <Popconfirm
                      title={`Delete ${car.registration_number}?`}
                      onConfirm={() => handleDelete(car.id)}
                      okText="Delete"
                      okButtonProps={{ danger: true }}
                    >
                      <Button type="text" danger icon={<DeleteOutlined />}>
                        Delete
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                    <Tag color="blue" style={{ fontWeight: 600 }}>
                      {car.registration_number}
                    </Tag>
                    <Text type="secondary">{car.year || 'N/A'}</Text>
                  </Flex>
                  <Title level={5} style={{ margin: '0 0 4px' }}>
                    {car.brand} {car.model}
                  </Title>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>
                    Odometer: {(car.odometer || 0).toLocaleString()} km
                  </Text>
                  <Text ellipsis style={{ display: 'block' }}>
                    {car.notes || 'No notes'}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        )}
        {total > 0 && (
          <Flex justify="space-between" align="center" style={{ marginTop: 24 }}>
            <Text type="secondary">
              Showing {(page - 1) * 6 + 1}–{Math.min(page * 6, total)} of {total}
            </Text>
            <Pagination
              simple={{ readOnly: true }}
              current={page}
              pageSize={6}
              total={total}
              onChange={(newPage) => setPage(newPage)}
            />
          </Flex>
        )}
      </Content>

      <Modal
        title={editingCar ? `Edit ${editingCar.registration_number}` : 'Add New Car'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="registration_number"
            label="Car Registration Number"
            rules={[{ required: true, message: 'Please enter registration number' }]}
          >
            <Input placeholder="e.g. กข-1234" />
          </Form.Item>

          <Flex gap="middle">
            <Form.Item
              name="brand"
              label="Brand"
              rules={[{ required: true, message: 'Required' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="e.g. Toyota" />
            </Form.Item>
            <Form.Item
              name="model"
              label="Model"
              rules={[{ required: true, message: 'Required' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="e.g. Camry" />
            </Form.Item>
          </Flex>

          <Flex gap="middle">
            <Form.Item name="year" label="Year" style={{ flex: 1 }}>
              <InputNumber min={1950} max={2030} style={{ width: '100%' }} placeholder="2023" />
            </Form.Item>
            <Form.Item name="odometer" label="Odometer (km)" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} placeholder="35000" />
            </Form.Item>
          </Flex>

          <Form.Item name="notes" label="Notes / Etc.">
            <Input.TextArea rows={2} placeholder="Extra details..." />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}
