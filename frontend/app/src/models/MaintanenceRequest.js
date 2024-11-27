class MaintenanceRequest {
    constructor(
      request_id,
      lease_id,
      description,
      status,
      created_at,
      updated_at
    ) {
      this.request_id = request_id;
      this.lease_id = lease_id;
      this.description = description;
      this.status = status;
      this.created_at = created_at;
      this.updated_at = updated_at;
    }
  }
  