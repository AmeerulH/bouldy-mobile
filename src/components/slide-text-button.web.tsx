import { A } from './primitives';
import { colors as c } from '../theme/colors';
export function SlideTextButton({ href, text, hoverText = text }: { href: string; text: string; hoverText?: string }) {
  return <A href={href} color={c.ink}><span className="bouldy-slide" aria-label={text}><span aria-hidden="true" className="bouldy-slide-inner">{text}<span className="bouldy-slide-next">{hoverText}</span></span></span></A>;
}
