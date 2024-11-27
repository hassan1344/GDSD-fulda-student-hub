class Lease {
    constructor(
      lease_id,
      student_id,
      property_id,
      start_date,
      end_date,
      rent_amount,
      status,
      created_at,
      updated_at
    ) {
      this.lease_id = lease_id;
      this.student_id = student_id;
      this.property_id = property_id;
      this.start_date = start_date;
      this.end_date = end_date;
      this.rent_amount = rent_amount;
      this.status = status;
      this.created_at = created_at;
      this.updated_at = updated_at;
    }
  }
  