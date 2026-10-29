import { Pressable } from './pressable';
import React,{useEffect,useRef,type ReactNode} from 'react';
import { View,ScrollView } from 'react-native';
import { Heading,Icon } from './primitives';
import { colors as c } from '../theme/colors';
export function Sheet({title,children,open,close}: {title:string;children:ReactNode;open:boolean;close:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),drag=useRef<number|null>(null);
 useEffect(()=>{
  const d=dialog.current;if(!d)return;
  if(open){if(!d.open)d.showModal();return;}
  if(!d.open)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.close();return;}
  const timer=setTimeout(()=>d.close(),200);return()=>clearTimeout(timer);
 },[open]);
 function dragDown(e:React.PointerEvent<HTMLDivElement>){drag.current=e.clientY;e.currentTarget.setPointerCapture(e.pointerId);}
 function dragMove(e:React.PointerEvent<HTMLDivElement>){if(drag.current!==null&&dialog.current)dialog.current.style.transform=`translateY(${Math.max(0,e.clientY-drag.current)}px)`;}
 function dragEnd(e:React.PointerEvent<HTMLDivElement>){const delta=drag.current===null?0:e.clientY-drag.current;drag.current=null;if(dialog.current)dialog.current.style.transform='';if(delta>80)close();}
 return <dialog ref={dialog} aria-label={title} data-closing={!open||undefined} onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}} className="bouldy-sheet" style={{position:'fixed',inset:'auto 0 0',margin:'0 auto',padding:0,border:0,width:'100%',maxWidth:430,maxHeight:'88dvh',borderRadius:'16px 16px 0 0',background:c.bg,color:c.ink,overflow:'hidden'}}>
  <View style={{maxHeight:'88dvh' as never}}><View style={{flexDirection:'row',gap:8,paddingLeft:20,paddingRight:12}}>
   <div style={{flex:1,minWidth:0,padding:'26px 0 12px',touchAction:'none'}} onPointerDown={dragDown} onPointerMove={dragMove} onPointerUp={dragEnd} onPointerCancel={dragEnd}><Heading>{title}</Heading></div>
   <View style={{position:'absolute',top:8,left:'50%',width:36,height:4,marginLeft:-18,borderRadius:999,backgroundColor:c.hairline}}/>
   <Pressable accessibilityRole="button" accessibilityLabel={`Close ${title}`} onPress={close} style={{width:44,height:44,marginTop:16,alignItems:'center',justifyContent:'center',borderRadius:999}}><Icon name="close" color={c['ink-muted']}/></Pressable>
  </View><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingTop:4,paddingHorizontal:20,paddingBottom:24}}>{children}</ScrollView></View>
 </dialog>;
}
