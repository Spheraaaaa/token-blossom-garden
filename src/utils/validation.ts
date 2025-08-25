// Input validation utilities for security hardening

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateWalletAddress = (address: string): boolean => {
  // Ethereum address validation (42 characters, starts with 0x)
  const ethRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethRegex.test(address);
};

export const validateNFTPrice = (price: number): boolean => {
  return price > 0 && price <= 1000000 && Number.isFinite(price);
};

export const validateBidAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000 && Number.isFinite(amount);
};

export const validateExchangeAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000 && Number.isFinite(amount);
};

export const sanitizeText = (text: string): string => {
  // Remove HTML tags and dangerous characters
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"&]/g, '') // Remove dangerous characters
    .trim()
    .substring(0, 1000); // Limit length
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSizeInMB = 10;
  
  if (!validateFileType(file, allowedTypes)) {
    return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' };
  }
  
  if (!validateFileSize(file, maxSizeInMB)) {
    return { isValid: false, error: `File size must be less than ${maxSizeInMB}MB.` };
  }
  
  return { isValid: true };
};

export const validateUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const rateLimitCheck = (key: string, maxRequests: number, windowMs: number): boolean => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Get stored requests from localStorage
  const stored = localStorage.getItem(`rateLimit_${key}`);
  let requests: number[] = stored ? JSON.parse(stored) : [];
  
  // Filter out old requests
  requests = requests.filter(timestamp => timestamp > windowStart);
  
  // Check if limit exceeded
  if (requests.length >= maxRequests) {
    return false;
  }
  
  // Add current request
  requests.push(now);
  localStorage.setItem(`rateLimit_${key}`, JSON.stringify(requests));
  
  return true;
};