// Dashboard Components - Reusable components for the participant dashboard
"use client";

import React from "react";
import { Card, CardBody, CardHeader, Badge, Button, Progress } from "reactstrap";
import Link from "next/link";
import { 
  DashboardStats, 
  QuickAction, 
  ActivityItem, 
  UpcomingTask,
  getBadgeColor,
  getProgressColor,
  formatDate,
  getRelativeTime
} from "../../config/dashboard";

// Stats Card Component
interface StatsCardProps {
  stat: DashboardStats;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stat, onClick }) => {
  const cardContent = (
    <Card className="card-animate card-height-100 material-shadow">
      <CardBody>
        <div className="d-flex align-items-center">
          <div className="flex-grow-1 overflow-hidden">
            <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
              {stat.title}
            </p>
          </div>
          {stat.trend && (
            <div className="flex-shrink-0">
              <h5 className={`fs-14 mb-0 text-${stat.color}`}>
                <i className={`ri-arrow-${stat.trend.direction === 'up' ? 'up' : 'down'}-line fs-13 align-middle`}></i>
                {stat.trend.percentage}%
              </h5>
            </div>
          )}
        </div>
        <div className="d-flex align-items-end justify-content-between mt-4">
          <div>
            <h4 className="fs-22 fw-semibold ff-secondary mb-4">
              <span className="counter-value">{stat.value}</span>
              {stat.subValue && <span className="text-muted fs-14 ms-1">{stat.subValue}</span>}
            </h4>
            {stat.link && (
              <span className="text-decoration-underline text-primary" style={{ cursor: 'pointer' }}>
                View Details
              </span>
            )}
          </div>
          <div className="avatar-sm flex-shrink-0">
            <span className={`avatar-title bg-${stat.color}-subtle rounded fs-3`}>
              <i className={`${stat.icon} text-${stat.color}`}></i>
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return stat.link ? (
    <Link 
      href={stat.link} 
      className="text-decoration-none d-block"
      style={{ 
        transition: 'transform 0.2s ease-in-out',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {cardContent}
    </Link>
  ) : (
    <div 
      onClick={onClick} 
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {cardContent}
    </div>
  );
};

// Quick Actions Component
interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  actions, 
  title = "Quick Actions" 
}) => {
  return (
    <Card className="material-shadow">
      <CardHeader>
        <h4 className="card-title mb-0">{title}</h4>
      </CardHeader>
      <CardBody>
        <div className="row g-3">
          {actions.map((action) => (
            <div key={action.id} className="col-lg-3 col-md-6">
              <Link href={action.link} className="card material-shadow text-decoration-none card-animate">
                <CardBody className="text-center">
                  <div className="avatar-lg mx-auto mb-3">
                    <div className={`avatar-title bg-${action.color}-subtle text-${action.color} rounded-circle fs-2`}>
                      <i className={action.icon}></i>
                    </div>
                  </div>
                  <h5 className="mb-1">{action.title}</h5>
                  <p className="text-muted mb-0">{action.description}</p>
                </CardBody>
              </Link>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

// Recent Activities Component
interface RecentActivitiesProps {
  activities: ActivityItem[];
  title?: string;
  onViewAll?: () => void;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ 
  activities, 
  title = "Recent Activity",
  onViewAll
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'ri-check-line text-success';
      case 'pending':
        return 'ri-time-line text-warning';
      case 'failed':
        return 'ri-close-line text-danger';
      default:
        return 'ri-information-line text-info';
    }
  };

  return (
    <Card className="material-shadow">
      <CardHeader className="align-items-center d-flex">
        <h4 className="card-title mb-0 flex-grow-1">{title}</h4>
        {onViewAll && (
          <div className="flex-shrink-0">
            <Button color="soft-info" size="sm" onClick={onViewAll}>
              <i className="ri-file-list-3-line align-middle"></i> View All
            </Button>
          </div>
        )}
      </CardHeader>
      <CardBody>
        {activities.length > 0 ? (
          <div className="acitivity-timeline">
            {activities.map((activity, index) => (
              <div className="acitivity-item d-flex" key={activity.id}>
                <div className="flex-shrink-0">
                  <div className="acitivity-avatar">
                    <div className="avatar-xs">
                      <div className={`avatar-title rounded-circle bg-${getBadgeColor(activity.status)}-subtle`}>
                        <i className={activity.icon || getStatusIcon(activity.status)}></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-1">{activity.action}</h6>
                  <p className="text-muted mb-0 fs-13">{getRelativeTime(activity.timestamp)}</p>
                  {index !== activities.length - 1 && (
                    <div className="acitivity-divider mt-3"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="avatar-md mx-auto mb-3">
              <div className="avatar-title bg-soft-primary text-primary rounded-circle fs-2">
                <i className="ri-history-line"></i>
              </div>
            </div>
            <h6 className="mb-1">No Recent Activity</h6>
            <p className="text-muted mb-0 fs-13">Your activity will appear here</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

// Upcoming Tasks Component
interface UpcomingTasksProps {
  tasks: UpcomingTask[];
  title?: string;
  onTaskComplete?: (taskId: string) => void;
  onAddTask?: () => void;
}

export const UpcomingTasks: React.FC<UpcomingTasksProps> = ({ 
  tasks, 
  title = "Upcoming Tasks",
  onTaskComplete,
  onAddTask
}) => {
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const isOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    return due < now;
  };

  const activeTasks = tasks.filter(task => !task.completed);

  return (
    <Card className="material-shadow">
      <CardHeader className="align-items-center d-flex">
        <h4 className="card-title mb-0 flex-grow-1">{title}</h4>
        {onAddTask && (
          <div className="flex-shrink-0">
            <Button color="soft-primary" size="sm" onClick={onAddTask}>
              <i className="ri-add-line align-middle"></i> Add Task
            </Button>
          </div>
        )}
      </CardHeader>
      <CardBody>
        {activeTasks.length > 0 ? (
          <div className="table-responsive table-card">
            <table className="table table-borderless table-hover align-middle mb-0">
              <tbody>
                {activeTasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">
                            {task.task}
                            {isOverdue(task.dueDate) && (
                              <Badge color="danger" className="ms-2">Overdue</Badge>
                            )}
                          </h6>
                          <p className="text-muted mb-0 fs-13">Due: {formatDate(task.dueDate)}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge color={getPriorityBadgeColor(task.priority)} className="fs-12">
                        {task.priority}
                      </Badge>
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
                          {onTaskComplete && (
                            <li>
                              <button 
                                className="dropdown-item"
                                onClick={() => onTaskComplete(task.id)}
                              >
                                <i className="ri-check-fill align-bottom me-2 text-success"></i>
                                Mark Complete
                              </button>
                            </li>
                          )}
                          <li>
                            <button className="dropdown-item">
                              <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                              Edit
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
          <div className="text-center py-4">
            <div className="avatar-md mx-auto mb-3">
              <div className="avatar-title bg-soft-success text-success rounded-circle fs-2">
                <i className="ri-task-line"></i>
              </div>
            </div>
            <h6 className="mb-1">All Tasks Complete!</h6>
            <p className="text-muted mb-0 fs-13">Great job! No pending tasks.</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

// Progress Indicator Component
interface ProgressIndicatorProps {
  title: string;
  percentage: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  title,
  percentage,
  showLabel = true,
  size = 'md',
  color
}) => {
  const progressColor = color || getProgressColor(percentage);
  
  return (
    <div className="mb-3">
      {showLabel && (
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h6 className="mb-0">{title}</h6>
          <span className="text-muted fs-13">{percentage}%</span>
        </div>
      )}
      <Progress 
        value={percentage} 
        color={progressColor}
        className={`progress-${size}`}
      />
    </div>
  );
};

// Loading Skeleton Component
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Stats Cards Skeleton */}
      <div className="row mb-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="col-xl-3 col-md-6">
            <Card className="material-shadow">
              <CardBody>
                <div className="h-100">
                  <div className="bg-light rounded mb-2" style={{ height: '20px', width: '60%' }}></div>
                  <div className="bg-light rounded mb-3" style={{ height: '30px', width: '40%' }}></div>
                  <div className="d-flex justify-content-between align-items-end">
                    <div className="bg-light rounded" style={{ height: '20px', width: '50%' }}></div>
                    <div className="bg-light rounded-circle" style={{ height: '40px', width: '40px' }}></div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
      
      {/* Content Cards Skeleton */}
      <div className="row">
        <div className="col-xl-8">
          <Card className="material-shadow">
            <CardHeader>
              <div className="bg-light rounded" style={{ height: '24px', width: '150px' }}></div>
            </CardHeader>
            <CardBody>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="d-flex align-items-center mb-3">
                  <div className="bg-light rounded-circle me-3" style={{ height: '32px', width: '32px' }}></div>
                  <div className="flex-grow-1">
                    <div className="bg-light rounded mb-1" style={{ height: '16px', width: '70%' }}></div>
                    <div className="bg-light rounded" style={{ height: '12px', width: '40%' }}></div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
        
        <div className="col-xl-4">
          <Card className="material-shadow">
            <CardHeader>
              <div className="bg-light rounded" style={{ height: '24px', width: '120px' }}></div>
            </CardHeader>
            <CardBody>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="mb-3">
                  <div className="bg-light rounded mb-2" style={{ height: '16px', width: '80%' }}></div>
                  <div className="bg-light rounded" style={{ height: '12px', width: '50%' }}></div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default {
  StatsCard,
  QuickActions,
  RecentActivities,
  UpcomingTasks,
  ProgressIndicator,
  DashboardSkeleton,
};