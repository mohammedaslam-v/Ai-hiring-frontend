import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
    const readValue = useCallback((): T => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch {
            return initialValue;
        }
    }, [key, initialValue]);

    const [storedValue, setStoredValue] = useState<T>(readValue);

    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        },
        [key, storedValue]
    );

    const removeValue = useCallback(() => {
        setStoredValue(initialValue);
        window.localStorage.removeItem(key);
    }, [key, initialValue]);

    const clearAll = useCallback(() => {
        setStoredValue(initialValue);
        window.localStorage.clear();
    }, [initialValue]);

    // Sync between tabs
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === key) {
                setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue, clearAll] as const;
}
