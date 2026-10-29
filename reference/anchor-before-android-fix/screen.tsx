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
export function ScrollAnchor({id,children}:{id:string;children:ReactNode}){const register=useContext(Anchors),ref=useRef<ComponentRef<typeof View>>(null);useEffect(()=>{const frame=requestAnimationFrame(()=>register(id,ref.current));return()=>cancelAnimationFrame(frame);});return <View ref={ref} collapsable={false} nativeID={id} onLayout={()=>register(id,ref.current)}>{children}</View>;}
export function Screen({children,back,label='Sessions'}: {children:ReactNode;back?:string;label?:string}) {const startNavigation=useNavigationStart(),scroll=useRef<ComponentRef<typeof ScrollView>>(null),params=useLocalSearchParams<Record<string,string>>();const hash=params['#']??'';
 useFocusEffect(useCallback(()=>{scroll.current?.scrollTo({y:0,animated:false});},[]));
 const register=useCallback((id:string,view:ComponentRef<typeof View>|null)=>{if(id!==hash||!view)return;const inner=scroll.current?.getInnerViewRef();if(inner)view.measureLayout(inner,(_x,y)=>scroll.current?.scrollTo({y:Math.max(0,y-176),animated:false}),()=>{});},[hash]);
 return <View style={{flex:1,backgroundColor:c.bg}}>{back?<View style={{height:56,borderBottomWidth:1,borderColor:c.hairline,justifyContent:'center',paddingHorizontal:20}}><Link href={back as never} asChild><Pressable onPress={event=>{if(navigationPressAllowed(event))startNavigation(back!);}} style={{flexDirection:'row',alignItems:'center',gap:8,minHeight:44}}><Icon name="back" color={c.ink}/><T weight={600}>{label}</T></Pressable></Link></View>:null}<ScrollView ref={scroll} contentContainerStyle={{flexGrow:1}} keyboardShouldPersistTaps="handled"><Anchors.Provider value={register}>{children}</Anchors.Provider></ScrollView></View>;}
export function Waiting({error,page='home'}: {error?:string;page?:SkeletonPage}) {const auth=useAuth();return error?<AppError retry={auth.refresh}/>:<PageSkeleton page={page}/>;}
