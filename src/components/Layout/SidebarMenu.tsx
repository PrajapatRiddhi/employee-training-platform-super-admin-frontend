import React, {ReactNode} from "react";
import DashboardIcon from "../Icons/DashboardIcon";
import PhishingIcon from "../Icons/PhishingIcon";
import ManageUsersIcons from "../Icons/ManageUsersIcons";
import LearningProgramsIcon from "../Icons/LearningProgramsIcon";
import SurveysIcon from "../Icons/SurveysIcon";
import ContentLibraryIcon from "../Icons/ContentLibraryIcon";
import ReportsIcon from "../Icons/ReportsIcon";
import BlogArticlesIcon from "../Icons/BlogArticlesIcon";
import GroupsIcon from "../Icons/GroupsIcon";
import ImportUsersIcon from "../Icons/ImportUsersIcon";
import OnboardingIcon from "../Icons/OnboardingIcon";
import MergeUsersIcon from "../Icons/MergeUsersIcon";
import MessagesIcon from "../Icons/MessagesIcon";
import ManageRolesRightsIcon from "../Icons/ManageRolesRightsIcon";
import RiskBoosterIcon from "../Icons/RiskBoosterIcon";
import ProgressTrackingIcon from "../Icons/ProgressTrackingIcon";
import SupportHelpIcon from "../Icons/SupportHelpIcon";
import PlanAccountIcon from "../Icons/PlanAccountIcon";
import SettingMenuIcon from "../Icons/SettingMenuIcon";
import PhishingOverview from "../Icons/PhishingOverview";
import PhishingProgram from "../Icons/PhishingProgram";
import PhishingDestinationPageIcon from "../Icons/PhishingDestinationPageIcon";
import PhishingDomainIcon from "../Icons/PhishingDomainIcon";
import PhishingViewResult from "../Icons/PhishingViewResult";
import LibraryIcon from "../Icons/LibraryIcon";
import PolicieIcon from "../Icons/PolicieIcon";
import LoginAvatar from "../Icons/LoginAvatar";
import DepartmentIcon from "../Icons/DepartmentIcons";
import AssessmentMenuIcon from "../Icons/AssessmentMenuIcon";
import SurveyListMenuIcon from "../Icons/SurveyListMenuIcon";
import SurveyProgramMenuIcon from "../Icons/SurveyProgramMenuIcon";
import SubCoursesIcon from "../Icons/SubCoursesIcon";
import CategoriesIcon from "../Icons/CategoriesIcon";
// import UserAvt from "/public/user-alt.png"
import {Image} from "antd";
export interface NavBarItem {
  id: number;
  label: string;
  routePath?: string;
  icon?: ReactNode;
  children?: NavBarItem[] | [];
}

export const companyAdminNavBarItems: NavBarItem[] = [
  {
    id: 1,
    label: "Dashboard",
    routePath: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    id: 2,
    label: "Phishing",
    icon: <PhishingIcon />,
    routePath: "",
    children: [
      {
        id: 1,
        label: "Overview",
        routePath: "/phishing/program/overview",
        icon: <PhishingOverview />,
      },
      {
        id: 2,
        label: "Program",
        routePath: "/phishing/program",
        icon: <PhishingProgram />,
      },
      {
        id: 3,
        label: "Phishing Destination Page",
        routePath: "/phishing/phishing-destination",
        icon: <PhishingDestinationPageIcon />,
      },
      {
        id: 4,
        label: "Domain",
        routePath: "/phishing/domain",
        icon: <PhishingDomainIcon />,
      },
      {
        id: 5,
        label: "View Results",
        routePath: "/phishing/view-results",
        icon: <PhishingViewResult />,
      },
      {
        id: 6,
        label: "Phishing Template",
        routePath: "/phishing/template",
        icon: <PhishingViewResult />,
      },
    ],
  },
  {
    id: 3,
    label: "Manage B2B Users",
    icon: <ManageUsersIcons />,
    routePath: "",
    children: [
      {
        id: 1,
        label: "B2B User Subscriptions",
        routePath: "/users",
        icon: <DashboardIcon />,
      },
    ],
  },

  {
    id: 5,
    label: "Learning Programs",
    icon: <LearningProgramsIcon />,
    routePath: "",
    children: [
      {
        id: 1,
        label: "Program",
        routePath: "/learning-program",
        icon: <PhishingProgram />,
      },
      {
        id: 2,
        label: "Notification Templates",
        routePath: "/learning-program/notification",
        icon: (
          <Image preview={false} src={"/user-alt.png"} width={24} height={24} />
        ),
      },
      {
        id: 3,
        label: "Policies",
        routePath: "/learning-program/policies",
        icon: <PolicieIcon />,
      },
    ],
  },
  {
    id: 6,
    label: "Surveys",
    icon: <SurveysIcon />,
    routePath: "",
    children: [
      {
        id: 1,
        label: "Survey Content",
        routePath: "/surveys",
        icon: <SurveyListMenuIcon />,
      },
      {
        id: 2,
        label: "Survey Program",
        routePath: "/surveys/programs",
        icon: <SurveyProgramMenuIcon />,
      },
    ],
  },
  {
    id: 12,
    label: "Assessment",
    icon: <AssessmentMenuIcon />,
    routePath: "",
    children: [
      {
        id: 1,
        label: "Assessment Content",
        routePath: "/assessment",
        icon: <SurveyListMenuIcon />,
      },
      {
        id: 2,
        label: "Assessment Program",
        routePath: "/assessment/programs",
        icon: <SurveyProgramMenuIcon />,
      },
    ],
  },
  {
    id: 7,
    label: "Content Library",
    icon: <ContentLibraryIcon />,
    routePath: "",
    children: [
      {
        id: 1,
        label: "Library",
        routePath: "/content/library",
        icon: <LibraryIcon />,
      },
      {
        id: 2,
        label: "Courses",
        routePath: "/content/manage-courses",
        icon: <SubCoursesIcon />,
      },
      {
        id: 3,
        label: "Categories",
        routePath: "/content/categories",
        icon: <CategoriesIcon />,
      },
    ],
  },
  {
    id: 8,
    label: "Reports",
    icon: <ReportsIcon />,
    routePath: "/reports",
  },
  // {
  //   id: 9,
  //   label: "Blog & Articles",
  //   icon: <BlogArticlesIcon />,
  //   routePath: "/blog-articles",
  // },
  {
    id: 12,
    label: "Departments",
    icon: <DepartmentIcon />,
    routePath: "/departments",
  },
  {
    id: 11,
    label: "divider",
    icon: null,
  },
  {
    id: 10,
    label: "Settings",
    icon: <SettingMenuIcon />,
    // routePath: "/settings",
    children: [
      {
        id: 1,
        label: "Profile & Account",
        routePath: "/settings/profile",
        icon: <PlanAccountIcon />,
      },
      {
        id: 2,
        label: "Subscription Plan",
        routePath: "/settings/subscription",
        icon: <GroupsIcon />,
      },
      {
        id: 3,
        label: "Help/Support/Contact",
        routePath: "/settings/help-support",
        icon: <SupportHelpIcon />,
      },
    ],
  },
];
