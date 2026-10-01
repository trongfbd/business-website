import { createClient, type Client, type InValue } from '@libsql/client'
import bcrypt from 'bcryptjs'

// Turso (libSQL) khi có TURSO_DATABASE_URL — dùng cho Vercel/serverless.
// Không có thì dùng file SQLite local như trước.
const DB_URL = process.env.TURSO_DATABASE_URL || 'file:database/site.db'

let client: Client
let ready: Promise<void> | null = null

function getClient(): Client {
  if (!client) {
    client = createClient({ url: DB_URL, authToken: process.env.TURSO_AUTH_TOKEN })
  }
  if (!ready) {
    ready = initSchema(client).then(() => ensureAdminUser(client))
    ready.catch(() => { ready = null })
  }
  return client
}

async function execute(sql: string, args: unknown[]) {
  const c = getClient()
  await ready
  return c.execute({ sql, args: args as InValue[] })
}

// libSQL trả về Row (array-like) — chuyển sang object thường để truyền sang Client Component
function toObject(row: Record<string, unknown>, columns: string[]) {
  const obj: Record<string, unknown> = {}
  for (const col of columns) obj[col] = row[col]
  return obj
}

// Giữ API giống better-sqlite3 (prepare → get/all/run) nhưng async
export function getDb() {
  return {
    prepare(sql: string) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async get(...args: unknown[]): Promise<any> {
          const rs = await execute(sql, args)
          return rs.rows[0] ? toObject(rs.rows[0], rs.columns) : undefined
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async all(...args: unknown[]): Promise<any[]> {
          const rs = await execute(sql, args)
          return rs.rows.map((r) => toObject(r, rs.columns))
        },
        async run(...args: unknown[]) {
          const rs = await execute(sql, args)
          return {
            changes: rs.rowsAffected,
            lastInsertRowid: rs.lastInsertRowid !== undefined ? Number(rs.lastInsertRowid) : undefined,
          }
        },
      }
    },
  }
}

async function initSchema(database: Client) {
  await database.executeMultiple(`
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
async function ensureAdminUser(database: Client) {
  const existing = await database.execute({ sql: 'SELECT id FROM users WHERE username = ?', args: ['admin'] })
  if (existing.rows.length === 0) {
    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Admin@123456', 12)
    await database.execute({
      sql: 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      args: ['admin', hash, 'admin'],
    })
  }
}
