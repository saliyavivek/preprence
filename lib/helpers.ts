export function formatInterviewDate(date: Date | string) {
    const value = typeof date === "string" ? new Date(date) : date;

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(value);
}