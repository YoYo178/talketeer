export const banDurations = [
    { label: "30m", minutes: 30 },
    { label: "6h", minutes: 60 * 6 },
    { label: "12h", minutes: 60 * 12 },
    { label: "1d", minutes: 60 * 24 },
    { label: "3d", minutes: 60 * 24 * 3 },
    { label: "7d", minutes: 60 * 24 * 7 },
    { label: "30d", minutes: 60 * 24 * 30 },
    { label: "Permanent", minutes: -1 },
];

export const getDurationValue = (minutes: number) =>
    minutes === -1 ? "-1" : String(minutes * 60 * 1000);