import { Form, Input, Button, InputNumber } from 'antd';
import Http from '../../utils/http';
import { Outlet } from 'react-router-dom';

const HorizontalForm = () => {
  const onFinish = (values: unknown) => {
    Http.post('/add-job', {
      data: {
        scriptName: 'start'
      }
    }).then((res) => {
      console.log('res: ', res);

    }).catch((err) => {
      console.log('err: ', err);
    });
    console.log('Form Values:', values);
  };

  return (
    <div>
      <Form
        layout="inline"
        onFinish={onFinish}
      >
        <Form.Item
          label="keywords"
          name="keywords"
          className='pb-3'
          rules={[{ required: true, message: 'Please input keywords!' }]}
        >
          <Input placeholder="Enter keywords" />
        </Form.Item>

        <Form.Item
          label="location"
          name="location"
          rules={[{ required: false, message: 'Please input location!' }]}
        >
          <Input placeholder="Enter location" />
        </Form.Item>
        <Form.Item
          label="titleIncludes"
          name="titleIncludes"
          rules={[{ required: false, message: 'Please input titleIncludes!' }]}
        >
          <Input placeholder="Enter titleIncludes" />
        </Form.Item>

        <Form.Item
          label="ignores"
          name="ignores"
          rules={[{ required: false, message: 'Please input ignores!' }]}
        >
          <Input placeholder="Enter ignores" />
        </Form.Item>
        <Form.Item
          label="pages"
          name="pages"
          rules={[{ required: false, message: 'Please input pages!' }]}
        >
          <InputNumber placeholder="Enter pages" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            add a job
          </Button>
        </Form.Item>
      </Form>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default HorizontalForm;
