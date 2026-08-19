import { createHash } from 'crypto'

// Simple, dependency-free hashing for the single admin panel password.
// Not bank-grade, but this isn't storing anything more sensitive than
// panel access — good enough to avoid keeping the password in plaintext.
const SALT = process.env.ADMIN_PASSWORD_SALT || 'elite-handpan-admin-panel'

export function hashAdminPassword(password: string): string {
  return createHash('sha256').update(SALT + password).digest('hex')
}

export function verifyAdminPassword(password: string, hash: string): boolean {
  return hashAdminPassword(password) === hash
}
