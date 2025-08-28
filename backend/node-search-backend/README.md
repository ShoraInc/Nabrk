# Node search backend (mock/proxy)

Imitates Java `/view` search endpoints so you can build a frontend locally, and later switch to the real server by enabling proxy mode.

## Install

```bash
cd /Users/erdanatursunov/Desktop/Sources/node-search-backend
npm install
cp .env.example .env
```

## Run (mock mode)

```bash
npm run dev
```
- Server: http://localhost:4000
- Endpoints:
  - `GET /view/SearchFieldList?lang=ru`
  - `POST /view/Search` (body = SearchDTO)
  - `POST /view/SaveQuery`
  - `GET /view/Suggest?fieldName=author&searchText=a`
  - `GET /view/GetUdcSearchTree`

## Proxy to real backend

Set in `.env`:

```
PROXY_MODE=true
REAL_BASE_URL=http://<real-java-host>:<port>
```

Now all calls are forwarded to the Java backend and returned unchanged to your frontend.

## SearchDTO shape (example)

```json
{
  "searchType": "ADVANCED", // or FULLTEXT, UDC
  "page": 1,
  "limit": 10,
  "locale": "ru",
  "searchItems": [
    { "field": "author", "operator": "AND", "value": "Пушкин" },
    { "field": "publishing", "operator": "AND", "value": "Алматы баспасы" },
    { "field": "place_publication", "operator": "AND", "value": "Алматы" }
  ],
  "catalogIdFilters": [3,4,8],
  "fromYear": 2000,
  "toYear": 2020,
  "language": "rus"
}
```

## Available search fields (matching Java backend)

All fields from Java `Field` enum are supported:

- `all` - Барлық жолдар (All fields)
- `keywords` - Кілт сөздер (Keywords) 
- `author` - Автор
- `title` - Атауы (Title)
- `source_title` - Дерекнама атауы (Source title)
- `place_publication` - Басылымның шыққан жері (Place of publication)
- `publishing` - Баспа (Publisher)
- `year_publication` - Басылымның шыққан жылы (Year of publication)
- `country_edition` - Страна издания
- `personnel` - Тұлғалар (Persons)
- `geographic_name` - Географиялық атауы (Geographic name)
- `series` - Сериясы (Series)
- `topical_term` - Тақырыптық айдары (Subject headings)
- `udc` - ӘОЖ индексі (UDC index)
- `isbn_issn` - ISBN/ISSN
- `topic` - Тақырыптама (Subject)
- `sphere` - Жанр (Genre)
- `language` - Язык (Language)
- `publication_type` - Тип публикации
- `title_first_letter` - Первая буква названия
- `note` - Ескерім (Note)

## Returned JSON (simplified)
- FULLTEXT: `{ BRList, PageCount, resultSize, BRPages }`
- Advanced/normal: `{ BRList, TitleFirstLetters, PageCount, ResultSize, BRPages, filterInfoList, CatalogIdFilters, SearchItems, RefinementItems }`

## RefinementItems structure

```json
{
  "language": [{"name": "Русский", "value": "rus", "count": 15}],
  "country_edition": [{"name": "KZ", "value": "KZ", "count": 8}],
  "publication_type": [{"name": "Книга", "value": "1", "count": 20}],
  "topic": [{"name": "3", "value": "3", "count": 12}],
  "sphere": [{"name": "12", "value": "12", "count": 18}],
  "publishing": [{"name": "Алматы баспасы", "value": "Алматы баспасы", "count": 3}],
  "place_publication": [{"name": "Алматы", "value": "Алматы", "count": 5}],
  "series": [{"name": "Классика казахской литературы", "value": "Классика казахской литературы", "count": 4}],
  "geographic_name": [{"name": "Казахстан", "value": "Казахстан", "count": 8}]
}
```

## Fulltext search

FULLTEXT mode searches across all text fields:
- content, title, author, source_title, publishing, personnel, geographic_name, series, isbn_issn, note

## Test data

24 books with diverse data covering all search fields and filter combinations.

