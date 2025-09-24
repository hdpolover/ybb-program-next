"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader, Col, Row, Button, Badge } from "reactstrap";
import Link from "next/link";
import { YBB_ROUTES } from "../../../constants/ybb";

const SubmissionsPage = () => {
  // Mock data for submissions
  const [submissions] = useState([
    {
      id: 1,
      title: "Istanbul Youth Summit 2026 Application",
      status: "draft",
      progress: 45,
      createdAt: "2024-01-15",
      lastModified: "2024-01-16",
      dueDate: "2024-01-30",
      type: "Application",
    },
    {
      id: 2, 
      title: "Youth Leadership Program 2026",
      status: "submitted",
      progress: 100,
      createdAt: "2023-12-20",
      lastModified: "2023-12-22",
      dueDate: "2023-12-31",
      type: "Application",
    },
    {
      id: 3,
      title: "Follow-up Essay Submission", 
      status: "under_review",
      progress: 100,
      createdAt: "2024-01-10",
      lastModified: "2024-01-12",
      dueDate: "2024-01-15",
      type: "Essay",
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge color="warning">Draft</Badge>;
      case "submitted":
        return <Badge color="info">Submitted</Badge>;
      case "under_review":
        return <Badge color="primary">Under Review</Badge>;
      case "approved":
        return <Badge color="success">Approved</Badge>;
      case "rejected":
        return <Badge color="danger">Rejected</Badge>;
      default:
        return <Badge color="secondary">Unknown</Badge>;
    }
  };

  const getProgressBarColor = (progress: number) => {
    if (progress < 25) return "bg-danger";
    if (progress < 50) return "bg-warning";
    if (progress < 75) return "bg-info";
    return "bg-success";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate: string, status: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    return due < now && (status === "draft" || status === "in_progress");
  };

  return (
    <div>
      {/* Page Title */}
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0">Submissions</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <Link href={YBB_ROUTES.PARTICIPANT.DASHBOARD}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Submissions</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row">
        <div className="col-lg-12">
          <div className="d-flex align-items-center mb-3">
            <div className="flex-grow-1">
              <h5 className="card-title mb-0">My Submissions</h5>
            </div>
            <div className="flex-shrink-0">
              <Link href="/participant/submissions/new" className="btn btn-primary">
                <i className="ri-add-line align-bottom me-1"></i> New Submission
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <Row>
        {submissions.map((submission) => (
          <Col lg={12} key={submission.id}>
            <Card className="mb-3">
              <CardBody>
                <Row className="align-items-center">
                  <Col lg={8}>
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="avatar-sm">
                          <div className="avatar-title bg-soft-primary text-primary rounded fs-2">
                            <i className="ri-file-text-line"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h5 className="fs-16 mb-1">
                          <Link 
                            href={`/participant/submissions/${submission.id}`}
                            className="text-body text-decoration-none"
                          >
                            {submission.title}
                          </Link>
                          {isOverdue(submission.dueDate, submission.status) && (
                            <Badge color="danger" className="ms-2">
                              Overdue
                            </Badge>
                          )}
                        </h5>
                        <div className="d-flex align-items-center text-muted">
                          <small className="me-3">
                            <i className="ri-calendar-line me-1"></i>
                            Created: {formatDate(submission.createdAt)}
                          </small>
                          <small className="me-3">
                            <i className="ri-time-line me-1"></i>
                            Modified: {formatDate(submission.lastModified)}
                          </small>
                          <small>
                            <i className="ri-alarm-line me-1"></i>
                            Due: {formatDate(submission.dueDate)}
                          </small>
                        </div>
                        <div className="mt-2">
                          <div className="d-flex align-items-center">
                            <small className="text-muted me-2">Progress:</small>
                            <div className="progress flex-grow-1 me-2" style={{ height: "6px" }}>
                              <div
                                className={`progress-bar ${getProgressBarColor(submission.progress)}`}
                                role="progressbar"
                                style={{ width: `${submission.progress}%` }}
                                aria-valuenow={submission.progress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              ></div>
                            </div>
                            <small className="text-muted">{submission.progress}%</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg={2}>
                    <div className="text-center">
                      <Badge color="soft-info" className="fs-12">
                        {submission.type}
                      </Badge>
                      <div className="mt-2">
                        {getStatusBadge(submission.status)}
                      </div>
                    </div>
                  </Col>
                  <Col lg={2}>
                    <div className="text-end">
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
                            <Link
                              className="dropdown-item"
                              href={`/participant/submissions/${submission.id}`}
                            >
                              <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
                              View
                            </Link>
                          </li>
                          {(submission.status === "draft" || submission.status === "in_progress") && (
                            <li>
                              <Link
                                className="dropdown-item"
                                href={`/participant/submissions/${submission.id}/edit`}
                              >
                                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                                Edit
                              </Link>
                            </li>
                          )}
                          <li>
                            <button className="dropdown-item">
                              <i className="ri-download-2-line align-bottom me-2 text-muted"></i>
                              Download PDF
                            </button>
                          </li>
                          {submission.status === "draft" && (
                            <>
                              <li>
                                <hr className="dropdown-divider" />
                              </li>
                              <li>
                                <button className="dropdown-item text-danger">
                                  <i className="ri-delete-bin-fill align-bottom me-2"></i>
                                  Delete
                                </button>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Empty State */}
      {submissions.length === 0 && (
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody className="text-center py-5">
                <div className="avatar-lg mx-auto mb-4">
                  <div className="avatar-title bg-soft-primary text-primary rounded-circle fs-1">
                    <i className="ri-file-add-line"></i>
                  </div>
                </div>
                <h4 className="mb-3">No Submissions Yet</h4>
                <p className="text-muted mb-4">
                  You haven&apos;t created any submissions yet. Start by creating your first application.
                </p>
                <Link href="/participant/submissions/new" className="btn btn-primary">
                  <i className="ri-add-line me-1"></i> Create New Submission
                </Link>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Statistics Cards */}
      <Row className="mt-4">
        <Col xl={3} lg={6}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    Total Submissions
                  </p>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                    <span className="counter-value">{submissions.length}</span>
                  </h4>
                </div>
                <div className="flex-shrink-0">
                  <div className="avatar-sm">
                    <span className="avatar-title bg-soft-primary text-primary rounded fs-3">
                      <i className="ri-file-list-3-line"></i>
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
                    Draft Submissions
                  </p>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                    <span className="counter-value">
                      {submissions.filter(s => s.status === "draft").length}
                    </span>
                  </h4>
                </div>
                <div className="flex-shrink-0">
                  <div className="avatar-sm">
                    <span className="avatar-title bg-soft-warning text-warning rounded fs-3">
                      <i className="ri-edit-line"></i>
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
                    Submitted
                  </p>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                    <span className="counter-value">
                      {submissions.filter(s => s.status === "submitted").length}
                    </span>
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
                    Under Review
                  </p>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                    <span className="counter-value">
                      {submissions.filter(s => s.status === "under_review").length}
                    </span>
                  </h4>
                </div>
                <div className="flex-shrink-0">
                  <div className="avatar-sm">
                    <span className="avatar-title bg-soft-info text-info rounded fs-3">
                      <i className="ri-eye-line"></i>
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SubmissionsPage;