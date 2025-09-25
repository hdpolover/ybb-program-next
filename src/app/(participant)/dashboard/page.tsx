"use client";

import React from "react";
import { Col, Row } from "reactstrap";
import Link from "next/link";
import { YBB_ROUTES } from "../../../constants/ybb";
import { useDashboard } from "../../../hooks/useDashboard";
import { 
  StatsCard, 
  QuickActions, 
  RecentActivities, 
  UpcomingTasks,
  DashboardSkeleton 
} from "../../../components/dashboard/DashboardComponents";

const DashboardOverview = () => {
  const [dashboardData, dashboardActions] = useDashboard();

  if (dashboardData.isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="participant-dashboard">
      {/* Page Title */}
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <div>
              <h4 className="mb-1">Dashboard</h4>
              <div className="d-flex align-items-center">
                <span className="badge bg-primary-subtle text-primary me-2">
                  <i className="ri-calendar-event-line me-1"></i>
                  IYS 2025 - Part 2
                </span>
                <span className="text-muted fs-13">Currently viewing program data</span>
              </div>
            </div>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <Link href="/dashboard">Participant</Link>
                </li>
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Program Context Information */}
      <Row className="mb-4">
        <Col xl={12}>
          <div className="card material-shadow border-primary">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="avatar-md bg-primary-subtle text-primary rounded-circle me-3 d-flex align-items-center justify-content-center">
                    <i className="ri-calendar-event-line fs-22"></i>
                  </div>
                  <div>
                    <h5 className="mb-1">Istanbul Youth Summit 2025 - Part 2</h5>
                    <p className="text-muted mb-0">
                      <i className="ri-map-pin-line me-1"></i>
                      Istanbul, Turkey • Aug 15-18, 2025 • Status: 
                      <span className="badge bg-success-subtle text-success ms-1">Active Participant</span>
                    </p>
                  </div>
                </div>
                <div className="text-end d-none d-md-block">
                  <div className="text-muted fs-13">Days remaining</div>
                  <div className="fs-20 fw-bold text-primary">45</div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row>
        {dashboardData.stats.map((stat) => (
          <Col xl={3} md={6} key={stat.id}>
            <StatsCard stat={stat} />
          </Col>
        ))}
      </Row>

      <Row>
        {/* Recent Activity */}
        <Col xl={7}>
          <RecentActivities 
            activities={dashboardData.activities}
            onViewAll={() => {/* TODO: Implement view all functionality */}}
          />
        </Col>

        {/* Upcoming Tasks */}
        <Col xl={5}>
          <UpcomingTasks 
            tasks={dashboardData.tasks}
            onTaskComplete={dashboardActions.markTaskComplete}
            onAddTask={() => {/* TODO: Implement add task functionality */}}
          />
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col xl={12}>
          <QuickActions actions={dashboardData.quickActions} />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardOverview;