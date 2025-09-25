export interface Customer {
  id: string; // Using email as a unique ID
  name: string;
  email: string;
  phone?: string;
}

// Simple regex for email validation. Not exhaustive, but good enough for this use case.
const EMAIL_VALIDATION_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Type guard to check if an object conforms to the Customer interface.
 * This acts as a schema validator before saving data.
 * @param obj - The object to validate.
 * @returns True if the object is a valid Customer, false otherwise.
 */
export const isCustomer = (obj: any): obj is Customer => {
  return (
    obj &&
    typeof obj.id === 'string' &&
    obj.id.length > 0 &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    EMAIL_VALIDATION_REGEX.test(obj.email) &&
    (obj.phone === undefined || typeof obj.phone === 'string')
  );
};
