import { Ticket, Intent, RiskLevel, TicketStatus, TeamAlert, WorkflowLog } from '../types';

const USER_NAMES = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Heidi"];
const INTENTS: Intent[] = ['QUERY', 'FEEDBACK', 'FEATURE', 'COMPLAINT'];

const MOCK_CONTENTS: Record<Intent, string[]> = {
  QUERY: [
    "How do I reset my password?",
    "Where can I find the API documentation?",
    "Is there a limit on daily transactions?",
    "What is the SLA for the basic plan?",
    "How do I update my billing address?"
  ],
  FEEDBACK: [
    "The new UI looks great but is a bit slow.",
    "I really like the dark mode feature.",
    "The dashboard is confusing to navigate.",
    "Great job on the latest update!",
    "I found a typo in the help section."
  ],
  FEATURE: [
    "Can you add export to CSV functionality?",
    "I need an integration with Slack.",
    "Please add multi-user support for teams.",
    "It would be great to have custom themes.",
    "We need better reporting tools."
  ],
  COMPLAINT: [
    "My service has been down for 2 hours!",
    "I was charged twice for the subscription.",
    "Support is not replying to my emails.",
    "The application keeps crashing on login.",
    "This is unacceptable, I want a refund."
  ]
};

// Simulate the agents processing a ticket
export const processNewTicket = (): { ticket: Ticket, newAlerts: TeamAlert[] } => {
  const id = Math.random().toString(36).substring(7).toUpperCase();
  const intent = INTENTS[Math.floor(Math.random() * INTENTS.length)];
  const content = MOCK_CONTENTS[intent][Math.floor(Math.random() * MOCK_CONTENTS[intent].length)];
  const timestamp = Date.now();
  
  // 1. Initial State
  let ticket: Ticket = {
    id,
    userId: USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)],
    content,
    timestamp,
    intent,
    riskScore: 0,
    riskLevel: 'LOW',
    status: 'PROCESSING',
    assignedTeam: 'NONE',
    logs: [],
    slaDeadline: timestamp + (1000 * 60 * 60), // 1 hour default SLA
    isSlaBreach: false
  };

  const logs: WorkflowLog[] = [];
  const alerts: TeamAlert[] = [];

  // 2. Master/Intent Agent
  logs.push({
    agentName: 'Master Intent Agent',
    action: 'Classify Intent',
    timestamp: Date.now(),
    outcome: 'PASS',
    details: `Classified as ${intent}`
  });

  // 3. SLA Breach Agent (Proactive Check)
  // Simulate a random chance of potential breach detection
  const potentialBreach = Math.random() < 0.15;
  if (potentialBreach) {
     logs.push({
      agentName: 'SLA Breach Agent',
      action: 'Timeline Analysis',
      timestamp: Date.now(),
      outcome: 'FLAG',
      details: 'Projected to breach SLA based on current load.'
    });
    ticket.isSlaBreach = true;
    ticket.status = 'SLA_BREACH_WARNING';
    alerts.push({
      id: Math.random().toString(36).substring(7),
      team: 'SUPPORT',
      message: `Projected SLA Breach: Ticket ${ticket.id}`,
      severity: 'WARNING',
      ticketId: ticket.id,
      timestamp: Date.now()
    });
  } else {
     logs.push({
      agentName: 'SLA Breach Agent',
      action: 'Timeline Analysis',
      timestamp: Date.now(),
      outcome: 'PASS',
      details: 'Timeline within limits.'
    });
  }

  // 4. Risk Score Agent
  // Complaints have higher chance of high risk
  let riskScore = Math.floor(Math.random() * 100);
  if (intent === 'COMPLAINT') riskScore += 30; // Bias towards high risk for complaints
  if (riskScore > 100) riskScore = 100;

  ticket.riskScore = riskScore;
  
  if (riskScore >= 80) ticket.riskLevel = 'CRITICAL';
  else if (riskScore >= 60) ticket.riskLevel = 'HIGH';
  else if (riskScore >= 30) ticket.riskLevel = 'MEDIUM';
  else ticket.riskLevel = 'LOW';

  logs.push({
    agentName: 'Risk Score Agent',
    action: 'Synthesize Data',
    timestamp: Date.now(),
    outcome: riskScore >= 60 ? 'FLAG' : 'PASS',
    details: `Calculated Risk Score: ${riskScore} (${ticket.riskLevel})`
  });

  // 5. Routing Logic based on Risk & Intent
  if (ticket.riskLevel === 'CRITICAL' || ticket.riskLevel === 'HIGH') {
    ticket.status = 'FLAGGED';
    ticket.assignedTeam = intent === 'COMPLAINT' ? 'LEGAL' : 'SUPPORT';
    
    // Add specific alerts for high risk
    alerts.push({
      id: Math.random().toString(36).substring(7),
      team: ticket.assignedTeam,
      message: `High Risk ${intent} detected: Risk Score ${riskScore}`,
      severity: 'CRITICAL',
      ticketId: ticket.id,
      timestamp: Date.now()
    });

    logs.push({
      agentName: 'Routing System',
      action: 'Notify Teams',
      timestamp: Date.now(),
      outcome: 'FLAG',
      details: `Routed to ${ticket.assignedTeam} for immediate attention via Dashboard.`
    });
    
    // Fallback response simulation
    logs.push({
      agentName: 'Response Agent',
      action: 'Generate Fallback',
      timestamp: Date.now(),
      outcome: 'INFO',
      details: 'Sending viable solution/fallback response to user while team investigates.'
    });

  } else {
    // Low Risk Flow
    if (intent === 'QUERY') {
      ticket.assignedTeam = 'SUPPORT';
      // Simulate Product Response / Validation
      const validationPass = Math.random() > 0.1; // 10% fail rate
      
      if (validationPass) {
        ticket.status = 'RESOLVED';
        logs.push({
          agentName: 'Validation Agent',
          action: 'Validate Response',
          timestamp: Date.now(),
          outcome: 'PASS',
          details: 'Response validated against SLA & User Catalogue. Sent to user.'
        });
      } else {
        ticket.status = 'VALIDATION_FAILED';
        ticket.assignedTeam = 'PRODUCT';
        logs.push({
          agentName: 'Validation Agent',
          action: 'Validate Response',
          timestamp: Date.now(),
          outcome: 'FAIL',
          details: 'Validation failed. Response accuracy uncertain.'
        });
         alerts.push({
            id: Math.random().toString(36).substring(7),
            team: 'PRODUCT',
            message: `Validation Failed for Ticket ${ticket.id}`,
            severity: 'WARNING',
            ticketId: ticket.id,
            timestamp: Date.now()
        });
      }

    } else if (intent === 'FEEDBACK' || intent === 'FEATURE') {
      ticket.assignedTeam = 'PRODUCT';
      ticket.status = 'RESOLVED'; // Logged
      logs.push({
        agentName: 'Tracker Agent',
        action: 'Log Feedback',
        timestamp: Date.now(),
        outcome: 'INFO',
        details: 'Added to Product Dashboard for tracking.'
      });
    } else {
      // Complaint Low Risk
      ticket.assignedTeam = 'SUPPORT';
      ticket.status = 'FLAGGED';
      alerts.push({
        id: Math.random().toString(36).substring(7),
        team: 'SUPPORT',
        message: `New Low-Risk Complaint: Ticket ${ticket.id}`,
        severity: 'INFO',
        ticketId: ticket.id,
        timestamp: Date.now()
      });
    }
  }

  ticket.logs = logs;
  return { ticket, newAlerts: alerts };
};