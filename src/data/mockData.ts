export const attentionItems = [
  {
    id: 1,
    actionType: "Approval Required",
    agentName: "Keyword Optimizer",
    agentLogo: "K",
    lucideIcon: "FileSearch2",
    impact: "High",
    primaryCta: "Review",
    secondaryCta: "Defer",
    description: "+$524 in savings",
    actionTypeColor: "text-orange-600",
    descriptionColor: "text-green-600",
    primaryCtaAction: "navigateToAgent",
    secondaryCtaAction: "hideCard",
    agentPageUrl: "/agents/keyword-optimizer"
  },
  {
    id: 2,
    actionType: "Anomaly Detected",
    agentName: "Conversion Funnel Optimizer",
    agentLogo: "C",
    lucideIcon: "Funnel",
    impact: "Critical",
    primaryCta: "View Anomaly",
    secondaryCta: "Diagnose",
    description: "-34% Leads WoW",
    actionTypeColor: "text-red-600",
    descriptionColor: "text-red-500",
    primaryCtaAction: "navigateToAgent",
    secondaryCtaAction: "navigateToAgent",
    agentPageUrl: "/agents/conversion-funnel-optimizer"
  },
  {
    id: 3,
    actionType: "Unblocking Required",
    agentName: "Books Reconciler",
    agentLogo: "B",
    lucideIcon: "BookOpenText",
    impact: "Critical",
    primaryCta: "View Error",
    secondaryCta: "Reauth",
    description: "27 Expenses Pending",
    actionTypeColor: "text-red-600",
    descriptionColor: "text-red-500",
    primaryCtaAction: "navigateToReauth",
    secondaryCtaAction: "navigateToReauth",
    reauthPageUrl: "/reauth/books-reconciler"
  }
];

export const performanceMetrics = [
  {
    id: 1,
    metric: "Conversion Rate",
    trend: "up",
    value: "24.8%",
    change: "+2.4%",
    timeline: "This Week"
  },
  {
    id: 2,
    metric: "Response Time",
    trend: "down",
    value: "1.2 min",
    change: "-0.3 min",
    timeline: "This Month"
  },
  {
    id: 3,
    metric: "Task Completion",
    trend: "up",
    value: "89%",
    change: "+5%",
    timeline: "This Week"
  },
  {
    id: 4,
    metric: "Customer Satisfaction",
    trend: "stable",
    value: "4.7/5",
    change: "0%",
    timeline: "This Month"
  },
  {
    id: 5,
    metric: "Revenue Generated",
    trend: "up",
    value: "$12,450",
    change: "+8.3%",
    timeline: "This Quarter"
  },
  {
    id: 6,
    metric: "Active Agents",
    trend: "up",
    value: "18",
    change: "+2",
    timeline: "This Month"
  }
];

export const agentsGlance = [
  {
    id: 1,
    name: "Sales Agent",
    status: "Active",
    currentTask: "Qualifying new leads",
    progress: 65,
    metric: "22 Leads Processed",
    cta: "View Details"
  },
  {
    id: 2,
    name: "Support Agent",
    status: "Idle",
    lastCompleted: "Resolved ticket #45892",
    progress: 100,
    metric: "12 Tickets Closed Today",
    cta: "Assign Task"
  },
  {
    id: 3,
    name: "Marketing Agent",
    status: "Active",
    currentTask: "Email campaign analysis",
    progress: 30,
    metric: "38% Open Rate",
    cta: "View Details"
  }
];

export const tasks = [
  {
    id: 1,
    actionType: "Performance Review",
    agentName: "Sales Agent",
    agentLogo: "S",
    impact: "High",
    primaryCta: "Review Now",
    secondaryCta: "Dismiss",
    dueDate: "Today",
    description: "Sales agent performance has dropped by 15% this week"
  },
  {
    id: 2,
    actionType: "Task Completion",
    agentName: "Customer Support",
    agentLogo: "C",
    impact: "Medium",
    primaryCta: "Complete Task",
    secondaryCta: "Reschedule",
    dueDate: "Today",
    description: "3 customer support tickets need immediate attention"
  },
  {
    id: 3,
    actionType: "System Alert",
    agentName: "Technical Agent",
    agentLogo: "T",
    impact: "Critical",
    primaryCta: "Investigate",
    secondaryCta: "Silence Alert",
    dueDate: "Tomorrow",
    description: "Technical agent detected unusual system activity"
  },
  {
    id: 4,
    actionType: "Training Required",
    agentName: "New Agent",
    agentLogo: "N",
    impact: "Low",
    primaryCta: "Start Training",
    secondaryCta: "Schedule Later",
    dueDate: "This Week",
    description: "New agent requires training on updated procedures"
  },
  {
    id: 5,
    actionType: "Strategy Review",
    agentName: "Marketing Agent",
    agentLogo: "M",
    impact: "Medium",
    primaryCta: "Review Strategy",
    secondaryCta: "Postpone",
    dueDate: "Next Week",
    description: "Marketing campaign requires strategic review"
  }
];
