
export function formatLongDate(date: Date | string) {
    const d = typeof date === 'string' ? new Date(date) : date;

    const formatted = d.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return formatted
}

export function getTime () {
    const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    });

    return time;
}