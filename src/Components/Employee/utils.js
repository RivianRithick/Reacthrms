export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  // Create date object at noon UTC
  const date = new Date(dateString + 'T12:00:00Z');
  return date.toLocaleDateString();
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success.main';
    case 'inactive':
      return 'error.main';
    case 'pending':
      return 'warning.main';
    default:
      return 'text.secondary';
  }
};

export const validateForm = (employee) => {
  const errors = {};
  
  // Required fields validation
  if (!employee.contact) errors.contact = "Contact is required";
  if (employee.contact) {
    const contactWithoutPrefix = employee.contact.replace("+91", "");
    if (!/^\d{10}$/.test(contactWithoutPrefix)) {
      errors.contact = "Contact must be 10 digits after +91 prefix";
    }
  }

  // Email validation
  if (employee.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
    errors.email = "Invalid email format";
  }

  // Aadhaar validation
  if (employee.aadhaarNumber && !/^\d{12}$/.test(employee.aadhaarNumber)) {
    errors.aadhaarNumber = "Aadhaar number must be 12 digits";
  }

  // PAN validation
  if (employee.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(employee.panNumber)) {
    errors.panNumber = "Invalid PAN format";
  }

  // IFSC validation
  if (employee.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(employee.ifscCode)) {
    errors.ifscCode = "Invalid IFSC code format";
  }

  // Bank account number validation
  if (employee.bankAccountNumber && !/^\d{9,18}$/.test(employee.bankAccountNumber)) {
    errors.bankAccountNumber = "Bank account number must be 9-18 digits";
  }

  return errors;
};

export const getFilteredEmployees = (employees, filters, searchQuery) => {
  if (!Array.isArray(employees)) return [];
  
  return employees.filter(employee => {
    // Basic search filter
    const matchesSearchQuery =
      searchQuery === "" || // If no search query, show all
      (employee.firstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (employee.lastName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (employee.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (employee.address?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    // Show deleted or non-deleted based on filter
    const matchesDeletedFilter = filters.showDeleted === employee.isDeleted;

    // Other filters only apply to non-deleted employees
    if (!filters.showDeleted) {
      const matchesBlockedFilter =
        filters.isBlocked === "" ||
        employee.isBlocked.toString() === filters.isBlocked;

      const matchesDataStatusFilter = (() => {
        if (filters.dataStatus === "complete") {
          return employee.firstName && employee.lastName && employee.email && employee.address;
        }
        if (filters.dataStatus === "incomplete") {
          return !employee.firstName || !employee.lastName || !employee.email || !employee.address;
        }
        return true;
      })();

      const matchesStatusFilter =
        !filters.status || employee.status === filters.status;

      return (
        matchesSearchQuery &&
        matchesDeletedFilter &&
        matchesBlockedFilter &&
        matchesDataStatusFilter &&
        matchesStatusFilter
      );
    }

    // For deleted employees, only apply search filter
    return matchesSearchQuery && matchesDeletedFilter;
  });
}; 