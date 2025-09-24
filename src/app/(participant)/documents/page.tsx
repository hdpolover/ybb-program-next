"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader, Col, Row, Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Progress } from "reactstrap";
import Link from "next/link";
import { YBB_ROUTES } from "../../../constants/ybb";

const DocumentsPage = () => {
  const [isUploadModal, setIsUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Mock data for documents
  const [documents] = useState([
    {
      id: 1,
      name: "Passport Copy",
      type: "Identity Document",
      fileName: "passport-john-doe.pdf",
      fileSize: "2.4 MB",
      uploadDate: "2024-01-15",
      status: "approved",
      required: true,
      description: "Clear copy of your passport showing photo and personal details"
    },
    {
      id: 2,
      name: "Academic Transcript",
      type: "Education Document", 
      fileName: "transcript-university.pdf",
      fileSize: "1.8 MB",
      uploadDate: "2024-01-14",
      status: "pending",
      required: true,
      description: "Official transcript from your current or most recent educational institution"
    },
    {
      id: 3,
      name: "CV/Resume",
      type: "Professional Document",
      fileName: "resume-john-doe.pdf", 
      fileSize: "856 KB",
      uploadDate: "2024-01-13",
      status: "approved",
      required: true,
      description: "Updated CV highlighting your experience and achievements"
    },
    {
      id: 4,
      name: "Recommendation Letter",
      type: "Support Document",
      fileName: "recommendation-letter.pdf",
      fileSize: "1.2 MB", 
      uploadDate: "2024-01-12",
      status: "under_review",
      required: false,
      description: "Letter of recommendation from a professor, employer, or mentor"
    },
  ]);

  const requiredDocuments = [
    {
      name: "Passport Copy",
      description: "Clear copy of your passport showing photo and personal details",
      maxSize: "5 MB",
      formats: "PDF, JPG, PNG"
    },
    {
      name: "Academic Transcript", 
      description: "Official transcript from your current or most recent educational institution",
      maxSize: "10 MB",
      formats: "PDF"
    },
    {
      name: "CV/Resume",
      description: "Updated CV highlighting your experience and achievements", 
      maxSize: "5 MB",
      formats: "PDF, DOC, DOCX"
    },
    {
      name: "Photo",
      description: "Professional headshot photo",
      maxSize: "2 MB", 
      formats: "JPG, PNG"
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge color="success">Approved</Badge>;
      case "pending":
        return <Badge color="warning">Pending Review</Badge>;
      case "under_review":
        return <Badge color="info">Under Review</Badge>;
      case "rejected":
        return <Badge color="danger">Rejected</Badge>;
      default:
        return <Badge color="secondary">Unknown</Badge>;
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return "ri-file-pdf-line text-danger";
      case 'doc':
      case 'docx':
        return "ri-file-word-line text-primary";
      case 'jpg':
      case 'jpeg':
      case 'png':
        return "ri-image-line text-success";
      default:
        return "ri-file-line text-muted";
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsUploadModal(false);
          setSelectedFile(null);
          setUploadProgress(0);
          // TODO: Add document to list or refresh from API
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (sizeString: string) => {
    return sizeString;
  };

  return (
    <div>
      {/* Page Title */}
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0">Documents</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <Link href={YBB_ROUTES.PARTICIPANT.DASHBOARD}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Documents</li>
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
              <h5 className="card-title mb-0">Document Manager</h5>
            </div>
            <div className="flex-shrink-0">
              <Button color="primary" onClick={() => setIsUploadModal(true)}>
                <i className="ri-upload-cloud-line align-bottom me-1"></i> Upload Document
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Statistics */}
      <Row className="mb-4">
        <Col xl={3} lg={6}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    Total Documents
                  </p>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                    <span className="counter-value">{documents.length}</span>
                  </h4>
                </div>
                <div className="flex-shrink-0">
                  <div className="avatar-sm">
                    <span className="avatar-title bg-soft-primary text-primary rounded fs-3">
                      <i className="ri-folder-line"></i>
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
                    Approved
                  </p>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                    <span className="counter-value">
                      {documents.filter(d => d.status === "approved").length}
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
                    Pending Review
                  </p>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                    <span className="counter-value">
                      {documents.filter(d => d.status === "pending" || d.status === "under_review").length}
                    </span>
                  </h4>
                </div>
                <div className="flex-shrink-0">
                  <div className="avatar-sm">
                    <span className="avatar-title bg-soft-warning text-warning rounded fs-3">
                      <i className="ri-time-line"></i>
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
                    Missing Required
                  </p>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                    <span className="counter-value">
                      {requiredDocuments.length - documents.filter(d => d.required).length}
                    </span>
                  </h4>
                </div>
                <div className="flex-shrink-0">
                  <div className="avatar-sm">
                    <span className="avatar-title bg-soft-danger text-danger rounded fs-3">
                      <i className="ri-error-warning-line"></i>
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Required Documents Alert */}
      <Row className="mb-4">
        <Col lg={12}>
          <div className="alert alert-warning">
            <h6 className="alert-heading">
              <i className="ri-information-line me-2"></i>
              Required Documents
            </h6>
            <p className="mb-0">
              Please ensure all required documents are uploaded and approved before submitting your application.
              Missing documents may delay the review process.
            </p>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Uploaded Documents */}
        <Col lg={8}>
          <Card>
            <CardHeader className="align-items-center d-flex">
              <h4 className="card-title mb-0 flex-grow-1">Uploaded Documents</h4>
              <div className="flex-shrink-0">
                <Button color="soft-primary" size="sm">
                  <i className="ri-download-line align-middle me-1"></i> Download All
                </Button>
              </div>
            </CardHeader>

            <CardBody>
              {documents.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Document</th>
                        <th>Type</th>
                        <th>Upload Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0">
                                <i className={`${getFileIcon(doc.fileName)} fs-4 me-3`}></i>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1">
                                  {doc.name}
                                  {doc.required && (
                                    <Badge color="soft-danger" className="ms-2">Required</Badge>
                                  )}
                                </h6>
                                <p className="text-muted mb-0 fs-13">
                                  {doc.fileName} • {formatFileSize(doc.fileSize)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge color="soft-info">{doc.type}</Badge>
                          </td>
                          <td>{formatDate(doc.uploadDate)}</td>
                          <td>{getStatusBadge(doc.status)}</td>
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
                                    <i className="ri-download-2-line align-bottom me-2 text-muted"></i>
                                    Download
                                  </button>
                                </li>
                                {(doc.status === "pending" || doc.status === "rejected") && (
                                  <li>
                                    <button className="dropdown-item">
                                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                                      Replace
                                    </button>
                                  </li>
                                )}
                                <li>
                                  <hr className="dropdown-divider" />
                                </li>
                                <li>
                                  <button className="dropdown-item text-danger">
                                    <i className="ri-delete-bin-fill align-bottom me-2"></i>
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
              ) : (
                <div className="text-center py-5">
                  <div className="avatar-lg mx-auto mb-4">
                    <div className="avatar-title bg-soft-primary text-primary rounded-circle fs-1">
                      <i className="ri-folder-add-line"></i>
                    </div>
                  </div>
                  <h4 className="mb-3">No Documents Uploaded</h4>
                  <p className="text-muted mb-4">
                    Upload your documents to complete your application profile.
                  </p>
                  <Button color="primary" onClick={() => setIsUploadModal(true)}>
                    <i className="ri-upload-cloud-line me-1"></i> Upload First Document
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>

        {/* Document Requirements */}
        <Col lg={4}>
          <Card>
            <CardHeader>
              <h4 className="card-title mb-0">Document Requirements</h4>
            </CardHeader>
            <CardBody>
              <div className="vstack gap-3">
                {requiredDocuments.map((requirement, index) => (
                  <div key={index} className="p-3 border rounded">
                    <div className="d-flex align-items-start">
                      <div className="flex-shrink-0">
                        <div className="avatar-xs">
                          <div className="avatar-title rounded-circle bg-soft-primary text-primary">
                            {documents.find(d => d.name === requirement.name) ? (
                              <i className="ri-check-line"></i>
                            ) : (
                              <i className="ri-file-add-line"></i>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1">
                          {requirement.name}
                          <Badge color="soft-danger" className="ms-2">Required</Badge>
                        </h6>
                        <p className="text-muted mb-2 fs-13">{requirement.description}</p>
                        <div className="text-muted fs-12">
                          <div>Max Size: {requirement.maxSize}</div>
                          <div>Formats: {requirement.formats}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Upload Tips */}
          <Card>
            <CardHeader>
              <h4 className="card-title mb-0">Upload Tips</h4>
            </CardHeader>
            <CardBody>
              <div className="vstack gap-2">
                <div className="d-flex align-items-start">
                  <i className="ri-lightbulb-line text-warning me-2 mt-1"></i>
                  <small className="text-muted">
                    Scan documents in high resolution for better quality
                  </small>
                </div>
                <div className="d-flex align-items-start">
                  <i className="ri-lightbulb-line text-warning me-2 mt-1"></i>
                  <small className="text-muted">
                    Ensure all text is clearly readable
                  </small>
                </div>
                <div className="d-flex align-items-start">
                  <i className="ri-lightbulb-line text-warning me-2 mt-1"></i>
                  <small className="text-muted">
                    Use PDF format when possible for better compatibility
                  </small>
                </div>
                <div className="d-flex align-items-start">
                  <i className="ri-lightbulb-line text-warning me-2 mt-1"></i>
                  <small className="text-muted">
                    Keep file sizes under the specified limits
                  </small>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Upload Modal */}
      <Modal isOpen={isUploadModal} toggle={() => setIsUploadModal(!isUploadModal)} size="lg">
        <ModalHeader toggle={() => setIsUploadModal(!isUploadModal)}>
          Upload Document
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col lg={6}>
                <FormGroup>
                  <Label for="documentType">Document Type *</Label>
                  <Input type="select" id="documentType" required>
                    <option value="">Select document type</option>
                    <option value="passport">Passport Copy</option>
                    <option value="transcript">Academic Transcript</option>
                    <option value="cv">CV/Resume</option>
                    <option value="photo">Photo</option>
                    <option value="recommendation">Recommendation Letter</option>
                    <option value="other">Other</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label for="documentName">Document Name</Label>
                  <Input
                    type="text"
                    id="documentName"
                    placeholder="Enter document name"
                  />
                </FormGroup>
              </Col>
            </Row>
            
            <FormGroup>
              <Label for="fileUpload">Select File *</Label>
              <Input
                type="file"
                id="fileUpload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                required
              />
              <div className="form-text">
                Supported formats: PDF, DOC, DOCX, JPG, PNG. Maximum size: 10MB
              </div>
            </FormGroup>

            {selectedFile && (
              <div className="alert alert-info">
                <div className="d-flex align-items-center">
                  <i className={`${getFileIcon(selectedFile.name)} fs-4 me-3`}></i>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{selectedFile.name}</h6>
                    <small className="text-muted">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </small>
                  </div>
                </div>
              </div>
            )}

            {isUploading && (
              <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <small>Uploading...</small>
                  <small>{uploadProgress}%</small>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="soft-secondary" onClick={() => setIsUploadModal(false)}>
            Cancel
          </Button>
          <Button 
            color="primary" 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Uploading...
              </>
            ) : (
              <>
                <i className="ri-upload-cloud-line me-1"></i> Upload
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default DocumentsPage;