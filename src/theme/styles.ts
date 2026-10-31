import { StyleSheet } from 'react-native';
import { colors as c } from './colors';
export const s=StyleSheet.create({
 row:{flexDirection:'row',alignItems:'center'},between:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 page:{paddingHorizontal:20,paddingTop:20,paddingBottom:32,gap:24},
 line:{borderColor:c.hairline,borderTopWidth:1},panel:{backgroundColor:c.panel,borderRadius:12,padding:20},
 muted:{color:c['ink-muted']},tiny:{fontSize:12,lineHeight:16},button:{minHeight:48,paddingHorizontal:20,borderRadius:999,justifyContent:'center',alignItems:'center'},
});
