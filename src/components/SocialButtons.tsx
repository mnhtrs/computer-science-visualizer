// components/SocialButtons.tsx — the two round social buttons (Facebook /
// Discord), ONE shared definition. Used by the homepage footer AND, since
// VIEWER SHELL v1.1.0 (owner round 15), by the chapter Viewer's waiting
// controls — the Viewer hides them completely once the run starts.
// VIEWER SHELL v1.1.1 (F77, owner round 17 "dùng hết bằng fa icon"): artwork
// switched from the hand-inlined official brand paths (byte-verified in
// v1.1.0) to the Font Awesome brand glyphs — one icon library everywhere.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faFacebookF } from '@fortawesome/free-brands-svg-icons'
export const FACEBOOK_URL = 'https://facebook.com/cesvi'
export const DISCORD_URL = 'https://discord.gg/cesvi'

export default function SocialButtons({ btnClass = 'social-btn' }: { btnClass?: string }) {
  return (
    <>
      <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={btnClass} title="Facebook" aria-label="Facebook">
        <FontAwesomeIcon icon={faFacebookF} />
      </a>
      <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className={btnClass} title="Discord" aria-label="Discord">
        <FontAwesomeIcon icon={faDiscord} />
      </a>
    </>
  )
}
