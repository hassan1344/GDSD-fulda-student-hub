class Report {
    constructor(
      report_id,
      reported_by,
      target_id,
      reason,
      status,
      created_at,
      updated_at
    ) {
      this.report_id = report_id;
      this.reported_by = reported_by;
      this.target_id = target_id;
      this.reason = reason;
      this.status = status;
      this.created_at = created_at;
      this.updated_at = updated_at;
    }
  }
  