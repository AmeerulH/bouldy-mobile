import { useState } from 'react';
import { View } from 'react-native';
import { T,Field,Button,Feedback } from './primitives';
import { useSnackbar } from './snackbar';
import { Sheet } from './sheet';
import { useSheetNavigation } from '../platform/sheet-navigation';
import { useAuth } from '../platform/auth';
import { colors as c } from '../theme/colors';
export function AttemptNote({attemptId,sessionId,notes,inline=false,onSaved}: {attemptId:number;sessionId:number;notes:string|null;inline?:boolean;onSaved?:(text:string)=>void}){
 const auth=useAuth(),showSnackbar=useSnackbar(),nav=useSheetNavigation();const sheetId=`note-${attemptId}`;const [draft,setDraft]=useState(notes??''),[saved,setSaved]=useState(notes??''),[editing,setEditing]=useState(false),[pending,setPending]=useState(false),[error,setError]=useState('');
 async function save(){setPending(true);setError('');try{const out=await auth.command('saveAttemptNote',{attempt_id:attemptId,session_id:sessionId,notes:draft});if(out.status==='saved'){setSaved(draft);if(inline)setEditing(false);else nav.close();if(onSaved)onSaved(out.message??'Private note saved.');else showSnackbar(out.message??'Private note saved.');}else setError(out.message??'');}catch(e){setError((e as Error).message);}finally{setPending(false);}}
 const form=<View style={{gap:12}}><Field label="Your note" value={draft} onChangeText={setDraft} multiline numberOfLines={inline?3:4} placeholder="That heel hook made the difference…" editable={!pending} style={{minHeight:inline?88:112,textAlignVertical:'top'}}/>{error?<Feedback>{error}</Feedback>:null}<View style={{flexDirection:'column',gap:12}}><Button pending={pending} pendingLabel="Saving note" onPress={save} style={inline?{flex:1}:undefined}>Save note</Button><Button variant="neutral" onPress={()=>{if(inline)setEditing(false);else nav.close();}} style={{...(inline?{flex:1}:{}),borderRadius:999}} labelStyle={{color:c['ink-muted'],fontFamily:'Geist-600'}}>Cancel</Button></View></View>;
 return <View style={{borderTopWidth:1,borderColor:c.hairline,paddingTop:12}}><T size={12} weight={600} color={c['ink-muted']}>Private note · only you</T>{inline&&editing?<View style={{marginTop:12}}>{form}</View>:<><T style={{marginTop:8,lineHeight:24}} color={saved?c.ink:c['ink-muted']}>{saved||'Remember what helped, or come back to this later.'}</T><Button variant="neutral" onPress={()=>{setDraft(saved);if(inline)setEditing(true);else nav.open(sheetId);setError('');}} style={{minHeight:48,marginTop:12}} labelStyle={{fontFamily:'Geist-600'}}>{saved?'Edit note':'Add a note'}</Button></>}{!inline?<Sheet title="Private note" open={nav.sheet===sheetId} close={nav.close}>{form}</Sheet>:null}</View>;
}
