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
    status TEXT DEFAULT 'draft',
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

// Sample products (PCCC)
const sampleProducts = [
  {
    name: 'Bình Chữa Cháy Bột ABC MFZ4',
    slug: 'binh-chua-chay-bot-abc-mfz4',
    metaTitle: 'Bình Chữa Cháy Bột ABC MFZ4 4kg | Chính Hãng',
    metaDescription: 'Bình chữa cháy bột ABC MFZ4 dung tích 4kg, dập tắt đám cháy chất rắn, lỏng, khí hiệu quả. Đạt chuẩn TCVN, bảo hành 12 tháng.',
    keywords: 'bình chữa cháy, bình bột ABC, MFZ4, PCCC',
    images: JSON.stringify([]),
    shortDescription: 'Bình chữa cháy bột ABC 4kg, dập cháy đa năng, đạt chuẩn TCVN 7026.',
    description: '## Đặc điểm nổi bật\n\n- Dập tắt được đám cháy loại A (chất rắn), B (chất lỏng), C (chất khí)\n- Dung tích 4kg, áp suất làm việc ổn định\n- Vỏ bình thép chịu lực, sơn tĩnh điện chống gỉ\n- Kèm giá treo và hướng dẫn sử dụng\n\n## Thông số kỹ thuật\n\n- Trọng lượng: 4kg bột\n- Thời gian phun: 9 giây\n- Tầm phun xa: 2-3m\n- Đạt chuẩn: TCVN 7026:2002',
    category: 'Bình chữa cháy',
    price: 350000,
    status: 'published',
    featured: 1,
    sortOrder: 1,
  },
  {
    name: 'Bình Chữa Cháy CO2 MT3',
    slug: 'binh-chua-chay-co2-mt3',
    metaTitle: 'Bình Chữa Cháy CO2 MT3 3kg | An Toàn Cho Thiết Bị Điện',
    metaDescription: 'Bình chữa cháy CO2 MT3 phù hợp dập cháy thiết bị điện, phòng máy chủ, không để lại cặn bẩn sau khi sử dụng.',
    keywords: 'bình chữa cháy CO2, MT3, chữa cháy thiết bị điện',
    images: JSON.stringify([]),
    shortDescription: 'Bình CO2 3kg, an toàn cho thiết bị điện tử, phòng máy chủ, tủ điện.',
    description: '## Đặc điểm nổi bật\n\n- Phù hợp chữa cháy thiết bị điện, điện tử mà không gây hư hại\n- Không để lại cặn, dễ vệ sinh sau sử dụng\n- Thiết kế nhỏ gọn, dễ thao tác\n\n## Thông số kỹ thuật\n\n- Trọng lượng khí CO2: 3kg\n- Đạt chuẩn: TCVN 7026:2002',
    category: 'Bình chữa cháy',
    price: 450000,
    status: 'published',
    featured: 1,
    sortOrder: 2,
  },
  {
    name: 'Hệ Thống Báo Cháy Tự Động Trung Tâm 8 Kênh',
    slug: 'he-thong-bao-chay-tu-dong-trung-tam-8-kenh',
    metaTitle: 'Hệ Thống Báo Cháy Tự Động Trung Tâm 8 Kênh | Lắp Đặt Trọn Gói',
    metaDescription: 'Tủ trung tâm báo cháy 8 kênh, kết nối đầu báo khói, báo nhiệt, chuông còi báo động. Tư vấn thiết kế và thi công trọn gói.',
    keywords: 'báo cháy tự động, tủ trung tâm báo cháy, hệ thống PCCC',
    images: JSON.stringify([]),
    shortDescription: 'Tủ trung tâm 8 kênh, giám sát toàn bộ hệ thống báo cháy của tòa nhà.',
    description: '## Đặc điểm nổi bật\n\n- Quản lý tối đa 8 kênh/zone báo cháy\n- Hiển thị LCD trực quan, dễ vận hành\n- Tích hợp pin dự phòng khi mất điện\n- Kết nối được đầu báo khói, báo nhiệt, nút nhấn khẩn cấp\n\n## Dịch vụ đi kèm\n\nĐội ngũ kỹ thuật khảo sát, thiết kế sơ đồ và thi công trọn gói theo tiêu chuẩn PCCC hiện hành.',
    category: 'Hệ thống báo cháy',
    price: null,
    status: 'published',
    featured: 1,
    sortOrder: 3,
  },
  {
    name: 'Đầu Báo Khói Quang Điện',
    slug: 'dau-bao-khoi-quang-dien',
    metaTitle: 'Đầu Báo Khói Quang Điện | Độ Nhạy Cao, Chống Báo Giả',
    metaDescription: 'Đầu báo khói quang điện độ nhạy cao, chống báo động giả, tương thích hầu hết tủ trung tâm báo cháy thông dụng.',
    keywords: 'đầu báo khói, đầu báo cháy, quang điện',
    images: JSON.stringify([]),
    shortDescription: 'Đầu báo khói quang điện, phát hiện sớm khói trong không gian kín.',
    description: '## Đặc điểm nổi bật\n\n- Cảm biến quang điện độ nhạy cao\n- Chống báo động giả do bụi/hơi nước thông thường\n- Đèn LED báo trạng thái hoạt động\n- Lắp đặt nhanh chóng, tương thích đa số hệ tủ trung tâm',
    category: 'Đầu báo cháy',
    price: 180000,
    status: 'published',
    featured: 0,
    sortOrder: 4,
  },
  {
    name: 'Vòi Chữa Cháy Vải Tráng Cao Su D50',
    slug: 'voi-chua-chay-vai-trang-cao-su-d50',
    metaTitle: 'Vòi Chữa Cháy Vải Tráng Cao Su D50 | Chịu Áp Lực Cao',
    metaDescription: 'Vòi chữa cháy D50 vải tráng cao su, chịu áp lực cao, bền bỉ, đạt chuẩn PCCC cho hệ thống họng nước chữa cháy vách tường.',
    keywords: 'vòi chữa cháy, vòi D50, vòi vải tráng cao su',
    images: JSON.stringify([]),
    shortDescription: 'Vòi D50 chịu áp lực cao, dùng cho hệ thống họng nước chữa cháy vách tường.',
    description: '## Đặc điểm nổi bật\n\n- Chất liệu vải tráng cao su bền, chịu áp lực nước cao\n- Đường kính D50mm tiêu chuẩn\n- Phù hợp lắp đặt tại các họng nước chữa cháy vách tường\n- Kèm khớp nối tiêu chuẩn',
    category: 'Phụ kiện PCCC',
    price: 420000,
    status: 'published',
    featured: 0,
    sortOrder: 5,
  },
  {
    name: 'Đèn Exit Thoát Hiểm Chiếu Sáng Khẩn Cấp',
    slug: 'den-exit-thoat-hiem-chieu-sang-khan-cap',
    metaTitle: 'Đèn Exit Thoát Hiểm Chiếu Sáng Khẩn Cấp | Pin Dự Phòng 3 Giờ',
    metaDescription: 'Đèn Exit chỉ dẫn lối thoát hiểm tích hợp pin sạc dự phòng, tự động sáng khi mất điện, đạt chuẩn an toàn PCCC.',
    keywords: 'đèn exit, đèn thoát hiểm, đèn chiếu sáng khẩn cấp',
    images: JSON.stringify([]),
    shortDescription: 'Đèn chỉ dẫn lối thoát hiểm, tự động sáng khi mất điện, pin dự phòng 3 giờ.',
    description: '## Đặc điểm nổi bật\n\n- Tự động chuyển sang chiếu sáng bằng pin khi mất điện lưới\n- Thời gian chiếu sáng dự phòng tối thiểu 3 giờ\n- Đèn LED tiết kiệm điện, tuổi thọ cao\n- Lắp đặt dễ dàng tại hành lang, cầu thang thoát hiểm',
    category: 'Thiết bị thoát hiểm',
    price: 290000,
    status: 'published',
    featured: 0,
    sortOrder: 6,
  },
]

const insertProduct = db.prepare(`
  INSERT INTO products (name, slug, meta_title, meta_description, keywords, images, short_description, description, category, price, status, featured, sort_order)
  VALUES (@name, @slug, @metaTitle, @metaDescription, @keywords, @images, @shortDescription, @description, @category, @price, @status, @featured, @sortOrder)
`)

let createdCount = 0
for (const p of sampleProducts) {
  const exists = db.prepare('SELECT id FROM products WHERE slug = ?').get(p.slug)
  if (!exists) {
    insertProduct.run(p)
    createdCount++
  }
}
if (createdCount > 0) console.log(`✅ ${createdCount} sample products created`)

console.log('✅ Database initialized successfully!')
db.close()
