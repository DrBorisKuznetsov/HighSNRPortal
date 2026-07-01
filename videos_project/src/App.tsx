import { Play, Users, Video } from 'lucide-react';
import channelData from './data/channel.json';
import videosData from './data/videos.json';

export default function App() {
  const portalHref = import.meta.env.DEV ? 'http://localhost:5173/' : '/';
  const channelLogoSrc = `${import.meta.env.BASE_URL}channel-logo.png`;

  return (
    <div className="app-container">
      {/* Header/Nav for Independent Project */}
      <header className="header">
        <div className="container header-container">
          <a href={portalHref} className="logo" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            Back to Portal
          </a>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Video Catalog</div>
        </div>
      </header>

      <main className="main-content" style={{ paddingBottom: '5rem' }}>
        
        {/* Channel Stats Section */}
        <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-base)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--border-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={channelLogoSrc} alt={channelData.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{channelData.title}</h1>
                <a href={`https://youtube.com/${channelData.customUrl}`} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {channelData.customUrl}
                </a>
              </div>
            </div>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', marginBottom: '3rem' }}>
              {channelData.description}
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 200px' }}>
                <Users size={24} color="var(--text-tertiary)" />
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{channelData.subscriberCount.toLocaleString()}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subscribers</div>
                </div>
              </div>
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 200px' }}>
                <Play size={24} color="var(--text-tertiary)" />
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{channelData.viewCount.toLocaleString()}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Views</div>
                </div>
              </div>
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-base)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 200px' }}>
                <Video size={24} color="var(--text-tertiary)" />
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{channelData.videoCount.toLocaleString()}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Videos</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Grid Section */}
        <section style={{ padding: '4rem 0' }}>
          <div className="container">
            <h2 style={{ marginBottom: '2rem' }}>Latest Uploads</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {videosData.map((video) => (
                <a key={video.id} href={`https://youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="video-card">
                  <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
                    <img src={video.thumbnails?.medium || video.thumbnails?.high} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
                      {video.duration.replace('PT', '').replace('H', ':').replace('M', ':').replace('S', '')}
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{video.title}</h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                      <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                      <span>{Number(video.viewCount).toLocaleString()} views</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

          </div>
        </section>
        
      </main>
    </div>
  );
}
