import { View } from 'react-native';
import { useState } from 'react';
import { T,Heading,Button } from '../components/primitives';
import { colors as c } from '../theme/colors';
export function AppError({retry}: {retry:()=>void|Promise<void>}){const [pending,setPending]=useState(false);return <View style={{flex:1,justifyContent:'center',gap:20,paddingHorizontal:20,paddingVertical:32}}><T color={c['ink-muted']}>Bouldy</T><Heading size={36} style={{lineHeight:32.4,letterSpacing:-1.08}}>This page couldn&apos;t load.</Heading><T size={16} color={c['ink-muted']} style={{lineHeight:24}}>The climbing data didn&apos;t come through. Reload to try again.</T><Button pending={pending} pendingLabel="Reloading" onPress={async()=>{setPending(true);try{await retry();}finally{setPending(false);}}}>Reload page</Button></View>;}
