// home/Home.tsx
// Professional homepage with logo mark, hero badge, enterprise footer.

import { useState } from 'react'
import { useChapters } from '../chapter-loader/useChapters'
import type { ChapterMeta, Lang } from '../chapter-loader/types'
import SocialButtons, { FACEBOOK_URL, DISCORD_URL } from '../components/SocialButtons'
import './home.css'

export default function Home({ onOpen }: { onOpen: (chapterId: string) => void }) {
  const chapters = useChapters()
  const [lang, setLang] = useState<Lang>('en')
  const year = new Date().getFullYear()
  const t = lang === 'vi'
  // VIEWER SHELL v1.1.2 (F79/D3, owner round 18): the header nav was a dead
  // pair of buttons — now they SCROLL: Explore -> the journeys grid,
  // About -> the Cesvi description in the footer.
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="home">
      {/* ===== HEADER ===== */}
      <header className="home-header">
        <div className="header-inner">
          <div className="logo-wrap">
            <img className="logo-mark" src="/favicon.svg" alt="Cesvi" />
            <div className="logo">Cesvi</div>
          </div>
          <div className="header-right">
            <div className="header-nav">
              <button className="header-link" onClick={() => scrollTo('journeys')}>{t ? 'Khám phá' : 'Explore'}</button>
              <button className="header-link" onClick={() => scrollTo('about')}>{t ? 'Giới thiệu' : 'About'}</button>
            </div>
            {(['en', 'vi'] as Lang[]).map((l) => (
              <button key={l} className={`lang-pill ${lang === l ? 'on' : ''}`} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="home-main">
        <div className="hero">
          <h1 className="brand">
            {t ? 'Học Khoa học Máy tính bằng hình ảnh' : 'Learn Computer Science visually'}
          </h1>
          <p className="tagline">
            {t ? 'Chọn một hành trình trực quan để bắt đầu' : 'Choose a visual journey to begin'}
          </p>
        </div>

        <div className="grid" id="journeys">
          {chapters.map((c: ChapterMeta) => {
            const available = c.status === 'available'
            return (
              <button
                key={c.id}
                className={`card ${available ? 'available' : 'soon'}`}
                onClick={available ? () => onOpen(c.id) : undefined}
                disabled={!available}
                style={{ ['--accent' as string]: c.accent }}
              >
                <div className="thumb">
                  {c.thumbnail ? <img src={c.thumbnail} alt="" /> : <div className="thumb-empty" />}
                  {!available && (
                    <div className="badge-soon">{t ? 'Sắp ra mắt' : 'Coming Soon'}</div>
                  )}
                </div>
                <div className="card-body">
                  <div className="card-num">{String(c.order).padStart(2, '0')}</div>
                  <div className="card-title">{c.title[lang]}</div>
                  <div className="card-sub">{c.subtitle[lang]}</div>
                </div>
              </button>
            )
          })}
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand-col" id="about">
              <div className="footer-logo">
                <img className="logo-mark footer-logo-icon" src="/favicon.svg" alt="Cesvi" />
                <span className="footer-logo-text">Cesvi</span>
              </div>
              <p className="footer-desc">
                {t
                  ? 'Cesvi là nền tảng hình ảnh hóa Khoa học Máy tính. Mỗi bài học là một hành trình trực quan.'
                  : 'Cesvi is a Computer Science visualization platform. Every lesson is a visual journey.'}
              </p>
            </div>

            <div className="footer-links-col">
              {/* VIEWER SHELL v1.1.2 (F78/D1, owner round 18): the Content
                  column (All Lessons / Coming Soon) is DELETED — both buttons
                  were dead, and listing ~100 chapters would be a wall of text
                  (owner: delete it). The Community column stays. */}
              <div className="footer-col">
                <div className="footer-col-title">{t ? 'Cộng đồng' : 'Community'}</div>
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">Discord</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span className="footer-copy">
              © {year} Cesvi. {t ? 'Mọi quyền được bảo lưu.' : 'All rights reserved.'}
            </span>
            <div className="footer-social">
              {/* VIEWER SHELL v1.1.0 (F66): the two social buttons are ONE
                  shared component now (same artwork/URLs), also used by the
                  chapter Viewer's waiting controls since owner round 15. */}
              <SocialButtons />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
