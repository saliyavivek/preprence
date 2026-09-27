import { useCallback, useEffect, useState } from "react";

export type DebouncedSearchOptions<T> = {
    query: string;
    initialValue: T;
    debounceMs?: number;
    fetcher: (normalizedQuery: string, controller: AbortController) => Promise<T>;
};

export function useDebouncedSearch<T>({
    query,
    initialValue,
    debounceMs = 250,
    fetcher,
}: DebouncedSearchOptions<T>) {
    const [value, setValue] = useState<T>(initialValue);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const normalizedQuery = query.trim();

        if (!normalizedQuery) {
            return;
        }

        const controller = new AbortController();
        const timeout = window.setTimeout(async () => {
            setIsLoading(true);

            try {
                const nextValue = await fetcher(normalizedQuery, controller);
                setValue(nextValue);
                setIsOpen(true);
            } catch {
                if (!controller.signal.aborted) {
                    setValue(initialValue);
                    setIsOpen(true);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }, debounceMs);

        return () => {
            window.clearTimeout(timeout);
            controller.abort();
        };
    }, [query, debounceMs, fetcher, initialValue]);

    const reset = useCallback(() => {
        setValue(initialValue);
        setIsOpen(false);
        setIsLoading(false);
    }, [initialValue]);

    return {
        value,
        setValue,
        isLoading,
        isOpen,
        setIsOpen,
        reset,
    };
}
