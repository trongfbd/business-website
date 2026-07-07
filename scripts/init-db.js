const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')

const dbDir = path.join(__dirname, '..', 'database')
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })

const db = new Database(path.join(dbDir, 'site.db'))
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    thumbnail TEXT,
    short_description TEXT,
    content TEXT,
    category TEXT,
    tags TEXT DEFAULT '[]',
    faq TEXT DEFAULT '[]',
    author TEXT DEFAULT 'Admin',
    status TEXT DEFAULT 'draft',
    view_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime'))
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );
  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    page TEXT,
    metadata TEXT,
    ip TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );
`)

// Create default admin
const existing = db.prepare('SELECT id FROM users WHERE username = ?').get('admin')
if (!existing) {
  const hash = bcrypt.hashSync('Admin@123456', 12)
  db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run('admin', hash, 'admin')
  console.log('✅ Admin user created: admin / Admin@123456')
} else {
  console.log('ℹ️ Admin user already exists')
}

// Sample post
const sampleSlug = 'bai-viet-dau-tien-cua-chung-toi'
const samplePost = db.prepare('SELECT id FROM posts WHERE slug = ?').get(sampleSlug)
if (!samplePost) {
  db.prepare(`
    INSERT INTO posts (title, slug, meta_title, meta_description, short_description, content, category, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'Bài Viết Đầu Tiên Của Chúng Tôi',
    sampleSlug,
    'Bài Viết Đầu Tiên | ABC Vietnam',
    'Chào mừng đến với blog của chúng tôi. Đây là bài viết đầu tiên.',
    'Chào mừng bạn đến với blog của chúng tôi. Hãy cùng khám phá những kiến thức bổ ích.',
    '# Chào mừng!\n\nĐây là bài viết đầu tiên trên blog của chúng tôi.\n\n## Về Chúng Tôi\n\nChúng tôi cung cấp dịch vụ chuyên nghiệp với hơn 10 năm kinh nghiệm.\n\n## Liên Hệ\n\nHãy liên hệ ngay để được tư vấn miễn phí!',
    'Tin tức',
    'published'
  )
  console.log('✅ Sample post created')
}

console.log('✅ Database initialized successfully!')
db.close()
