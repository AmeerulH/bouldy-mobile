import { Pressable } from './pressable';
import { View,ScrollView } from 'react-native';
import { useNavigationStart, navigationPressAllowed } from '../platform/navigation-state';
import { Link,useFocusEffect,useLocalSearchParams } from 'expo-router';
import { T,Icon } from './primitives';
import { colors as c } from '../theme/colors';
import { createContext,useCallback,useContext,useEffect,useRef,type ComponentRef,type ReactNode } from 'react';
import { AppError } from '../features/app-error';
import { useAuth } from '../platform/auth';
import { PageSkeleton, type SkeletonPage } from './page-skeleton';
const Anchors=createContext<(id:string,view:ComponentRef<typeof View>|null)=>void>(()=>{});
export function ScrollAnchor({id,children}:{id:string;children:ReactNode}){const register=useContext(Anchors),ref=useRef<ComponentRef<typeof View>>(null);useEffect(()=>{const frame=requestAnimationFrame(()=>register(id,ref.current));return()=>{cancelAnimationFrame(frame);register(id,null);};});return <View ref={ref} collapsable={false} nativeID={id} onLayout={()=>register(id,ref.current)}>{children}</View>;}
export function Screen({children,back,label='Sessions'}: {children:ReactNode;back?:string;label?:string}) {const startNavigation=useNavigationStart(),scroll=useRef<ComponentRef<typeof ScrollView>>(null),params=useLocalSearchParams<Record<string,string>>();const hash=params['#']??'';
 const anchors=useRef(new Map<string,ComponentRef<typeof View>>());
 const restoreAnchor=useCallback(()=>{const view=anchors.current.get(hash),inner=scroll.current?.getInnerViewRef();if(view&&inner)view.measureLayout(inner,(_x,y)=>scroll.current?.scrollTo({y:Math.max(0,y-176),animated:false}),()=>{});},[hash]);
 // Focus can arrive after child layout. Never overwrite a restored fragment
 // with the ordinary page-top reset, and retry after content is measurable.
 useFocusEffect(useCallback(()=>{const frame=requestAnimationFrame(()=>{if(hash)restoreAnchor();else scroll.current?.scrollTo({y:0,animated:false});});return()=>cancelAnimationFrame(frame);},[hash,restoreAnchor]));
 const register=useCallback((id:string,view:ComponentRef<typeof View>|null)=>{if(view)anchors.current.set(id,view);else anchors.current.delete(id);if(id===hash)restoreAnchor();},[hash,restoreAnchor]);
 return <View style={{flex:1,backgroundColor:c.bg}}>{back?<View style={{height:56,borderBottomWidth:1,borderColor:c.hairline,justifyContent:'center',paddingHorizontal:20}}><Link href={back as never} asChild><Pressable onPress={event=>{if(navigationPressAllowed(event))startNavigation(back!);}} style={{flexDirection:'row',alignItems:'center',gap:8,minHeight:44}}><Icon name="back" color={c.ink}/><T weight={600}>{label}</T></Pressable></Link></View>:null}<ScrollView ref={scroll} onContentSizeChange={restoreAnchor} contentContainerStyle={{flexGrow:1}} keyboardShouldPersistTaps="handled"><Anchors.Provider value={register}>{children}</Anchors.Provider></ScrollView></View>;}
export function Waiting({error,page='home'}: {error?:string;page?:SkeletonPage}) {const auth=useAuth();return error?<AppError retry={auth.refresh}/>:<PageSkeleton page={page}/>;}
