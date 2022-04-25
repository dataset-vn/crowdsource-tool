import { useMemo, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import 'bootstrap/dist/css/bootstrap.min.css';

export const Statistics = () => {

  return (
  <div>
  <Card border="primary" style={{ width: '18rem' }}>
    <Card.Header>Tổng số tác vụ cần nhãn dán</Card.Header>
    <Card.Body>
      <Card.Title>5435435</Card.Title>
    </Card.Body>
  </Card>
  <br />

  <Card border="danger" style={{ width: '18rem' }}>
    <Card.Header>Tổng số tác vụ đã dán nhãn</Card.Header>
    <Card.Body>
      <Card.Title>12335</Card.Title>
    </Card.Body>
  </Card>
  <br />

  <Card border="warning" style={{ width: '18rem' }}>
    <Card.Header>Tổng số tác vụ bị bỏ qua</Card.Header>
    <Card.Body>
      <Card.Title>342</Card.Title>
    </Card.Body>
  </Card>
  <br />

  <Card border="info" style={{ width: '18rem' }}>
    <Card.Header>Tổng số nhãn dán hoàn thành</Card.Header>
    <Card.Body>
      <Card.Title>976865</Card.Title>
    </Card.Body>
  </Card>
  </div>
  );
};

Statistics.title = "Thống kê";
Statistics.path = "/statistics";