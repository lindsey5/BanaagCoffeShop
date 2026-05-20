
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

export const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return '';

    const d = typeof date === 'string' ? new Date(date) : date;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM

    const formattedHours = String(hours).padStart(2, '0');

    return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
};

export const formatReceiptDate = (date: string | Date) => {
    const d = new Date(date);

    const formatted = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(d);

    return formatted.replace("AM", "A.M.").replace("PM", "P.M.");
};