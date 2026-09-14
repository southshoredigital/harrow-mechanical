import type { SafetyStatistics } from './types'

/**
 * Safety performance for the 12 months to 30 June 2026. Client supplied,
 * matching the certificate at /documents/safety-performance-statement.pdf.
 *
 * LTIFR and TRIFR are only meaningful next to the hours they are measured
 * over, so both ship alongside the rates rather than standing alone.
 */
export const safetyStatistics: SafetyStatistics = {
  periodStart: '2025-07-01',
  periodEnd: '2026-06-30',
  hoursWorked: 104_200,
  ltifr: 2.9,
  trifr: 8.6,
  lostTimeInjuries: 3,
  daysLost: 41,
  recordableInjuries: 9,
  notifiableIncidents: 0,
  lastReviewed: '2026-07-15',
}
