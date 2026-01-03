export type Intent = 'QUERY' | 'FEEDBACK' | 'FEATURE' | 'COMPLAINT';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketStatus = 'PROCESSING' | 'RESOLVED' | 'FLAGGED' | 'SLA_BREACH_WARNING' | 'VALIDATION_FAILED';

export interface WorkflowLog {
  agentName: string;
  action: string;
  timestamp: number;
  outcome: 'PASS' | 'FAIL' | 'FLAG' | 'INFO';
  details?: string;
}

export interface Ticket {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
  intent: Intent;
  riskScore: number;
  riskLevel: RiskLevel;
  status: TicketStatus;
  assignedTeam: 'SUPPORT' | 'PRODUCT' | 'ENGINEERING' | 'LEGAL' | 'NONE';
  logs: WorkflowLog[];
  slaDeadline: number;
  isSlaBreach: boolean;
}

export interface TeamAlert {
  id: string;
  team: 'SUPPORT' | 'PRODUCT' | 'ENGINEERING' | 'LEGAL';
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  ticketId: string;
  timestamp: number;
}
