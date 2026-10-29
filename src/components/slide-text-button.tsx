import { A } from './primitives';
import { colors as c } from '../theme/colors';
export function SlideTextButton({ href, text }: { href: string; text: string; hoverText?: string }) { return <A href={href} color={c.ink}>{text}</A>; }
