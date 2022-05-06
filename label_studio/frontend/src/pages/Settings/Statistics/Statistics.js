import { useMemo, useState } from "react";
import { Card, Button } from "react-bootstrap";
import Table from 'react-bootstrap/Table'
import { useTranslation } from "react-i18next";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Statistics.css';

export const Statistics = () => {

  return (
  <div>
  <section className="Card">
  <h5 style={{fontFamily: 'Inter', fontWeight: '700'}}> THỐNG KÊ TOÀN DỰ ÁN </h5>
  <Card bg="primary" style={{width: '16rem',  textAlign: 'center'}}>
    <Card.Header>Tổng số tác vụ cần nhãn dán</Card.Header>
    <Card.Body>
      <Card.Title>5435435</Card.Title>
    </Card.Body>
  </Card>
  <br />

  <Card bg="danger" style={{width: '16rem',  textAlign: 'center'}}>
    <Card.Header>Tổng số tác vụ đã dán nhãn</Card.Header>
    <Card.Body>
      <Card.Title>12335</Card.Title>
    </Card.Body>
  </Card>
  <br />

  <Card bg="warning" style={{width: '16rem',  textAlign: 'center'}}>
    <Card.Header>Tổng số tác vụ bị bỏ qua</Card.Header>
    <Card.Body>
      <Card.Title>342</Card.Title>
    </Card.Body>
  </Card>
  <br />

  <Card bg="info" style={{width: '16rem',  textAlign: 'center'}}>
    <Card.Header>Tổng số nhãn dán hoàn thành</Card.Header>
    <Card.Body>
      <Card.Title>976865</Card.Title>
    </Card.Body>
  </Card>
  </section>
  <br />
  <br />
  <section className="table">
  <h5 style={{fontFamily: 'Inter', fontWeight: '700'}}> THỐNG KÊ TỪNG THÀNH VIÊN </h5>
  <Table responsive="sm">
    <thead>
      <tr>
        <th>#</th>
        <th>Table heading</th>
        <th>Table heading</th>
        <th>Table heading</th>
        <th>Table heading</th>
        <th>Table heading</th>
        <th>Table heading</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
    </tbody>
  </Table>
  <Table responsive="md">
    <thead>
      <tr>
        <th>#</th>
        <th>Table heading</th>
        <th>Table heading</th>
        <th>Table heading</th>
        <th>Table heading</th>
        <th>Table heading</th>
        <th>Table heading</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
    </tbody>
  </Table>
  <Table responsive="lg">
    <thead>
      <tr>
        <th>#</th>
        <th>Table heading</th>
        <th>Table heading</th>
        <th>Table heading</th>
        <th>Table heading</th>
        <th>Table heading</th>
        <th>Table heading</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
    </tbody>
  </Table>
  </section>
  </div>
  );
};

Statistics.title = "Thống kê";
Statistics.path = "/statistics";