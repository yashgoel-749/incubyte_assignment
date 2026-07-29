// ─── Validator Utilities (React Hook Form helpers) ────────────────────────

export const emailPattern = {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Enter a valid email address',
};

export const passwordRules = {
    required: 'Password is required',
    minLength: { value: 8, message: 'Password must be at least 8 characters' },
};

export const requiredText = (field = 'This field') => ({
    required: `${field} is required`,
});

/** Returns true if the value is a valid integer year between 1980 and now+2 */
export function isValidYear(year: number): boolean {
    return Number.isInteger(year) && year >= 1980 && year <= new Date().getFullYear() + 2;
}

/** Returns true if the value is a positive number */
export function isPositive(n: number): boolean {
    return typeof n === 'number' && n > 0;
}
