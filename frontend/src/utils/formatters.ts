// ─── Formatting Utilities ─────────────────────────────────────────────────

/**
 * Format a number as a USD currency string.
 * e.g. 85000 → "$85,000"
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format a large number with compact notation.
 * e.g. 12400000 → "$12.4M"
 */
export function formatCompactCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
    }).format(amount);
}

/**
 * Format a Date or ISO string to a readable locale date.
 * e.g. "2024-03-15T00:00:00Z" → "Mar 15, 2024"
 */
export function formatDate(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

/**
 * Returns a percentage string.
 * e.g. (125, 1000) → "12.5%"
 */
export function formatPercent(value: number, total: number, decimals = 1): string {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(decimals)}%`;
}

/**
 * Truncate a string to a given max length with ellipsis.
 */
export function truncate(str: string, max = 40): string {
    return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}

/**
 * Return initials from a full name.
 * e.g. "Alex Rivera" → "AR"
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}
