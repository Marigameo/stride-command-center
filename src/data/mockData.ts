export const attentionItems = [
  {
    id: 1,
    actionType: "Approval Required",
    agentName: "Keyword Optimizer",
    agentLogo: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_3.png",
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
    agentLogo: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_1.png",
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
    agentLogo: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_16.png",
    impact: "Critical",
    primaryCta: "View Error",
    secondaryCta: "Reauth",
    description: "27 Expenses Pending",
    actionTypeColor: "text-red-600",
    descriptionColor: "text-red-500",
    primaryCtaAction: "navigateToAgent",
    secondaryCtaAction: "navigateToReauth",
    agentPageUrl: "/agents/books-reconciler",
    reauthPageUrl: "/reauth/books-reconciler"
  }
];

export const performanceMetrics = [
  {
    id: 1,
    metric: "Total Cost Saved",
    trend: "up",
    value: "$7489",
    change: "+14%",
    timeline: "This Week"
  },
  {
    id: 2,
    metric: "Task Completion",
    trend: "up",
    value: "89%",
    change: "+5%",
    timeline: "This Week"
  },
  {
    id: 6,
    metric: "Acceptance Rate",
    trend: "up",
    value: "95%",
    change: "+2%",
    timeline: "This Month"
  }
];

export const agentsGlance = [
  {
    id: 1,
    name: "Keyword Optimizer",
    agentLogo: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_3.png",
    status: "Waiting",
    currentTask: "Optimizing Holiday Campaign",
    progress: 65,
    metric: "+$524 in savings",
    cta: "Review",
    ctaAction: "navigateToAgent",
    agentPageUrl: "/agents/keyword-optimizer"
  },
  {
    id: 2,
    name: "Conversion Funnel Optimizer",
    agentLogo: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_1.png",
    status: "Idle",
    lastCompleted: "A/B Test Concluded",
    progress: 100,
    metric: "-34% Leads WoW",
    cta: "Review",
    ctaAction: "navigateToAgent",
    agentPageUrl: "/agents/conversion-funnel-optimizer"
  },
  {
    id: 3,
    name: "Books Reconciler",
    agentLogo: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_16.png",
    status: "Active",
    currentTask: "Reconciling Q3 Expenses",
    progress: 30,
    metric: "27 Expenses Pending",
    cta: "Review",
    ctaAction: "navigateToAgent",
    agentPageUrl: "/agents/books-reconciler"
  },
  {
    id: 4,
    name: "Blog Content Strategizer",
    agentLogo: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/upstream_22.png",
    status: "Active",
    currentTask: "Creating outline for Amazon Marketplace",
    progress: 33,
    metric: "5 blog posts to be picked",
    cta: "View Outline",
    ctaAction: "navigateToAgent",
    agentPageUrl: "/agents/blog-strategizer"
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
