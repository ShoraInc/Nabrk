import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const books = JSON.parse(readFileSync(join(__dirname, 'data', 'books.json'), 'utf8'))

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000
const PROXY_MODE = process.env.PROXY_MODE === 'true'
const REAL_BASE_URL = process.env.REAL_BASE_URL

app.use(cors())
app.use(express.json())

// Helper function to proxy JSON requests
async function proxyJson(endpoint, data) {
  const url = `${REAL_BASE_URL}${endpoint}`
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await r.json()
}

// Helper function for pagination
function paginate(total, page, limit) {
  const pageCount = Math.ceil(total / limit)
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)
  return { pageCount, pages }
}

// MAdvancedSearchItem: { field, operator, value }

function toBRItem(book) {
  return {
    id: book.id,
    authors: book.author,
    title: book.title,
    name: `${book.author} — ${book.title}`,
    udc: book.topic,
    yearPublic: String(book.year),
    shelfCode: '',
    publicationCode: Number(book.publication_type),
    publicationCodeName: book.publication_type === '1' ? 'Книга' : 'Публицистика',
    language: book.language,
    source_title: book.source_title,
    place_publication: book.place_publication,
    publishing: book.publishing,
    personnel: book.personnel,
    geographic_name: book.geographic_name,
    series: book.series,
    isbn_issn: book.isbn_issn,
    note: book.note,
    country_edition: book.country_edition,
    sphere: book.sphere
  }
}

function buildRefinementItems(filtered) {
  const groups = (arr, field) => {
    const map = new Map()
    for (const b of arr) {
      const key = String(b[field] ?? '')
      if (!key) continue
      map.set(key, (map.get(key) || 0) + 1)
    }
    return Array.from(map.entries())
  }
  const langItems = groups(filtered, 'language').map(([code, count]) => ({
    name: code === 'rus' ? 'Русский' : code === 'kaz' ? 'Казахский' : code,
    value: code,
    count
  }))
  const countryItems = groups(filtered, 'country_edition').map(([code, count]) => ({ name: code, value: code, count }))
  const pubTypeItems = groups(filtered, 'publication_type').map(([code, count]) => ({
    name: code === '1' ? 'Книга' : 'Публицистика', value: code, count
  }))
  const topicItems = groups(filtered, 'topic').map(([code, count]) => ({ name: code, value: code, count }))
  const sphereItems = groups(filtered, 'sphere').map(([code, count]) => ({ name: code, value: code, count }))
  const publishingItems = groups(filtered, 'publishing').map(([name, count]) => ({ name, value: name, count }))
  const placeItems = groups(filtered, 'place_publication').map(([name, count]) => ({ name, value: name, count }))
  const seriesItems = groups(filtered, 'series').map(([name, count]) => ({ name, value: name, count }))
  const geographicItems = groups(filtered, 'geographic_name').map(([name, count]) => ({ name, value: name, count }))
  return {
    language: langItems,
    country_edition: countryItems,
    publication_type: pubTypeItems,
    topic: topicItems,
    sphere: sphereItems,
    publishing: publishingItems,
    place_publication: placeItems,
    series: seriesItems,
    geographic_name: geographicItems
  }
}

function applyFilters(dto) {
  let data = [...books]
  const items = dto.searchItems || []
  
  // Применяем фильтры с учетом операторов
  for (const it of items) {
    const field = it.field
    const operator = (it.operator || 'AND').toUpperCase()
    const value = (it.value ?? '').toString().toLowerCase()
    

    
    let filteredData = []
    
    if (field === 'all') {
      // Поиск по всем полям (Барлық жолдар)
      filteredData = data.filter(b => 
        (b.author || '').toLowerCase().includes(value) ||
        (b.title || '').toLowerCase().includes(value) ||
        (b.source_title || '').toLowerCase().includes(value) ||
        (b.place_publication || '').toLowerCase().includes(value) ||
        (b.publishing || '').toLowerCase().includes(value) ||
        (b.personnel || '').toLowerCase().includes(value) ||
        (b.geographic_name || '').toLowerCase().includes(value) ||
        (b.series || '').toLowerCase().includes(value) ||
        (b.isbn_issn || '').toLowerCase().includes(value) ||
        (b.note || '').toLowerCase().includes(value) ||
        (b.content || '').toLowerCase().includes(value) ||
        String(b.year || '').includes(value)
      )
    } else if (field === 'title_first_letter') {
      filteredData = data.filter(b => (b.title_first_letter || '').toString().toLowerCase() === value)
    } else if (['country_edition','sphere','language','publication_type','topic'].includes(field)) {
      filteredData = data.filter(b => String(b[field] ?? '').toLowerCase() === value)
    } else if (field === 'author') {
      filteredData = data.filter(b => (b.author || '').toLowerCase().includes(value))
    } else if (field === 'title') {
      filteredData = data.filter(b => (b.title || '').toLowerCase().includes(value))
    } else if (field === 'source_title') {
      filteredData = data.filter(b => (b.source_title || '').toLowerCase().includes(value))
    } else if (field === 'place_publication') {
      filteredData = data.filter(b => (b.place_publication || '').toLowerCase().includes(value))
    } else if (field === 'publishing') {
      filteredData = data.filter(b => (b.publishing || '').toLowerCase().includes(value))
    } else if (field === 'personnel') {
      filteredData = data.filter(b => (b.personnel || '').toLowerCase().includes(value))
    } else if (field === 'geographic_name') {
      filteredData = data.filter(b => (b.geographic_name || '').toLowerCase().includes(value))
    } else if (field === 'series') {
      filteredData = data.filter(b => (b.series || '').toLowerCase().includes(value))
    } else if (field === 'isbn_issn') {
      filteredData = data.filter(b => (b.isbn_issn || '').toLowerCase().includes(value))
    } else if (field === 'keywords') {
      // Поиск по ключевым словам (Кілт сөздер) - поиск в основных полях
      filteredData = data.filter(b => 
        (b.title || '').toLowerCase().includes(value) ||
        (b.source_title || '').toLowerCase().includes(value) ||
        (b.content || '').toLowerCase().includes(value) ||
        (b.note || '').toLowerCase().includes(value)
      )
    } else if (field === 'yearPublic' || field === 'year_publication') {
      // Поиск по году издания
      filteredData = data.filter(b => {
        const bookYear = String(b.year || '')
        const searchValue = String(value || '')
        return bookYear.includes(searchValue)
      })
    } else if (field === 'subject' || field === 'topical_term') {
      // Поиск по тематике - ищем в topic (UDC) и sphere (жанр)
      filteredData = data.filter(b => {
        const topicMatch = String(b.topic || '') === value
        const sphereMatch = String(b.sphere || '') === value
        const contentMatch = (b.content || '').toLowerCase().includes(value.toLowerCase())
        return topicMatch || sphereMatch || contentMatch
      })
    } else if (field === 'note') {
      filteredData = data.filter(b => (b.note || '').toLowerCase().includes(value))
    }
    
    // Применяем оператор
    if (operator === 'AND') {
      data = filteredData
    } else if (operator === 'OR') {
      // Объединяем результаты (убираем дубликаты)
      const existingIds = new Set(data.map(b => b.id))
      const newItems = filteredData.filter(b => !existingIds.has(b.id))
      data = [...data, ...newItems]
    } else if (operator === 'NOT') {
      // Исключаем результаты
      const excludeIds = new Set(filteredData.map(b => b.id))
      data = data.filter(b => !excludeIds.has(b.id))
    }
  }
  
  // Применяем фильтр по годам
  if (dto.fromYear != null && dto.toYear != null) {
    data = data.filter(b => Number(b.year) >= Number(dto.fromYear) && Number(b.year) <= Number(dto.toYear))
  }
  
  // Применяем фильтр по языку для ADVANCED поиска
  if (dto.searchType === 'ADVANCED' && dto.language && dto.language !== '000') {
    data = data.filter(b => b.language === dto.language)
  }
  
  // Применяем фильтр по каталогам (как в Java backend)
  if (dto.catalogIdFilters && dto.catalogIdFilters.length > 0 && !dto.catalogIdFilters.includes(0)) {
    // 0 означает "все каталоги", поэтому исключаем
    data = data.filter(b => dto.catalogIdFilters.includes(b.id % 10)) // Простая логика для демо
  }
  
  return data
}

function applyFulltext(text) {
  const q = (text || '').toString().toLowerCase()
  if (!q) return []
  return books.filter(b => 
    (b.content || '').toLowerCase().includes(q) ||
    (b.title || '').toLowerCase().includes(q) ||
    (b.author || '').toLowerCase().includes(q) ||
    (b.source_title || '').toLowerCase().includes(q) ||
    (b.publishing || '').toLowerCase().includes(q) ||
    (b.personnel || '').toLowerCase().includes(q) ||
    (b.geographic_name || '').toLowerCase().includes(q) ||
    (b.series || '').toLowerCase().includes(q) ||
    (b.isbn_issn || '').toLowerCase().includes(q) ||
    (b.note || '').toLowerCase().includes(q)
  )
}

// GET /view/SearchFieldList?lang=ru
app.get('/view/SearchFieldList', (req, res) => {
  // Complete mapping matching Java backend Field enum
  res.json({
    all: 'Барлық жолдар',
    keywords: 'Кілт сөздер',
    author: 'Автор',
    title: 'Атауы',
    source_title: 'Дерекнама атауы',
    place_publication: 'Басылымның шыққан жері',
    publishing: 'Баспа',
    year_publication: 'Басылымның шыққан жылы',
    country_edition: 'Страна издания',
    personnel: 'Тұлғалар',
    geographic_name: 'Географиялық атауы',
    series: 'Сериясы',
    topical_term: 'Тақырыптық айдары',
    udc: 'ӘОЖ индексі',
    isbn_issn: 'ISBN/ISSN',
    topic: 'Тақырыптама',
    sphere: 'Жанр',
    language: 'Язык',
    publication_type: 'Тип публикации',
    title_first_letter: 'Первая буква названия',
    note: 'Ескерім'
  })
})

// POST /view/Search — main search endpoint
app.post('/view/Search', async (req, res) => {
  try {
    const dto = req.body || {}
    const page = Number(dto.page) || 1
    const limit = Number(dto.limit) || 10
    


    if (PROXY_MODE && REAL_BASE_URL) {
      const data = await proxyJson('/view/Search', dto)
      return res.json(data)
    }

    if ((dto.searchType || '').toUpperCase() === 'FULLTEXT') {
      const all = applyFulltext(dto.fullTextSearchText)
      const total = all.length
      const start = (page - 1) * limit
      const slice = all.slice(start, start + limit)
      const { pageCount, pages } = paginate(total, page, limit)
      return res.json({
        BRList: slice.map(toBRItem),
        PageCount: pageCount,
        resultSize: total,
        BRPages: pages
      })
    }

    // UDC поиск обрабатывается через searchItems с полем 'topic'
    if ((dto.searchType || '').toUpperCase() === 'UDC') {
      // Для UDC поиска создаем специальный searchItem если его нет
      if (!dto.searchItems || dto.searchItems.length === 0) {
        dto.searchItems = [{
          field: 'topic',
          operator: 'AND',
          value: dto.fullTextSearchText || ''
        }]
      }
    }

    const all = applyFilters(dto)
    const total = all.length
    const start = (page - 1) * limit
    const pageItems = all.slice(start, start + limit)
    const { pageCount, pages } = paginate(total, page, limit)

    const titleLetters = Array.from(new Set(all.map(b => (b.title_first_letter || '').toString().toUpperCase()))).filter(Boolean).sort()

    const response = {
      BRList: pageItems.map(toBRItem),
      TitleFirstLetters: titleLetters,
      PageCount: pageCount,
      ResultSize: total,
      BRPages: pages,
      filterInfoList: (dto.searchItems || []).map((it, idx) => ({ index: idx, caption: `${it.field}: ${it.value}` })),
      SearchItems: dto.searchItems || [],
      RefinementItems: buildRefinementItems(all)
    }
    if ((dto.searchType || '').toUpperCase() !== 'UDC') {
      response.CatalogIdFilters = dto.catalogIdFilters || []
    }
    return res.json(response)
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
})

// POST /view/SaveQuery — mock persistence
app.post('/view/SaveQuery', async (req, res) => {
  try {
    const dto = req.body || {}
    if (PROXY_MODE && REAL_BASE_URL) {
      const data = await proxyJson('/view/SaveQuery', dto)
      return res.json(data)
    }
    // Mock returns a random id
    return res.json({ filterId: Math.floor(Math.random() * 10000), searchType: dto.searchType || 'ADVANCED' })
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
})

// GET /view/Suggest?fieldName=author&searchText=ab
app.get('/view/Suggest', async (req, res) => {
  try {
    if (PROXY_MODE && REAL_BASE_URL) {
      const url = `${REAL_BASE_URL}/view/Suggest?fieldName=${encodeURIComponent(req.query.fieldName||'')}&searchText=${encodeURIComponent(req.query.searchText||'')}`
      const r = await fetch(url)
      const data = await r.json()
      return res.json(data)
    }
    const q = (req.query.searchText || '').toString().toLowerCase()
    const field = (req.query.fieldName || '').toString()
    let values = []
    if (field === 'author') {
      values = Array.from(new Set(books.map(b => b.author))).filter(v => v.toLowerCase().startsWith(q))
    } else if (field === 'title') {
      values = Array.from(new Set(books.map(b => b.title))).filter(v => v.toLowerCase().startsWith(q))
    } else if (field) {
      values = Array.from(new Set(books.map(b => String(b[field] || '')))).filter(v => v.toLowerCase().startsWith(q))
    } else {
      values = [q, `${q}a`, `${q}b`].filter(Boolean)
    }
    return res.json(values.slice(0, 10))
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
})

// GET /view/GetUdcSearchTree — simple stub
app.get('/view/GetUdcSearchTree', async (req, res) => {
  try {
    if (PROXY_MODE && REAL_BASE_URL) {
      const r = await fetch(`${REAL_BASE_URL}/view/GetUdcSearchTree`)
      const data = await r.json()
      return res.json(data)
    }
    return res.json({})
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
})

app.listen(PORT, () => {
  console.log(`Node search backend listening on http://localhost:${PORT}`)
  if (PROXY_MODE) {
    console.log(`Proxy mode ON → forwarding to ${REAL_BASE_URL}`)
  }
})
