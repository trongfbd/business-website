import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'
import fs from 'fs'

const DB_PATH = path.join(process.cwd(), 'database', 'site.db')

let db: Database.Database

export function getDb(): Database.Database {
  if (!db) {
    // Đảm bảo thư mục database tồn tại (cần khi deploy fresh)
    const dbDir = path.dirname(DB_PATH)
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })

    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initSchema(db)
    ensureAdminUser(db)
  }
  return db
}

function initSchema(database: Database.Database) {
  database.exec(`
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
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft','published')),
      view_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime')),
      updated_at TEXT DEFAULT (datetime('now','localtime'))
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      meta_title TEXT,
      meta_description TEXT,
      keywords TEXT,
      images TEXT DEFAULT '[]',
      short_description TEXT,
      description TEXT,
      category TEXT,
      price REAL,
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft','published')),
      featured INTEGER DEFAULT 0,
      view_count INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
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
    CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
    CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
    CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
    CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
    CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics(event_type);
  `)
}

// Tự động tạo admin user nếu chưa có — đảm bảo luôn login được sau deploy fresh
function ensureAdminUser(database: Database.Database) {
  const existing = database.prepare('SELECT id FROM users WHERE username = ?').get('admin')
  if (!existing) {
    const hash = bcrypt.hashSync('Admin@123456', 12)
    database.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run('admin', hash, 'admin')
  }
}
