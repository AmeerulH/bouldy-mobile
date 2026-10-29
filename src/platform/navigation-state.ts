import { createContext, useContext } from 'react';
export const NavigationStart = createContext<(destination: string) => void>(() => {});
export const useNavigationStart = () => useContext(NavigationStart);

export function navigationPressAllowed(event: unknown) {
 const native=(event as {nativeEvent?:{metaKey?:boolean;ctrlKey?:boolean;shiftKey?:boolean;altKey?:boolean;button?:number}})?.nativeEvent;
 return !native?.metaKey&&!native?.ctrlKey&&!native?.shiftKey&&!native?.altKey&&(native?.button===undefined||native.button===0);
}
