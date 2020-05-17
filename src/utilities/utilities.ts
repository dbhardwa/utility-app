// Utility helper methods.
export default class Utilities {
    // UID generation based current moment in time (useful for blocks and sub-blocks).
    // TODO: What if I spam the generateUID within one minute? Needs to have a mechanism (i.e. arbitrarily increment minute).
    public static generateUID(date: Date): string {
        let year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes();

        return year + this.appendZero(++month) + this.appendZero(day) + this.appendZero(hour) + this.appendZero(minute);
    }

    // Append zero to single digit values, useful for converting date values (i.e. '2' ––> '02').
    private static appendZero(value: number | string): string {
        value = String(value);
        return (value.length === 1) ? '0' + value : value;
    }

}
