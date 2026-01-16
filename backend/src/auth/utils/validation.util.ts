import { BadRequestException } from '@nestjs/common';


export function validateEmailFormat(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

export function sanitizeAndValidatePassword(password: string): string {
  if (!password || typeof password !== 'string') {
    throw new BadRequestException('Password must be a valid string');
  }

  const xssPatterns = [
    /<script/i,
    /<\/script>/i,
    /javascript:/i,
    /on\w+\s*=/i, 
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<link/i,
    /<meta/i,
    /<style/i,
    /expression\s*\(/i, 
    /vbscript:/i,
    /data:text\/html/i,
    /&#x/i, 
    /%3C/i, 
    /%3E/i, 
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(password)) {
      throw new BadRequestException(
        'Password contains invalid characters or patterns',
      );
    }
  }


  const sanitized = password.replace(/[<>'"&]/g, '');

  if (sanitized.length < password.length) {
    throw new BadRequestException(
      'Password contains invalid characters. Only alphanumeric characters and common symbols are allowed.',
    );
  }

  return password; 
}

export function validateEmail(email: string): void {
  if (!email || typeof email !== 'string') {
    throw new BadRequestException('Email is required and must be a string');
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0) {
    throw new BadRequestException('Email cannot be empty');
  }

  if (trimmedEmail.length > 320) {
    throw new BadRequestException('Email is too long (max 320 characters)');
  }

  if (!validateEmailFormat(trimmedEmail)) {
    throw new BadRequestException('Invalid email format');
  }

  if (trimmedEmail.includes('\n') || trimmedEmail.includes('\r')) {
    throw new BadRequestException('Email contains invalid characters');
  }
}

export function validatePassword(password: string): void {
  if (!password || typeof password !== 'string') {
    throw new BadRequestException('Password is required and must be a string');
  }

  if (password.length < 6) {
    throw new BadRequestException(
      'Password must be at least 6 characters long',
    );
  }

  if (password.length > 128) {
    throw new BadRequestException('Password is too long (max 128 characters)');
  }

  sanitizeAndValidatePassword(password);
}
