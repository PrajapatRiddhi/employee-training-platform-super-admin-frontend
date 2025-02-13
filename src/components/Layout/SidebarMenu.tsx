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
import SupportHelpIcon from "../Icons/SupportHelpIcon";
import PlanAccountIcon from "../Icons/PlanAccountIcon";
import SettingMenuIcon from "../Icons/SettingMenuIcon";
import PhishingProgram from "../Icons/PhishingProgram";
import PhishingDestinationPageIcon from "../Icons/PhishingDestinationPageIcon";
import PhishingDomainIcon from "../Icons/PhishingDomainIcon";
import PhishingViewResult from "../Icons/PhishingViewResult";
import LibraryIcon from "../Icons/LibraryIcon";
import PolicieIcon from "../Icons/PolicieIcon";
import DepartmentIcon from "../Icons/DepartmentIcons";
import AssessmentMenuIcon from "../Icons/AssessmentMenuIcon";
import SurveyListMenuIcon from "../Icons/SurveyListMenuIcon";
import SurveyProgramMenuIcon from "../Icons/SurveyProgramMenuIcon";
import SubCoursesIcon from "../Icons/SubCoursesIcon";
import CategoriesIcon from "../Icons/CategoriesIcon";
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
    label: "Phishing Simulation",
    icon: <PhishingIcon />,
    routePath: "",
    children: [
      {
        id: 1,
        label: "Phishing Destination Page",
        routePath: "/phishing/phishing-destination",
        icon: <PhishingDestinationPageIcon />,
      },
      {
        id: 2,
        label: "Domain",
        routePath: "/phishing/domain",
        icon: <PhishingDomainIcon />,
      },
      {
        id: 3,
        label: "Phishing Templates",
        routePath: "/phishing/templates",
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
        routePath: "/company",
        icon: <DashboardIcon />,
      },
    ],
  },

  {
    id: 5,
    label: "Learning Programs",
    icon: <LearningProgramsIcon />,
    routePath: "/learning-program",
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
    ],
  },
  {
    id: 7,
    label: "Manage Courses",
    icon: <ContentLibraryIcon />,
    routePath: "",
    children: [
      {
        id: 1,
        label: "Courses",
        routePath: "/manage-courses",
        icon: <SubCoursesIcon />,
      },
      {
        id: 1,
        label: "Categories",
        routePath: "/manage-courses/categories",
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
