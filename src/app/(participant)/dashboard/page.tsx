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
            <h4 className="mb-sm-0">Dashboard</h4>
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