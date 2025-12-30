export class EnumHelper<T extends number | string> {
    constructor(
        private enumObj: object,
        private descriptions: Record<T, string>,
    ) { }

    getDescription(status: T): string {
        return this.descriptions[status];
    }

    fromValue(value: number | string): T | undefined {
        return Object.values(this.enumObj).includes(value)
            ? (value as T)
            : undefined;
    }

    isValid(value: number | string): boolean {
        return Object.values(this.enumObj).includes(value);
    }

    getAll(): Array<{ value: T; label: string }> {
        return Object.keys(this.descriptions).map((key) => {
            let value: any = key;
            // Convert to number if the key is a numeric string (common in numeric enums)
            if (!isNaN(Number(key))) {
                value = Number(key);
            }

            return {
                value: value as T,
                label: this.descriptions[value as any],
            };
        });
    }
}
