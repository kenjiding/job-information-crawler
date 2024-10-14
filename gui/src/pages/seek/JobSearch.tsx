import { Form, Input, Button, InputNumber, Table } from 'antd';
import Http from '../../utils/http';
// import { Outlet } from 'react-router-dom';
import type { TableProps } from 'antd';
import { useState } from 'react';
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'companyName',
    dataIndex: 'companyName',
    key: 'companyName',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'componyInfo',
    dataIndex: 'componyInfo',
    key: 'componyInfo',
  },
  {
    title: 'jobDescription',
    dataIndex: 'jobDescription',
    key: 'jobDescription',
    render: (text) => <p className='line-clamp-3'>{text}</p>,
  },
  {
    title: 'jobInfo',
    dataIndex: 'jobInfo',
    key: 'jobInfo',
  },
  {
    title: 'jobLocation',
    dataIndex: 'jobLocation',
    key: 'jobLocation',
  },
  {
    title: 'jobTitle',
    dataIndex: 'jobTitle',
    key: 'jobTitle',
  },
  {
    title: 'jobUrl',
    dataIndex: 'jobUrl',
    key: 'jobUrl',
    render: (text) => <Button type='primary' onClick={() => window.open(text)}>apply</Button>,
  },
];

const HorizontalForm = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tableData, setTableData] = useState<any[]>([
    {
      companyName: 'jsjdf',
      componyInfo: 'dg',
      jobDescription: 'dfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtgdfgtg',
      jobInfo: 'fg',
      jobLocation: 'dfg',
      jobTitle: 'gdfgthr',
      jobUrl: 'sdg',
    }
  ]);
  const onFinish = (values: object) => {
    Http.post('/add-job', {
      data: {
        ...values,
        scriptName: 'seek-search'
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).then((res: any) => {
      setTableData(res.data);
      console.log('res: ', res);

    }).catch((err) => {
      console.log('err: ', err);
    });
    console.log('Form Values:', values);
  };

  return (
    <div className='flex flex-col h-full'>
      <Form
        className='mb-4'
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
      <div className='flex-1 overflow-auto'>
        <Table<DataType> columns={columns} dataSource={tableData} />
      </div>
    </div>
  );
};

export default HorizontalForm;
