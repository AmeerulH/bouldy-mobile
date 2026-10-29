import { useLocalSearchParams,useRouter } from 'expo-router';
import { BackHandler } from 'react-native';
import { useEffect } from 'react';
import { useScreenFocus } from './screen-focus';
export function useSheetNavigation(){const params=useLocalSearchParams<Record<string,string>>(),router=useRouter();
 const focused=useScreenFocus();
 function close(){router.setParams({sheet:undefined,error:undefined});}
 useEffect(()=>{if(!focused||!params.sheet)return;const sub=BackHandler.addEventListener('hardwareBackPress',()=>{close();return true;});return()=>sub.remove();});
 function open(id:string){router.setParams({sheet:id,error:undefined,notice:undefined});}
 function apply(destination:string){router.replace(destination as never);}
 return {sheet:params.sheet,error:params.error,open,close,apply};
}
