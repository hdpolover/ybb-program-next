"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader, Col, Row, Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import Link from "next/link";
import { YBB_ROUTES } from "../../../constants/ybb";

const PaymentsPage = () => {
  const [isPaymentModal, setIsPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");

  // Mock data for payments
  const [payments] = useState([
    {
      id: 1,
      description: "Istanbul Youth Summit 2026 - Application Fee",
      amount: 500,
      currency: "USD",
      status: "pending",
      dueDate: "2024-01-30",
      createdDate: "2024-01-15",
      paymentMethod: null,
      reference: "YBB-2026-001",
    },
    {
      id: 2,
      description: "Youth Leadership Program - Processing Fee",
      amount: 50,
      currency: "USD", 
      status: "paid",
      dueDate: "2023-12-31",
      createdDate: "2023-12-20",
      paymentDate: "2023-12-22",
      paymentMethod: "Credit Card",
      reference: "YBB-2023-045",
      transactionId: "txn_1234567890",
    },
    {
      id: 3,
      description: "Follow-up Program Fee",
      amount: 200,
      currency: "USD",
      status: "failed",
      dueDate: "2024-01-20",
      createdDate: "2024-01-10",
      paymentMethod: "Credit Card",
      reference: "YBB-2024-012",
      failureReason: "Insufficient funds",
    },
  ]);

  const paymentSummary = {
    totalOutstanding: payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0),
    totalPaid: payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0),
    nextDueAmount: payments.find(p => p.status === "pending")?.amount || 0,
    nextDueDate: payments.find(p => p.status === "pending")?.dueDate || null,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge color="success">Paid</Badge>;
      case "pending":
        return <Badge color="warning">Pending</Badge>;
      case "failed":
        return <Badge color="danger">Failed</Badge>;
      case "processing":
        return <Badge color="info">Processing</Badge>;
      case "refunded":
        return <Badge color="secondary">Refunded</Badge>;
      default:
        return <Badge color="secondary">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const isOverdue = (dueDate: string, status: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    return due < now && status === "pending";
  };

  const handlePayment = () => {
    // TODO: Implement payment processing
    console.log("Processing payment with method:", selectedPaymentMethod);
    setIsPaymentModal(false);
    // Show success message or redirect to payment processor
  };

  return (
    <div>
      {/* Page Title */}
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0">Payments</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <Link href={YBB_ROUTES.PARTICIPANT.DASHBOARD}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Payments</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <Row className="mb-4">
        <Col xl={3} lg={6}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    Total Outstanding
                  </p>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-0 text-danger">
                    {formatCurrency(paymentSummary.totalOutstanding)}
                  </h4>
                </div>
                <div className="flex-shrink-0">
                  <div className="avatar-sm">
                    <span className="avatar-title bg-soft-danger text-danger rounded fs-3">
                      <i className="ri-money-dollar-circle-line"></i>
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    Total Paid
                  </p>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-0 text-success">
                    {formatCurrency(paymentSummary.totalPaid)}
                  </h4>
                </div>
                <div className="flex-shrink-0">
                  <div className="avatar-sm">
                    <span className="avatar-title bg-soft-success text-success rounded fs-3">
                      <i className="ri-check-double-line"></i>
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    Next Payment
                  </p>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                    {paymentSummary.nextDueAmount > 0 ? formatCurrency(paymentSummary.nextDueAmount) : "None"}
                  </h4>
                  {paymentSummary.nextDueDate && (
                    <small className="text-muted">Due: {formatDate(paymentSummary.nextDueDate)}</small>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <div className="avatar-sm">
                    <span className="avatar-title bg-soft-warning text-warning rounded fs-3">
                      <i className="ri-calendar-check-line"></i>
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    Payment Count
                  </p>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                    {payments.length}
                  </h4>
                </div>
                <div className="flex-shrink-0">
                  <div className="avatar-sm">
                    <span className="avatar-title bg-soft-info text-info rounded fs-3">
                      <i className="ri-list-check-line"></i>
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Outstanding Payments Alert */}
      {paymentSummary.totalOutstanding > 0 && (
        <Row className="mb-4">
          <Col lg={12}>
            <div className="alert alert-warning">
              <h6 className="alert-heading">
                <i className="ri-error-warning-line me-2"></i>
                Outstanding Payments
              </h6>
              <p className="mb-3">
                You have {formatCurrency(paymentSummary.totalOutstanding)} in outstanding payments. 
                Please complete your payment to avoid delays in your application processing.
              </p>
              <Button color="warning" size="sm" onClick={() => setIsPaymentModal(true)}>
                <i className="ri-secure-payment-line me-1"></i> Make Payment Now
              </Button>
            </div>
          </Col>
        </Row>
      )}

      {/* Payments History */}
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader className="align-items-center d-flex">
              <h4 className="card-title mb-0 flex-grow-1">Payment History</h4>
              <div className="flex-shrink-0">
                <Button color="soft-primary" size="sm">
                  <i className="ri-download-line align-middle me-1"></i> Export
                </Button>
              </div>
            </CardHeader>

            <CardBody>
              {payments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Payment Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td>
                            <div>
                              <h6 className="mb-1">{payment.description}</h6>
                              <p className="text-muted mb-0 fs-13">
                                Ref: {payment.reference}
                                {payment.transactionId && (
                                  <span className="ms-2">• TxnID: {payment.transactionId}</span>
                                )}
                              </p>
                              {isOverdue(payment.dueDate, payment.status) && (
                                <Badge color="danger" className="mt-1">Overdue</Badge>
                              )}
                            </div>
                          </td>
                          <td>
                            <h6 className="mb-0">{formatCurrency(payment.amount, payment.currency)}</h6>
                          </td>
                          <td>{formatDate(payment.dueDate)}</td>
                          <td>
                            {payment.paymentDate ? (
                              formatDate(payment.paymentDate)
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            {getStatusBadge(payment.status)}
                            {payment.failureReason && (
                              <div>
                                <small className="text-danger">{payment.failureReason}</small>
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="dropdown">
                              <button
                                className="btn btn-soft-secondary btn-sm dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="ri-more-fill align-middle"></i>
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                  <button className="dropdown-item">
                                    <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
                                    View Details
                                  </button>
                                </li>
                                {payment.status === "paid" && (
                                  <li>
                                    <button className="dropdown-item">
                                      <i className="ri-download-2-line align-bottom me-2 text-muted"></i>
                                      Download Receipt
                                    </button>
                                  </li>
                                )}
                                {(payment.status === "pending" || payment.status === "failed") && (
                                  <li>
                                    <button 
                                      className="dropdown-item"
                                      onClick={() => setIsPaymentModal(true)}
                                    >
                                      <i className="ri-secure-payment-line align-bottom me-2 text-muted"></i>
                                      {payment.status === "failed" ? "Retry Payment" : "Make Payment"}
                                    </button>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="avatar-lg mx-auto mb-4">
                    <div className="avatar-title bg-soft-primary text-primary rounded-circle fs-1">
                      <i className="ri-money-dollar-circle-line"></i>
                    </div>
                  </div>
                  <h4 className="mb-3">No Payments Yet</h4>
                  <p className="text-muted mb-0">
                    Your payment history will appear here once you have transactions.
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Payment Methods Info */}
      <Row className="mt-4">
        <Col lg={6}>
          <Card>
            <CardHeader>
              <h4 className="card-title mb-0">Accepted Payment Methods</h4>
            </CardHeader>
            <CardBody>
              <div className="row g-3">
                <div className="col-6">
                  <div className="d-flex align-items-center p-3 border rounded">
                    <i className="ri-bank-card-line fs-2 text-primary me-3"></i>
                    <div>
                      <h6 className="mb-1">Credit Cards</h6>
                      <small className="text-muted">Visa, Mastercard, Amex</small>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center p-3 border rounded">
                    <i className="ri-paypal-line fs-2 text-info me-3"></i>
                    <div>
                      <h6 className="mb-1">PayPal</h6>
                      <small className="text-muted">Secure online payment</small>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center p-3 border rounded">
                    <i className="ri-bank-line fs-2 text-success me-3"></i>
                    <div>
                      <h6 className="mb-1">Bank Transfer</h6>
                      <small className="text-muted">Direct bank transfer</small>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center p-3 border rounded">
                    <i className="ri-smartphone-line fs-2 text-warning me-3"></i>
                    <div>
                      <h6 className="mb-1">Mobile Payment</h6>
                      <small className="text-muted">Apple Pay, Google Pay</small>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={6}>
          <Card>
            <CardHeader>
              <h4 className="card-title mb-0">Payment Information</h4>
            </CardHeader>
            <CardBody>
              <div className="vstack gap-3">
                <div className="d-flex align-items-start">
                  <i className="ri-shield-check-line text-success me-3 mt-1"></i>
                  <div>
                    <h6 className="mb-1">Secure Payments</h6>
                    <small className="text-muted">
                      All payments are processed through secure, encrypted channels
                    </small>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <i className="ri-refund-line text-info me-3 mt-1"></i>
                  <div>
                    <h6 className="mb-1">Refund Policy</h6>
                    <small className="text-muted">
                      Refunds available within 7 days of payment for eligible cases
                    </small>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <i className="ri-customer-service-line text-warning me-3 mt-1"></i>
                  <div>
                    <h6 className="mb-1">Payment Support</h6>
                    <small className="text-muted">
                      Contact support for any payment-related issues or questions
                    </small>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <i className="ri-receipt-line text-primary me-3 mt-1"></i>
                  <div>
                    <h6 className="mb-1">Digital Receipts</h6>
                    <small className="text-muted">
                      Instant receipts sent to your email after successful payment
                    </small>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Payment Modal */}
      <Modal isOpen={isPaymentModal} toggle={() => setIsPaymentModal(!isPaymentModal)} size="lg">
        <ModalHeader toggle={() => setIsPaymentModal(!isPaymentModal)}>
          Make Payment
        </ModalHeader>
        <ModalBody>
          <div className="mb-4 p-3 bg-light rounded">
            <h6 className="mb-2">Payment Details</h6>
            <div className="d-flex justify-content-between">
              <span>Amount Due:</span>
              <strong>{formatCurrency(paymentSummary.nextDueAmount)}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Processing Fee:</span>
              <strong>{formatCurrency(paymentSummary.nextDueAmount * 0.03)}</strong>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <span><strong>Total:</strong></span>
              <strong className="text-primary">
                {formatCurrency(paymentSummary.nextDueAmount + (paymentSummary.nextDueAmount * 0.03))}
              </strong>
            </div>
          </div>

          <Form>
            <FormGroup>
              <Label>Payment Method</Label>
              <div className="vstack gap-2">
                <div className="form-check">
                  <Input
                    type="radio"
                    id="paymentCard"
                    name="paymentMethod"
                    value="card"
                    checked={selectedPaymentMethod === "card"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  />
                  <Label className="form-check-label" htmlFor="paymentCard">
                    <i className="ri-bank-card-line me-2"></i>
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="form-check">
                  <Input
                    type="radio"
                    id="paymentPaypal"
                    name="paymentMethod"
                    value="paypal"
                    checked={selectedPaymentMethod === "paypal"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  />
                  <Label className="form-check-label" htmlFor="paymentPaypal">
                    <i className="ri-paypal-line me-2"></i>
                    PayPal
                  </Label>
                </div>
                <div className="form-check">
                  <Input
                    type="radio"
                    id="paymentBank"
                    name="paymentMethod"
                    value="bank"
                    checked={selectedPaymentMethod === "bank"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  />
                  <Label className="form-check-label" htmlFor="paymentBank">
                    <i className="ri-bank-line me-2"></i>
                    Bank Transfer
                  </Label>
                </div>
              </div>
            </FormGroup>

            {selectedPaymentMethod === "card" && (
              <>
                <Row>
                  <Col lg={12}>
                    <FormGroup>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        type="text"
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <FormGroup>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        type="text"
                        id="expiryDate"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg={6}>
                    <FormGroup>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        type="text"
                        id="cvv"
                        placeholder="123"
                        maxLength={4}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    type="text"
                    id="cardName"
                    placeholder="John Doe"
                  />
                </FormGroup>
              </>
            )}

            {selectedPaymentMethod === "bank" && (
              <div className="alert alert-info">
                <h6 className="alert-heading">Bank Transfer Instructions</h6>
                <p className="mb-2">Please transfer the payment to the following account:</p>
                <ul className="mb-0">
                  <li>Account Name: YBB Platform Ltd</li>
                  <li>Account Number: 1234567890</li>
                  <li>Routing Number: 123456789</li>
                  <li>Reference: Include your payment reference number</li>
                </ul>
              </div>
            )}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="soft-secondary" onClick={() => setIsPaymentModal(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handlePayment}>
            <i className="ri-secure-payment-line me-1"></i>
            {selectedPaymentMethod === "bank" ? "Get Instructions" : "Pay Now"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default PaymentsPage;