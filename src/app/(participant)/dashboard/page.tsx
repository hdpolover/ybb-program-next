"use client";

import React from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import Link from "next/link";
import { YBB_ROUTES } from "../../../constants/ybb";

const DashboardOverview = () => {
  // Mock data - replace with real data from API
  const dashboardStats = {
    submissionStatus: "Draft",
    documentsUploaded: 3,
    paymentStatus: "Pending",
    profileCompletion: 75,
  };

  const recentActivity = [
    {
      id: 1,
      action: "Application started",
      timestamp: "2024-01-15 10:30 AM",
      status: "completed",
    },
    {
      id: 2,
      action: "Personal details updated", 
      timestamp: "2024-01-14 3:45 PM",
      status: "completed",
    },
    {
      id: 3,
      action: "Document uploaded",
      timestamp: "2024-01-13 2:15 PM", 
      status: "completed",
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      task: "Complete essay questions",
      priority: "high",
      dueDate: "2024-01-20",
    },
    {
      id: 2,
      task: "Upload passport copy",
      priority: "medium", 
      dueDate: "2024-01-25",
    },
    {
      id: 3,
      task: "Submit application",
      priority: "high",
      dueDate: "2024-01-30",
    },
  ];

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-danger";
      case "medium":
        return "bg-warning";
      case "low":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-warning";
      case "submitted":
        return "bg-info";
      case "approved":
        return "bg-success";
      case "pending":
        return "bg-warning";
      case "paid":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0">Dashboard</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <Link href={YBB_ROUTES.HOME}>YBB Platform</Link>
                </li>
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row>
        <Col xl={3} md={6}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    Application Status
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <h5 className={`fs-14 mb-0 badge ${getStatusBadgeColor(dashboardStats.submissionStatus)}`}>
                    {dashboardStats.submissionStatus}
                  </h5>
                </div>
              </div>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                    <span className="counter-value">In Progress</span>
                  </h4>
                  <Link href={YBB_ROUTES.PARTICIPANT.SUBMISSIONS} className="text-decoration-underline">
                    Continue Application
                  </Link>
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <span className="avatar-title bg-success-subtle rounded fs-3">
                    <i className="ri-file-text-line text-success"></i>
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} md={6}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    Documents
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <h5 className="text-success fs-14 mb-0">
                    <i className="ri-arrow-right-up-line fs-13 align-middle"></i>
                    +{dashboardStats.documentsUploaded}
                  </h5>
                </div>
              </div>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                    <span className="counter-value">{dashboardStats.documentsUploaded}</span>
                    <span className="text-muted fs-14"> / 5</span>
                  </h4>
                  <Link href={YBB_ROUTES.PARTICIPANT.DOCUMENTS} className="text-decoration-underline">
                    Upload More
                  </Link>
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <span className="avatar-title bg-info-subtle rounded fs-3">
                    <i className="ri-folder-line text-info"></i>
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} md={6}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    Payment Status
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <h5 className={`fs-14 mb-0 badge ${getStatusBadgeColor(dashboardStats.paymentStatus)}`}>
                    {dashboardStats.paymentStatus}
                  </h5>
                </div>
              </div>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                    <span className="counter-value">$500</span>
                  </h4>
                  <Link href={YBB_ROUTES.PARTICIPANT.PAYMENTS} className="text-decoration-underline">
                    Make Payment
                  </Link>
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <span className="avatar-title bg-warning-subtle rounded fs-3">
                    <i className="ri-bank-card-line text-warning"></i>
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} md={6}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    Profile Completion
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <h5 className="text-success fs-14 mb-0">
                    <i className="ri-arrow-right-up-line fs-13 align-middle"></i>
                    {dashboardStats.profileCompletion}%
                  </h5>
                </div>
              </div>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                    <span className="counter-value">{dashboardStats.profileCompletion}</span>%
                  </h4>
                  <Link href={YBB_ROUTES.PARTICIPANT.PROFILE} className="text-decoration-underline">
                    Complete Profile
                  </Link>
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <span className="avatar-title bg-primary-subtle rounded fs-3">
                    <i className="ri-user-line text-primary"></i>
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Recent Activity */}
        <Col xl={7}>
          <Card>
            <CardHeader className="align-items-center d-flex">
              <h4 className="card-title mb-0 flex-grow-1">Recent Activity</h4>
              <div className="flex-shrink-0">
                <button type="button" className="btn btn-soft-info btn-sm">
                  <i className="ri-file-list-3-line align-middle"></i> View All
                </button>
              </div>
            </CardHeader>

            <CardBody>
              <div className="acitivity-timeline">
                {recentActivity.map((activity, index) => (
                  <div className="acitivity-item d-flex" key={activity.id}>
                    <div className="flex-shrink-0">
                      <div className="acitivity-avatar">
                        <div className="avatar-xs">
                          <div className="avatar-title rounded-circle bg-success-subtle text-success">
                            <i className="ri-check-line"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1">{activity.action}</h6>
                      <p className="text-muted mb-0">{activity.timestamp}</p>
                      {index !== recentActivity.length - 1 && (
                        <div className="acitivity-divider mt-3"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Upcoming Tasks */}
        <Col xl={5}>
          <Card>
            <CardHeader className="align-items-center d-flex">
              <h4 className="card-title mb-0 flex-grow-1">Upcoming Tasks</h4>
              <div className="flex-shrink-0">
                <button type="button" className="btn btn-soft-primary btn-sm">
                  <i className="ri-add-line align-middle"></i> Add Task
                </button>
              </div>
            </CardHeader>

            <CardBody>
              <div className="table-responsive table-card">
                <table className="table table-borderless table-hover align-middle mb-0">
                  <tbody>
                    {upcomingTasks.map((task) => (
                      <tr key={task.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                              <h6 className="mb-1">{task.task}</h6>
                              <p className="text-muted mb-0">Due: {task.dueDate}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${getPriorityBadgeColor(task.priority)} fs-12`}>
                            {task.priority}
                          </span>
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
                                  View
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item">
                                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item">
                                  <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col xl={12}>
          <Card>
            <CardHeader>
              <h4 className="card-title mb-0">Quick Actions</h4>
            </CardHeader>
            <CardBody>
              <Row className="g-3">
                <Col lg={3} md={6}>
                  <Link href={YBB_ROUTES.PARTICIPANT.SUBMISSIONS} className="card border-0 shadow-sm text-decoration-none">
                    <CardBody className="text-center">
                      <div className="avatar-lg mx-auto mb-3">
                        <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-2">
                          <i className="ri-file-edit-line"></i>
                        </div>
                      </div>
                      <h5 className="mb-1">Continue Application</h5>
                      <p className="text-muted mb-0">Complete your submission</p>
                    </CardBody>
                  </Link>
                </Col>
                
                <Col lg={3} md={6}>
                  <Link href={YBB_ROUTES.PARTICIPANT.DOCUMENTS} className="card border-0 shadow-sm text-decoration-none">
                    <CardBody className="text-center">
                      <div className="avatar-lg mx-auto mb-3">
                        <div className="avatar-title bg-success-subtle text-success rounded-circle fs-2">
                          <i className="ri-upload-cloud-line"></i>
                        </div>
                      </div>
                      <h5 className="mb-1">Upload Documents</h5>
                      <p className="text-muted mb-0">Add required documents</p>
                    </CardBody>
                  </Link>
                </Col>
                
                <Col lg={3} md={6}>
                  <Link href={YBB_ROUTES.PARTICIPANT.PAYMENTS} className="card border-0 shadow-sm text-decoration-none">
                    <CardBody className="text-center">
                      <div className="avatar-lg mx-auto mb-3">
                        <div className="avatar-title bg-warning-subtle text-warning rounded-circle fs-2">
                          <i className="ri-secure-payment-line"></i>
                        </div>
                      </div>
                      <h5 className="mb-1">Make Payment</h5>
                      <p className="text-muted mb-0">Complete payment process</p>
                    </CardBody>
                  </Link>
                </Col>
                
                <Col lg={3} md={6}>
                  <Link href={YBB_ROUTES.PARTICIPANT.PROFILE} className="card border-0 shadow-sm text-decoration-none">
                    <CardBody className="text-center">
                      <div className="avatar-lg mx-auto mb-3">
                        <div className="avatar-title bg-info-subtle text-info rounded-circle fs-2">
                          <i className="ri-user-settings-line"></i>
                        </div>
                      </div>
                      <h5 className="mb-1">Update Profile</h5>
                      <p className="text-muted mb-0">Manage your information</p>
                    </CardBody>
                  </Link>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardOverview;