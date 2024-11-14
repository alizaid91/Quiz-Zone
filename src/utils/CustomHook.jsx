import { useEffect } from "react";

export function useLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function useClickOutside(handalClick) {
    useEffect(() => {
        addEventListener("click", handalClick, true)

        return () => {
            removeEventListener("click", handalClick, true);
        }
    }, [])
}