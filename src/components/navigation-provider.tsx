import type { ReactNode } from 'react';
import { NavigationStart } from '../platform/navigation-state';
// A screen's own cold boundary loads once; navigating never paints a blocking skeleton.
export function NavigationProvider({children}:{children:ReactNode}) {return <NavigationStart.Provider value={()=>{}}>{children}</NavigationStart.Provider>;}
