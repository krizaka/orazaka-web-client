export interface AutomationJob {
  id: string;
  connectorType: string;
  action: string;
  status:
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "RUNNING"
    | "COMPLETED"
    | "FAILED"
    | "AWAITING_CLI_EXECUTION";
  userId: string;
  createdAt: string;
  payload: Record<string, unknown>;
}
