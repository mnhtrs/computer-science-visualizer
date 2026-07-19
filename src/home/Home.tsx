// home/Home.tsx
// Professional homepage with logo mark, hero badge, enterprise footer.

import { useState } from 'react'
import { useChapters } from '../chapter-loader/useChapters'
import type { ChapterMeta, Lang } from '../chapter-loader/types'
import './home.css'

const FACEBOOK_URL = 'https://facebook.com/cesvi'
const DISCORD_URL = 'https://discord.gg/cesvi'

export default function Home({ onOpen }: { onOpen: (chapterId: string) => void }) {
  const chapters = useChapters()
  const [lang, setLang] = useState<Lang>('en')
  const year = new Date().getFullYear()
  const t = lang === 'vi'

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
              <button className="header-link">{t ? 'Khám phá' : 'Explore'}</button>
              <button className="header-link">{t ? 'Giới thiệu' : 'About'}</button>
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

        <div className="grid">
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
            <div className="footer-brand-col">
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
              <div className="footer-col">
                <div className="footer-col-title">{t ? 'Nội dung' : 'Content'}</div>
                <button className="header-link" style={{ padding: '4px 0' }}>{t ? 'Tất cả bài học' : 'All Lessons'}</button>
                <button className="header-link" style={{ padding: '4px 0' }}>{t ? 'Sắp ra mắt' : 'Coming Soon'}</button>
              </div>
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
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="social-btn" title="Facebook" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="social-btn" title="Discord" aria-label="Discord">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
