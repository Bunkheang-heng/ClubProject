/**
 * Formats Firebase error messages for better user experience
 * @param error - Any error object from Firebase operations
 * @returns A user-friendly error message
 */
export const formatFirebaseError = (error: any): string => {
  // Security: Don't expose sensitive error details to users
  if (process.env.NODE_ENV === 'development') {
    console.error('Firebase error:', error);
  }
  
  if (error?.code) {
    // Common Firebase auth error codes with friendly messages
    const errorMap: Record<string, string> = {
      'auth/email-already-in-use': 'This email address is already in use.',
      'auth/invalid-email': 'The email address is not valid.',
      'auth/user-disabled': 'This user account has been disabled.',
      'auth/user-not-found': 'No account with this email address exists.',
      'auth/wrong-password': 'The password is incorrect.',
      'auth/weak-password': 'The password is too weak.',
      'auth/requires-recent-login': 'Please sign in again to complete this action.',
      'auth/invalid-credential': 'The provided credentials are invalid.',
      'auth/invalid-verification-code': 'The verification code is invalid.',
      'auth/invalid-verification-id': 'The verification ID is invalid.',
      'auth/missing-verification-code': 'The verification code is missing.',
      'auth/missing-verification-id': 'The verification ID is missing.'
    };
    
    // Clean up error code and create user-friendly message
    const errorCode = error.code.replace('auth/', '');
    return errorMap[error.code] || 
           errorCode.split('-').map((word: string) => 
             word.charAt(0).toUpperCase() + word.slice(1)
           ).join(' ');
  } 
  
  if (error?.message) {
    // Remove any sensitive paths or data from error messages
    return error.message.replace(/\/.*\/|\/.*\\|\\.*\\|\\.*\/|firebase:\/\/[^"]+/g, '');
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Centralized error handler that logs errors and returns user-friendly messages
 * @param error - Any error that occurred
 * @param context - Context where the error occurred for logging
 * @returns User-friendly error message
 */
export const handleError = (error: unknown, context = 'application'): string => {
  // Log error for debugging (only in dev)
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error in ${context}:`, error);
  }
  
  // Handle different error types
  if (error instanceof Error) {
    return formatFirebaseError(error);
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Sanitize user input to prevent XSS attacks
 * @param input - User input string
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim();
}; 