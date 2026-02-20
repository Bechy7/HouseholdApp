export const getCurrentWeekRange = () => {
    const now = new Date();

    // JS: Sunday = 0, Monday = 1...
    const day = now.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return { monday, sunday };
};

// Get Monday of the week for a given date
export const getWeekStart = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = day === 0 ? -6 : 1 - day; // adjust so Monday is first
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Get array of 7 days (Mon-Sun)
export const getWeekDays = (weekStart: Date) => {
  return Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });
};