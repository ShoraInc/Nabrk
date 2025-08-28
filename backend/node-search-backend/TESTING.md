# Тестирование Node.js Backend

## Запуск сервера

```bash
cd node-search-backend
node src/server.js
```

Сервер запустится на http://localhost:4000

## Тестирование всех возможностей

### 1. Получение списка полей поиска

```bash
curl -X GET "http://localhost:4000/view/SearchFieldList?lang=ru" | jq
```

**Ожидаемый ответ:**
```json
{
  "all": "Барлық жолдар",
  "keywords": "Кілт сөздер", 
  "author": "Автор",
  "title": "Атауы",
  "source_title": "Дерекнама атауы",
  "place_publication": "Басылымның шыққан жері",
  "publishing": "Баспа",
  "year_publication": "Басылымның шыққан жылы",
  "country_edition": "Страна издания",
  "personnel": "Тұлғалар",
  "geographic_name": "Географиялық атауы",
  "series": "Сериясы",
  "topical_term": "Тақырыптық айдары",
  "udc": "ӘОЖ индексі",
  "isbn_issn": "ISBN/ISSN",
  "topic": "Тақырыптама",
  "sphere": "Жанр",
  "language": "Язык",
  "publication_type": "Тип публикации",
  "title_first_letter": "Первая буква названия",
  "note": "Ескерім"
}
```

### 2. Полнотекстовый поиск (FULLTEXT)

```bash
curl -X POST "http://localhost:4000/view/Search" \
  -H "Content-Type: application/json" \
  -d '{
    "searchType": "FULLTEXT",
    "fullTextSearchText": "Пушкин",
    "page": 1,
    "limit": 10
  }' | jq
```

**Ожидаемый ответ:**
```json
{
  "BRList": [
    {
      "id": 1002,
      "authors": "Александр Пушкин",
      "title": "Капитанская дочка",
      "name": "Александр Пушкин — Капитанская дочка",
      "udc": "3",
      "yearPublic": "1836",
      "shelfCode": "",
      "publicationCode": 1,
      "publicationCodeName": "Книга",
      "language": "rus",
      "source_title": "Историческая повесть",
      "place_publication": "Санкт-Петербург",
      "publishing": "Типография Глазунова",
      "personnel": "Александр Пушкин",
      "geographic_name": "Россия",
      "series": "Библиотека русской классики",
      "isbn_issn": "978-5-17-123456-7",
      "note": "Прижизненное издание",
      "country_edition": "RU",
      "sphere": "12"
    }
  ],
  "PageCount": 1,
  "resultSize": 1,
  "BRPages": [1]
}
```

### 3. Расширенный поиск с операторами (ADVANCED)

#### Поиск с AND оператором:
```bash
curl -X POST "http://localhost:4000/view/Search" \
  -H "Content-Type: application/json" \
  -d '{
    "searchType": "ADVANCED",
    "page": 1,
    "limit": 10,
    "locale": "ru",
    "searchItems": [
      {"field": "author", "operator": "AND", "value": "Пушкин"},
      {"field": "language", "operator": "AND", "value": "rus"}
    ]
  }' | jq
```

#### Поиск с OR оператором:
```bash
curl -X POST "http://localhost:4000/view/Search" \
  -H "Content-Type: application/json" \
  -d '{
    "searchType": "ADVANCED",
    "page": 1,
    "limit": 10,
    "locale": "ru",
    "searchItems": [
      {"field": "author", "operator": "OR", "value": "Пушкин"},
      {"field": "author", "operator": "OR", "value": "Толстой"}
    ]
  }' | jq
```

#### Поиск с NOT оператором:
```bash
curl -X POST "http://localhost:4000/view/Search" \
  -H "Content-Type: application/json" \
  -d '{
    "searchType": "ADVANCED",
    "page": 1,
    "limit": 10,
    "locale": "ru",
    "searchItems": [
      {"field": "language", "operator": "AND", "value": "rus"},
      {"field": "author", "operator": "NOT", "value": "Пушкин"}
    ]
  }' | jq
```

### 4. Поиск по всем новым полям

#### Поиск по издательству:
```bash
curl -X POST "http://localhost:4000/view/Search" \
  -H "Content-Type: application/json" \
  -d '{
    "searchType": "ADVANCED",
    "page": 1,
    "limit": 10,
    "locale": "ru",
    "searchItems": [
      {"field": "publishing", "operator": "AND", "value": "Алматы баспасы"}
    ]
  }' | jq
```

#### Поиск по месту издания:
```bash
curl -X POST "http://localhost:4000/view/Search" \
  -H "Content-Type: application/json" \
  -d '{
    "searchType": "ADVANCED",
    "page": 1,
    "limit": 10,
    "locale": "ru",
    "searchItems": [
      {"field": "place_publication", "operator": "AND", "value": "Алматы"}
    ]
  }' | jq
```

#### Поиск по серии:
```bash
curl -X POST "http://localhost:4000/view/Search" \
  -H "Content-Type: application/json" \
  -d '{
    "searchType": "ADVANCED",
    "page": 1,
    "limit": 10,
    "locale": "ru",
    "searchItems": [
      {"field": "series", "operator": "AND", "value": "Классика казахской литературы"}
    ]
  }' | jq
```

### 5. Фильтрация по годам

```bash
curl -X POST "http://localhost:4000/view/Search" \
  -H "Content-Type: application/json" \
  -d '{
    "searchType": "ADVANCED",
    "page": 1,
    "limit": 10,
    "locale": "ru",
    "fromYear": 1900,
    "toYear": 2000,
    "searchItems": [
      {"field": "language", "operator": "AND", "value": "rus"}
    ]
  }' | jq
```

### 6. Фильтрация по языку в ADVANCED поиске

```bash
curl -X POST "http://localhost:4000/view/Search" \
  -H "Content-Type: application/json" \
  -d '{
    "searchType": "ADVANCED",
    "page": 1,
    "limit": 10,
    "locale": "ru",
    "language": "kaz",
    "searchItems": [
      {"field": "author", "operator": "AND", "value": "Абай"}
    ]
  }' | jq
```

### 7. Подсказки (Suggestions)

```bash
curl -X GET "http://localhost:4000/view/Suggest?fieldName=author&searchText=пуш" | jq
```

**Ожидаемый ответ:**
```json
["Александр Пушкин"]
```

### 8. Сохранение запроса

```bash
curl -X POST "http://localhost:4000/view/SaveQuery" \
  -H "Content-Type: application/json" \
  -d '{
    "searchType": "ADVANCED",
    "searchItems": [
      {"field": "author", "operator": "AND", "value": "Пушкин"}
    ]
  }' | jq
```

**Ожидаемый ответ:**
```json
{
  "filterId": 1234,
  "searchType": "ADVANCED"
}
```

### 9. UDC поиск

```bash
curl -X POST "http://localhost:4000/view/Search" \
  -H "Content-Type: application/json" \
  -d '{
    "searchType": "UDC",
    "page": 1,
    "limit": 10,
    "locale": "ru",
    "searchItems": [
      {"field": "topic", "operator": "AND", "value": "3"}
    ]
  }' | jq
```

### 10. Получение дерева UDC

```bash
curl -X GET "http://localhost:4000/view/GetUdcSearchTree" | jq
```

## Структура ответа для ADVANCED поиска

```json
{
  "BRList": [...],
  "TitleFirstLetters": ["А", "В", "К", "П", "С"],
  "PageCount": 1,
  "ResultSize": 5,
  "BRPages": [1],
  "filterInfoList": [
    {"index": 0, "caption": "author: Пушкин"},
    {"index": 1, "caption": "language: rus"}
  ],
  "SearchItems": [
    {"field": "author", "operator": "AND", "value": "Пушкин"},
    {"field": "language", "operator": "AND", "value": "rus"}
  ],
  "RefinementItems": {
    "language": [
      {"name": "Русский", "value": "rus", "count": 15}
    ],
    "country_edition": [
      {"name": "RU", "value": "RU", "count": 8}
    ],
    "publication_type": [
      {"name": "Книга", "value": "1", "count": 20}
    ],
    "topic": [
      {"name": "3", "value": "3", "count": 12}
    ],
    "sphere": [
      {"name": "12", "value": "12", "count": 18}
    ],
    "publishing": [
      {"name": "Алматы баспасы", "value": "Алматы баспасы", "count": 3}
    ],
    "place_publication": [
      {"name": "Алматы", "value": "Алматы", "count": 5}
    ],
    "series": [
      {"name": "Классика казахской литературы", "value": "Классика казахской литературы", "count": 4}
    ],
    "geographic_name": [
      {"name": "Казахстан", "value": "Казахстан", "count": 8}
    ]
  },
  "CatalogIdFilters": [3, 4, 8]
}
```

## Все доступные поля для поиска

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

## Операторы

- `AND` - И (по умолчанию)
- `OR` - ИЛИ
- `NOT` - НЕ

## Типы поиска

- `FULLTEXT` - Полнотекстовый поиск
- `ADVANCED` - Расширенный поиск
- `UDC` - Поиск по УДК
