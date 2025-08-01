export interface Document {
  id: bigint; // Using bigint to accommodate large values
  file_name: string;
  file_type: string;
  file_size: bigint; // Using bigint to accommodate file sizes
  storage_url: string;
  uploaded_by: bigint; // Assuming this refers to a user ID
  uploaded_at: Date; // Use Date for datetime
  created_by: string;
  created_on: Date; // Use Date for datetime
  modified_by?: string; // Optional field
  modified_on?: Date; // Optional field for tracking modifications
}
