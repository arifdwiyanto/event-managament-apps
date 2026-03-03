/**
 * Formats an ISO date string into a human-readable format.
 * Example: "2026-02-21T12:00:00Z" -> "February 21, 2026"
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};
