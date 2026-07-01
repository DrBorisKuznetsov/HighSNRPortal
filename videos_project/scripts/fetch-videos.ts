import fs from 'fs';
import path from 'path';

// YouTube Channel Config
const CHANNEL_ID = 'UCkE2oK8ZXrhNySIP__hSmCw';

let apiKey = '';
let quotaUsed = 0;

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    medium: string;
    high: string;
    maxres?: string;
  };
  duration: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  playlistId?: string;
  playlistTitle?: string;
}

interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
  videoIds: string[];
  order: number;
}

// Helper fetch wrapper for YouTube Data API v3
async function ytFetch(endpoint: string, params: Record<string, string>): Promise<any> {
  const urlParams = new URLSearchParams({ ...params, key: apiKey });
  const url = `https://www.googleapis.com/youtube/v3/${endpoint}?${urlParams.toString()}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`YouTube API Error [${response.status}]: ${errText}`);
  }
  
  quotaUsed += 1; // Basic count of API calls (each usually costs 1 unit, search can cost more)
  return response.json();
}

// 1. Fetch channel basic details and uploads playlist ID
async function fetchChannelInfo(): Promise<{ channel: any; uploadsPlaylistId: string }> {
  console.log('Fetching channel details...');
  const data = await ytFetch('channels', {
    part: 'snippet,statistics,contentDetails',
    id: CHANNEL_ID,
  });

  if (!data.items || data.items.length === 0) {
    throw new Error(`Channel not found for ID: ${CHANNEL_ID}`);
  }

  const item = data.items[0];
  const channel = {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    customUrl: item.snippet.customUrl,
    publishedAt: item.snippet.publishedAt,
    thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
    subscriberCount: parseInt(item.statistics.subscriberCount || '0'),
    viewCount: parseInt(item.statistics.viewCount || '0'),
    videoCount: parseInt(item.statistics.videoCount || '0'),
  };

  const uploadsPlaylistId = item.contentDetails.relatedPlaylists.uploads;
  return { channel, uploadsPlaylistId };
}

// 2. Fetch all playlists
async function fetchPlaylists(channelId: string): Promise<YouTubePlaylist[]> {
  console.log('Fetching playlists...');
  const allPlaylists: YouTubePlaylist[] = [];
  let pageToken = '';
  let order = 0;

  do {
    const params: Record<string, string> = {
      part: 'snippet,contentDetails',
      channelId,
      maxResults: '50',
    };
    if (pageToken) params.pageToken = pageToken;

    const data = await ytFetch('playlists', params);

    for (const item of data.items || []) {
      // Exclude empty playlists
      if (item.contentDetails.itemCount === 0) continue;

      allPlaylists.push({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description || '',
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
        videoCount: item.contentDetails.itemCount,
        videoIds: [], // populated later
        order: order++,
      });
    }

    pageToken = data.nextPageToken || '';
  } while (pageToken);

  console.log(`  Found ${allPlaylists.length} playlists.`);
  return allPlaylists;
}

// 3. Fetch all video IDs from a playlist (paginated)
async function fetchPlaylistVideoIds(playlistId: string): Promise<string[]> {
  const videoIds: string[] = [];
  let pageToken = '';

  do {
    const params: Record<string, string> = {
      part: 'contentDetails',
      playlistId,
      maxResults: '50',
    };
    if (pageToken) params.pageToken = pageToken;

    const data = await ytFetch('playlistItems', params);

    for (const item of data.items || []) {
      videoIds.push(item.contentDetails.videoId);
    }

    pageToken = data.nextPageToken || '';
  } while (pageToken);

  return videoIds;
}

// 4. Fetch details for a batch of videos
async function fetchVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
  const videos: YouTubeVideo[] = [];

  // Batch by 50 (API limit)
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);

    const data = await ytFetch('videos', {
      part: 'snippet,contentDetails,statistics',
      id: batch.join(','),
    });

    for (const item of data.items || []) {
      videos.push({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description || '',
        publishedAt: item.snippet.publishedAt,
        thumbnails: {
          medium: item.snippet.thumbnails?.medium?.url || '',
          high: item.snippet.thumbnails?.high?.url || '',
          maxres: item.snippet.thumbnails?.maxres?.url,
        },
        duration: item.contentDetails.duration,
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        commentCount: parseInt(item.statistics.commentCount || '0'),
        tags: item.snippet.tags || [],
      });
    }

    console.log(`  Fetched details for ${Math.min(i + 50, videoIds.length)}/${videoIds.length} videos`);
  }

  return videos;
}

// 5. Main Script Runner
async function main() {
  apiKey = process.argv[2];

  if (!apiKey || apiKey === 'undefined' || apiKey.startsWith('$') || apiKey.startsWith('%')) {
    console.warn('YouTube API Key is missing or invalid. Skipping channel sync. (This is normal during local builds without secrets)');
    
    // Create empty files or read existing ones so building doesn't fail
    const fs = await import('fs');
    const path = await import('path');
    const dataDir = path.join(process.cwd(), 'src', 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    
    const vFile = path.join(dataDir, 'videos.json');
    const cFile = path.join(dataDir, 'channel.json');
    const sFile = path.join(dataDir, 'series.json');

    if (!fs.existsSync(cFile)) {
      fs.writeFileSync(cFile, JSON.stringify({
        id: CHANNEL_ID,
        title: "High SNR Channel",
        description: "Official portal for precision electronics engineering channel",
        customUrl: "@High_SNR_Channel",
        publishedAt: new Date().toISOString(),
        thumbnail: "",
        subscriberCount: 1540,
        viewCount: 42000,
        videoCount: 10
      }, null, 2));
    }
    if (!fs.existsSync(vFile)) fs.writeFileSync(vFile, JSON.stringify([], null, 2));
    if (!fs.existsSync(sFile)) fs.writeFileSync(sFile, JSON.stringify([], null, 2));

    process.exit(0);
  }

  console.log('');
  console.log('====================================================');
  console.log('      High SNR Channel YouTube Data Sync Script     ');
  console.log('====================================================');
  console.log('');

  try {
    // 1. Channel Info
    const { channel, uploadsPlaylistId } = await fetchChannelInfo();

    // 2. Playlists
    const playlists = await fetchPlaylists(channel.id);

    // 3. Uploaded Video IDs
    console.log('Fetching uploads list video IDs...');
    const allVideoIds = await fetchPlaylistVideoIds(uploadsPlaylistId);
    console.log(`  Total upload video IDs found: ${allVideoIds.length}`);

    // 4. Video Details
    console.log('Fetching detailed video statistics...');
    const allVideos = await fetchVideoDetails(allVideoIds);

    // 5. Map videos to playlists
    console.log('Mapping videos to their playlists...');
    for (const playlist of playlists) {
      const playlistVideoIds = await fetchPlaylistVideoIds(playlist.id);
      playlist.videoIds = playlistVideoIds;

      // Assign playlist mapping to videos
      for (const vid of allVideos) {
        if (playlistVideoIds.includes(vid.id) && !vid.playlistId) {
          vid.playlistId = playlist.id;
          vid.playlistTitle = playlist.title;
        }
      }
      console.log(`  Mapped ${playlistVideoIds.length} videos to playlist: "${playlist.title}"`);
    }

    // 6. Sort videos by published date (newest first)
    allVideos.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    // 7. Save to JSON files
    const dataDir = path.join(process.cwd(), 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(dataDir, 'channel.json'),
      JSON.stringify(channel, null, 2),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(dataDir, 'videos.json'),
      JSON.stringify(allVideos, null, 2),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(dataDir, 'series.json'),
      JSON.stringify(playlists, null, 2),
      'utf-8'
    );

    console.log('');
    console.log('====================================================');
    console.log('Sync finished successfully!');
    console.log(`  Channel Name: ${channel.title}`);
    console.log(`  Subscribers:  ${channel.subscriberCount.toLocaleString()}`);
    console.log(`  Total Videos: ${allVideos.length}`);
    console.log(`  Playlists:    ${playlists.length}`);
    console.log(`  Quota units used: ~${quotaUsed}`);
    console.log('====================================================');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('Fatal Sync Error:', (error as Error).message);
    process.exit(1);
  }
}

main();
