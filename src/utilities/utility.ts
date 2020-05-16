// Utility helper methods.

// UID generation based current moment in time (useful for blocks and sub-blocks).
// TODO: What if I spam the generateUID within one minute? Needs to have a mechanism (i.e. arbitrarily increment minute).
function generateUID(date: Date): string {
    let year = date.getFullYear(),
        month = date.getMonth(),
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes();

    return year + appendZero(++month) + appendZero(day) + appendZero(hour) + appendZero(minute);
}

// Append zero to single digit values, useful for converting date values (i.e. '2' ––> '02').
function appendZero(value: number | string): string {
    value = String(value);
    return (value.length === 1) ? '0' + value : value;
}

export { generateUID };

