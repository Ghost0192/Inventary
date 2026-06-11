// Calculate ISO week number from a date in format W1, W2, W3...
export function getWeekNumber(date: Date | string): string {
    const d = new Date(typeof date === 'string' ? date : date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const diff = d.getTime() - yearStart.getTime();
    const weekNumber = Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
    return `W${String(weekNumber).padStart(2, '0')}`;
}
