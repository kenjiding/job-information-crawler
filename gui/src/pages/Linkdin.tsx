import React from 'react';
import { Form, Input, Button } from 'antd';

const HorizontalForm = () => {
  const onFinish = (values: unknown) => {
    console.log('Form Values:', values);
  };

  return (
    <Form
      layout="inline"
      onFinish={onFinish}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input placeholder="Enter your username" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password placeholder="Enter your password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default HorizontalForm;
