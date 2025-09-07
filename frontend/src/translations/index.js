// translations/index.js
export const translations = {
  en: {
    // Header
    header: {
      home: "Home",
      bookSearch: "Book Search",
      aboutUs: "About Us",
      contacts: "Contacts",
      library: "Library",
      readers: "For Readers",
      resources: "Resources",
      login: "Login"
    },
    
    // News section
    news: {
      title: "Latest News",
      readAll: "READ ALL",
      readMore: "READ MORE",
      goToLink: "GO TO LINK",
      noNews: "No news",
      noNewsDescription: "No published news found yet",
      error: "Error occurred",
      errorDescription: "Failed to load news",
      retry: "Retry",
      detail: {
        notFound: "News not found",
        notFoundDescription: "The requested news does not exist or a system error occurred.",
        goBack: "Go back",
        views: "views"
      }
    },
    
    // Events section
    events: {
      title: "Upcoming Events",
      viewAll: "VIEW ALL",
      noEvents: "No events",
      noEventsDescription: "No upcoming events found",
      location: "Location",
      time: "Time",
      date: "Date",
      retry: "Retry"
    },
    
    // Hero section
    hero: {
      title: "National Academic Library of the Republic of Kazakhstan",
      subtitle: "Your gateway to knowledge and information",
      searchPlaceholder: "Search for books, articles, resources...",
      searchButton: "Search",
      button1: "BUTTON 1",
      button2: "BUTTON 2"
    },
    
    // Services section
    services: {
      title: "Library Services",
      bookCatalog: {
        title: "Book Catalog",
        description: "Search and browse our extensive collection of books"
      },
      digitalResources: {
        title: "Digital Resources",
        description: "Access electronic books, journals and databases"
      },
      news: {
        title: "News & Updates",
        description: "Stay informed about library news and announcements"
      },
      support: {
        title: "Help & Support",
        description: "Get assistance with library services and resources"
      }
    },
    
    // FAQ section
    faq: {
      title: "Frequently Asked Questions",
      noQuestions: "No questions available",
      questions: [
        {
          question: "How to register at the library?",
          answer: "To register at the library, come with your ID and fill out a form at the registration desk. The process takes 5-10 minutes."
        },
        {
          question: "How long can books be borrowed?",
          answer: "Fiction books can be borrowed for 15 days, academic literature for 30 days. Extension is possible if needed."
        },
        {
          question: "Are electronic books available?",
          answer: "Yes, our electronic library database contains more than 10,000 books. Registered readers can access them with login/password."
        },
        {
          question: "Is there Wi-Fi in the library?",
          answer: "Yes, free Wi-Fi is available in all reading rooms. Password can be obtained from the registration desk."
        },
        {
          question: "Can I book a room for group classes?",
          answer: "Of course! Conference rooms and group work rooms can be booked in advance. Contact us at +7 (XXX) XXX-XX-XX."
        }
      ]
    },
    
    // Books section
    books: {
      title: "Latest Publications",
      viewAll: "VIEW ALL",
      noBooks: "No books available",
      author: "Author",
      year: "Year",
      pages: "pages"
    },
    
    // Search section
    search: {
      title: "Search Library Catalog",
      placeholder: "Enter keywords, title, author...",
      searchButton: "Search",
      advancedSearch: "Advanced Search",
      results: "Results",
      noResults: "No results found",
      categories: {
        catalog: "E-catalog",
        books: "Books",
        authors: "Authors",
        topics: "Topics"
      }
    },
    
    // Footer section
    footer: {
      navigation: "Navigation",
      pressSecretary: "Press Secretary",
      contact: "Contact",
      pressSecretaryName: "Laura Telmankyzy Palman",
      address: "010000, Kazakhstan, Astana, Dostyk street, 11"
    },

    // Auth pages
    auth: {
      login: {
        title: "Sign In",
        readerNumber: "Reader Number",
        password: "Password",
        showPassword: "Show password",
        hidePassword: "Hide password",
        forgotPassword: "Forgot your password?",
        submit: "Continue",
        loading: "Continuing...",
        noAccount: "Don't have an account?",
        register: "Register",
        success: "Successfully signed in!",
        error: "Login error",
        fillRequired: "Please fill in reader number and password",
        welcome: "Welcome",
        description: "Please verify that your email is correctly filled in your personal account after authorization.",
        serviceDescription: "To use services from NAK of the Republic of Kazakhstan",
        readerNumberPlaceholder: "Enter your reader number",
        passwordPlaceholder: "Enter your password"
      },
      register: {
        title: "Registration",
        personalInfo: "Personal Information",
        firstName: "First Name",
        lastName: "Last Name",
        middleName: "Middle Name",
        birthDate: "Date of Birth",
        gender: "Gender",
        male: "Male",
        female: "Female",
        contactInfo: "Contact Information",
        email: "Email",
        phone: "Phone Number",
        address: "Address",
        city: "City",
        region: "Region",
        postalCode: "Postal Code",
        accountInfo: "Account Information",
        readerNumber: "Reader Number",
        password: "Password",
        confirmPassword: "Confirm Password",
        submit: "Register",
        loading: "Registering...",
        hasAccount: "Already have an account?",
        login: "Sign In",
        success: "Successfully registered!",
        error: "Registration error",
        passwordMismatch: "Passwords do not match",
        fillRequired: "Please fill in all required fields",
        step: "step",
        basicData: "Basic Information",
        educationData: "Education Information",
        backButton: "Back",
        hasAccount: "Already have an account?",
        signIn: "Sign In",
        // Form fields
        lastName: "Last Name",
        firstName: "First Name",
        fatherName: "Father's Name",
        gender: "Gender",
        male: "Male",
        female: "Female",
        preferNotToSay: "Prefer not to say",
        birthDate: "Date of Birth",
        dayPlaceholder: "Day",
        monthPlaceholder: "Month",
        yearPlaceholder: "Year (1990)",
        nationality: "Nationality",
        kazakh: "Kazakh",
        address: "Address",
        // Education fields
        knowledge: "Field of Knowledge",
        location: "Location",
        notSelected: "Not Selected",
        workplace: "Workplace",
        degree: "Degree",
        studyPlace: "Place of Study",
        email: "Email",
        // Buttons
        nextStep: "Next Step",
        register: "Register",
        // Months
        months: {
          placeholder: "Month",
          january: "January",
          february: "February", 
          march: "March",
          april: "April",
          may: "May",
          june: "June",
          july: "July",
          august: "August",
          september: "September",
          october: "October",
          november: "November",
          december: "December"
        }
      },
      forgotPassword: {
        title: "Password Recovery",
        description: "A new password will be sent to your email",
        email: "Email",
        emailAddress: "Email Address",
        readerCard: "Reader Card",
        readerCardNumber: "Reader Card Number",
        emailMethod: "Email",
        studentMethod: "Reader Card",
        emailPlaceholder: "yourmail@mail.com",
        readerPlaceholder: "Enter your reader number",
        submit: "Send Reset Link",
        loading: "Sending link...",
        backToLogin: "← Back to Sign In",
        success: "Reset link sent to your email!",
        error: "Password recovery error",
        fillRequired: "Please enter your email address"
      }
    },

    // Director Blog
    directorBlog: {
      title: "Dear readers,",
      paragraphs: [
        "It is important for me to hear your voice — your thoughts, ideas, suggestions, and questions. Every message is valuable to me, as it is your support that inspires us to grow and improve.",
        "You now have the opportunity to contact me directly and share anything that concerns you as a reader. I will personally read all your messages and do my best to respond.",
        "I believe that open and trustful dialogue will make our library even closer to each of you.",
        "With respect,",
        "Kumis Karsakbaevna Seitova",
        "Director of the National Academic Library of the Republic of Kazakhstan"
      ],
      name: "Kumis Karsakbaevna Seitova",
      position: "Director of the National Academic Library of the Republic of Kazakhstan",
      contactTitle: "Contact Me",
      namePlaceholder: "Your Name",
      emailPlaceholder: "Your Email",
      messagePlaceholder: "Your Message",
      submitBtn: "Send",
      successMessage: "Message sent successfully!",
      errorMessage: "Error sending message"
    },

    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      retry: "Retry",
      close: "Close",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      back: "Back",
      next: "Next",
      previous: "Previous"
    }
  },
  
  ru: {
    // Header
    header: {
      home: "Главная",
      bookSearch: "Поиск книг",
      aboutUs: "О нас",
      contacts: "Контакты",
      library: "Библиотека",
      readers: "Читателям",
      resources: "Ресурсы",
      login: "Войти"
    },
    
    // News section
    news: {
      title: "Последние новости",
      readAll: "ЧИТАТЬ ВСЕ",
      readMore: "ЧИТАТЬ ПОДРОБНЕЕ",
      goToLink: "ПЕРЕЙТИ ПО ССЫЛКЕ",
      noNews: "Новостей нет",
      noNewsDescription: "Пока не найдено опубликованных новостей",
      error: "Произошла ошибка",
      errorDescription: "Не удалось загрузить новости",
      retry: "Повторить",
      detail: {
        notFound: "Новость не найдена",
        notFoundDescription: "Запрашиваемая новость не существует или произошла системная ошибка.",
        goBack: "Вернуться назад",
        views: "просмотров"
      }
    },
    
    // Events section
    events: {
      title: "Предстоящие события",
      viewAll: "СМОТРЕТЬ ВСЕ",
      noEvents: "Событий нет",
      noEventsDescription: "Предстоящих событий не найдено",
      location: "Место",
      time: "Время",
      date: "Дата",
      retry: "Повторить"
    },
    
    // Hero section
    hero: {
      title: "Национальная академическая библиотека Республики Казахстан",
      subtitle: "Ваш путь к знаниям и информации",
      searchPlaceholder: "Поиск книг, статей, ресурсов...",
      searchButton: "Поиск",
      button1: "КНОПКА 1",
      button2: "КНОПКА 2"
    },
    
    // Services section
    services: {
      title: "Услуги библиотеки",
      bookCatalog: {
        title: "Каталог книг",
        description: "Поиск и просмотр нашей обширной коллекции книг"
      },
      digitalResources: {
        title: "Цифровые ресурсы",
        description: "Доступ к электронным книгам, журналам и базам данных"
      },
      news: {
        title: "Новости и обновления",
        description: "Будьте в курсе новостей и объявлений библиотеки"
      },
      support: {
        title: "Помощь и поддержка",
        description: "Получите помощь по услугам и ресурсам библиотеки"
      }
    },
    
    // FAQ section
    faq: {
      title: "Часто задаваемые вопросы",
      noQuestions: "Вопросы недоступны",
      questions: [
        {
          question: "Как зарегистрироваться в библиотеке?",
          answer: "Для регистрации в библиотеке приходите с удостоверением личности и заполните анкету в регистрационном отделе. Процесс занимает 5-10 минут."
        },
        {
          question: "На сколько можно брать книги?",
          answer: "Художественную литературу можно брать на 15 дней, учебную литературу на 30 дней. При необходимости возможно продление срока."
        },
        {
          question: "Доступны ли электронные книги?",
          answer: "Да, в нашей базе электронной библиотеки более 10 000 книг. Зарегистрированные читатели могут получить доступ через логин/пароль."
        },
        {
          question: "Есть ли Wi-Fi в библиотеке?",
          answer: "Да, бесплатный Wi-Fi доступен во всех читальных залах. Пароль можно получить в регистрационном отделе."
        },
        {
          question: "Можно ли забронировать зал для групповых занятий?",
          answer: "Конечно! Конференц-залы и комнаты для групповой работы можно забронировать заранее. Обращайтесь по телефону +7 (XXX) XXX-XX-XX."
        }
      ]
    },
    
    // Books section
    books: {
      title: "Последние публикации",
      viewAll: "СМОТРЕТЬ ВСЕ",
      noBooks: "Книги недоступны",
      author: "Автор",
      year: "Год",
      pages: "страниц"
    },
    
    // Search section
    search: {
      title: "Поиск по каталогу библиотеки",
      placeholder: "Введите ключевые слова, название, автора...",
      searchButton: "Поиск",
      advancedSearch: "Расширенный поиск",
      results: "Результаты",
      noResults: "Результаты не найдены",
      categories: {
        catalog: "Э-каталог",
        books: "Книги",
        authors: "Авторы",
        topics: "Темы"
      }
    },
    
    // Footer section
    footer: {
      navigation: "Навигация",
      pressSecretary: "Пресс-секретарь",
      contact: "Контакты",
      pressSecretaryName: "Лаура Телманкызы Палман",
      address: "010000, Казахстан, Астана, ул. Достык, 11"
    },

    // Auth pages
    auth: {
      login: {
        title: "Вход",
        readerNumber: "Номер читателя",
        password: "Пароль",
        showPassword: "Показать пароль",
        hidePassword: "Скрыть пароль",
        forgotPassword: "Забыли пароль?",
        submit: "Продолжить",
        loading: "Вход...",
        noAccount: "Нет аккаунта?",
        register: "Регистрация",
        success: "Успешный вход!",
        error: "Ошибка входа",
        fillRequired: "Заполните номер читателя и пароль",
        welcome: "Добро пожаловать",
        description: "Пожалуйста, проверьте правильность заполнения вашей электронной почты в личном кабинете после авторизации.",
        serviceDescription: "Для использования услуг НАК РК",
        readerNumberPlaceholder: "Введите номер читателя",
        passwordPlaceholder: "Введите пароль"
      },
      register: {
        title: "Регистрация",
        personalInfo: "Личная информация",
        firstName: "Имя",
        lastName: "Фамилия",
        middleName: "Отчество",
        birthDate: "Дата рождения",
        gender: "Пол",
        male: "Мужской",
        female: "Женский",
        contactInfo: "Контактная информация",
        email: "Электронная почта",
        phone: "Номер телефона",
        address: "Адрес",
        city: "Город",
        region: "Регион",
        postalCode: "Почтовый индекс",
        accountInfo: "Информация об аккаунте",
        readerNumber: "Номер читателя",
        password: "Пароль",
        confirmPassword: "Подтвердить пароль",
        submit: "Зарегистрироваться",
        loading: "Регистрация...",
        hasAccount: "Уже есть аккаунт?",
        login: "Войти",
        success: "Успешная регистрация!",
        error: "Ошибка регистрации",
        passwordMismatch: "Пароли не совпадают",
        fillRequired: "Заполните все обязательные поля",
        step: "шаг",
        basicData: "Основные данные",
        educationData: "Данные об образовании",
        backButton: "Назад",
        hasAccount: "Уже есть аккаунт?",
        signIn: "Войти",
        // Form fields
        lastName: "Фамилия",
        firstName: "Имя",
        fatherName: "Отчество",
        gender: "Пол",
        male: "Мужской",
        female: "Женский",
        preferNotToSay: "Предпочитаю не указывать",
        birthDate: "Дата рождения",
        dayPlaceholder: "День",
        monthPlaceholder: "Месяц",
        yearPlaceholder: "Год (1990)",
        nationality: "Национальность",
        kazakh: "Казах",
        address: "Адрес",
        // Education fields
        knowledge: "Область знаний",
        location: "Местоположение",
        notSelected: "Не выбрано",
        workplace: "Место работы",
        degree: "Степень",
        studyPlace: "Место учебы",
        email: "Электронная почта",
        // Buttons
        nextStep: "Следующий шаг",
        register: "Зарегистрироваться",
        // Months
        months: {
          placeholder: "Месяц",
          january: "Январь",
          february: "Февраль", 
          march: "Март",
          april: "Апрель",
          may: "Май",
          june: "Июнь",
          july: "Июль",
          august: "Август",
          september: "Сентябрь",
          october: "Октябрь",
          november: "Ноябрь",
          december: "Декабрь"
        }
      },
      forgotPassword: {
        title: "Восстановление пароля",
        description: "Новый пароль будет отправлен на вашу электронную почту",
        email: "Электронная почта",
        emailAddress: "Адрес электронной почты",
        readerCard: "Читательский билет",
        readerCardNumber: "Номер читательского билета",
        emailMethod: "Электронная почта",
        studentMethod: "Читательский билет",
        emailPlaceholder: "yourmail@mail.com",
        readerPlaceholder: "Введите номер читателя",
        submit: "Отправить ссылку",
        loading: "Отправка ссылки...",
        backToLogin: "← Вернуться ко входу",
        success: "Ссылка отправлена на вашу почту!",
        error: "Ошибка восстановления пароля",
        fillRequired: "Введите адрес электронной почты"
      }
    },

    // Director Blog
    directorBlog: {
      title: "Дорогие читатели!",
      paragraphs: [
        "Мне важно слышать ваш голос — ваши мысли, идеи, предложения и вопросы. Каждое обращение для меня ценно, ведь именно вы вдохновляете нас развиваться и становиться лучше.",
        "Теперь у вас есть возможность напрямую делиться со мной тем, что волнует вас как читателя. Я буду лично читать все ваши сообщения и стараться отвечать на них.",
        "Верю, что открытый и доверительный диалог сделает нашу библиотеку ещё ближе к каждому из вас.",
        "С уважением,",
        "Сеитова Күмис Карсакбаевна",
        "Директор Национальной академической библиотеки Республики Казахстан"
      ],
      name: "Сеитова Күмис Карсакбаевна",
      position: "Директор Национальной академической библиотеки Республики Казахстан",
      contactTitle: "Связаться со мной",
      namePlaceholder: "Ваше имя",
      emailPlaceholder: "Ваша почта",
      messagePlaceholder: "Ваше сообщение",
      submitBtn: "Отправить",
      successMessage: "Сообщение успешно отправлено!",
      errorMessage: "Ошибка при отправке сообщения"
    },

    // Common
    common: {
      loading: "Загрузка...",
      error: "Ошибка",
      retry: "Повторить",
      close: "Закрыть",
      cancel: "Отмена",
      save: "Сохранить",
      edit: "Редактировать",
      delete: "Удалить",
      view: "Просмотр",
      back: "Назад",
      next: "Далее",
      previous: "Предыдущий"
    }
  },
  
  kz: {
    // Header
    header: {
      home: "Басты бет",
      bookSearch: "Кітап іздеу",
      aboutUs: "Біз туралы",
      contacts: "Байланыс",
      library: "Кітапхана",
      readers: "Оқырмандарға",
      resources: "Ресурстар",
      login: "Кіру"
    },
    
    // News section
    news: {
      title: "Соңғы жаңалықтар",
      readAll: "БАРЛЫҒЫН ОҚУ",
      readMore: "ТОЛЫҚТАЙ ОҚУ",
      goToLink: "СІЛТЕМЕГЕ ӨТУ",
      noNews: "Жаңалықтар жоқ",
      noNewsDescription: "Әзірге жарияланған жаңалықтар табылмады",
      error: "Қате орын алды",
      errorDescription: "Жаңалықтарды жүктеу мүмкін болмады",
      retry: "Қайта жүктеу",
      detail: {
        notFound: "Жаңалық табылмады",
        notFoundDescription: "Сұралған жаңалық жоқ немесе жүйеде қате орын алды.",
        goBack: "Артқа қайту",
        views: "көрілген"
      }
    },
    
    // Events section
    events: {
      title: "Болашақ іс-шаралар",
      viewAll: "БАРЛЫҒЫН КӨРУ",
      noEvents: "Іс-шаралар жоқ",
      noEventsDescription: "Болашақ іс-шаралар табылмады",
      location: "Орын",
      time: "Уақыт",
      date: "Күн",
      retry: "Қайталау"
    },
    
    // Hero section
    hero: {
      title: "Қазақстан Республикасының Ұлттық академиялық кітапханасы",
      subtitle: "Білім мен ақпаратқа апаратын жолыңыз",
      searchPlaceholder: "Кітаптар, мақалалар, ресурстарды іздеу...",
      searchButton: "Іздеу",
      button1: "БАТЫРМА 1",
      button2: "БАТЫРМА 2"
    },
    
    // Services section
    services: {
      title: "Кітапхана қызметтері",
      bookCatalog: {
        title: "Электронды каталог",
        description: "Біздің кең кітап жинағын іздеу және қарау"
      },
      digitalResources: {
        title: "Электронды кітапхана",
        description: "Электронды кітаптар, журналдар және дерекқорларға қол жеткізу"
      },
      news: {
        title: "Басшының жеке блогы",
        description: "Кітапхана жаңалықтары мен хабарландыруларынан хабардар болыңыз"
      },
      support: {
        title: "Кітапханашыға сұрақ",
        description: "Кітапхана қызметтері мен ресурстары бойынша көмек алыңыз",
      }
    },
    
    // FAQ section
    faq: {
      title: "Жиі қойылатын сұрақтар",
      noQuestions: "Сұрақтар қолжетімді емес",
      questions: [
        {
          question: "Кітапханаға қалай тіркелуге болады?",
          answer: "Кітапханаға тіркелу үшін жеке куәлігіңізбен келіп, тіркеу бөлімінде анкета толтырасыз. Процесс 5-10 минут алады."
        },
        {
          question: "Кітаптарды қанша уақытқа алуға болады?",
          answer: "Әдеби кітаптарды 15 күнге, оқу әдебиеттерін 30 күнге алуға болады. Қажет болса, мерзімді ұзартуға мүмкіндік бар."
        },
        {
          question: "Электронды кітаптар қолжетімді ме?",
          answer: "Иә, біздің электронды кітапхана базасында 10 000-нан астам кітап бар. Тіркелген оқырмандар логин/пароль арқылы кіре алады."
        },
        {
          question: "Кітапханада Wi-Fi бар ма?",
          answer: "Иә, барлық оқу залдарында тегін Wi-Fi қолжетімді. Пароль тіркеу бөлімінен алуға болады."
        },
        {
          question: "Топтық сабақтарға зал брондауға бола ма?",
          answer: "Әрине! Конференц-зал мен топтық жұмыс бөлмелерін алдын ала брондауға болады. +7 (XXX) XXX-XX-XX телефоны арқылы хабарласыңыз."
        }
      ]
    },
    
    // Books section
    books: {
      title: "Соңғы басылымдар",
      viewAll: "БАРЛЫҒЫН КӨРУ",
      noBooks: "Кітаптар қолжетімді емес",
      author: "Автор",
      year: "Жыл",
      pages: "бет"
    },
    
    // Search section
    search: {
      title: "Кітапхана каталогынан іздеу",
      placeholder: "Кілт сөздерді, атауды, авторды енгізіңіз...",
      searchButton: "Іздеу",
      advancedSearch: "Кеңейтілген іздеу",
      results: "Нәтижелер",
      noResults: "Нәтижелер табылмады",
      categories: {
        catalog: "Э-каталог",
        books: "Кітаптар",
        authors: "Авторлар",
        topics: "Тақырыптар"
      }
    },
    
    // Footer section
    footer: {
      navigation: "Навигация",
      pressSecretary: "Баспасөз хатшысы",
      contact: "Байланыс",
      pressSecretaryName: "Лаура Телманқызы Палман",
      address: "010000, Қазақстан, Астана қ., Достық көшесі, 11-үй"
    },

    // Auth pages
    auth: {
      login: {
        title: "Кіру",
        readerNumber: "Оқырман нөмірі",
        password: "Құпия сөз",
        showPassword: "Құпия сөзді көрсету",
        hidePassword: "Құпия сөзді жасыру",
        forgotPassword: "Құпия сөзді ұмытып қалдыныз ба?",
        submit: "Жалғастыру",
        loading: "Жалғастыру...",
        noAccount: "Аккаунтыңыз жоқ па?",
        register: "Тіркелу",
        success: "Сәтті кірдіңіз!",
        error: "Кіру қатесі",
        fillRequired: "Оқырман нөмірі мен құпия сөзді толтырыңыз",
        welcome: "Қош келдіңіз",
        description: "Авторизацияңдан кейін жеке кабинетіңізде электрондық поштаңыздың дұрыс толтырылғанын тексеріңіз.",
        serviceDescription: "ҚР ҰАК-нен қызметтерін пайдалану үшін",
        readerNumberPlaceholder: "Оқырман нөміріңізді жазыңыз",
        passwordPlaceholder: "Құпия сөзіңізді жазыңыз"
      },
      register: {
        title: "Тіркелу",
        personalInfo: "Жеке ақпарат",
        firstName: "Аты",
        lastName: "Тегі",
        middleName: "Әкесінің аты",
        birthDate: "Туған күні",
        gender: "Жынысы",
        male: "Ер",
        female: "Әйел",
        contactInfo: "Байланыс ақпараты",
        email: "Электронды пошта",
        phone: "Телефон нөмірі",
        address: "Мекенжай",
        city: "Қала",
        region: "Облыс",
        postalCode: "Пошта индексі",
        accountInfo: "Аккаунт ақпараты",
        readerNumber: "Оқырман нөмірі",
        password: "Құпия сөз",
        confirmPassword: "Құпия сөзді растау",
        submit: "Тіркелу",
        loading: "Тіркелуде...",
        hasAccount: "Аккаунтыңыз бар ма?",
        login: "Кіру",
        success: "Сәтті тіркелдіңіз!",
        error: "Тіркелу қатесі",
        passwordMismatch: "Құпия сөздер сәйкес келмейді",
        fillRequired: "Барлық міндетті өрістерді толтырыңыз",
        step: "қадам",
        basicData: "Негізгі деректер",
        educationData: "Білімі туралы деректер",
        backButton: "Артқа",
        hasAccount: "Аккаунтыңыз бар ма?",
        signIn: "Кіру",
        // Form fields
        lastName: "Тегі",
        firstName: "Аты",
        fatherName: "Әкесінің аты",
        gender: "Жынысы",
        male: "Ер",
        female: "Әйел",
        preferNotToSay: "Айтпағанды жөн көру",
        birthDate: "Туған жылы",
        dayPlaceholder: "Күні",
        monthPlaceholder: "Айы",
        yearPlaceholder: "Жылы (1990)",
        nationality: "Ұлты",
        kazakh: "Қазақ",
        address: "Мекенжайы",
        // Education fields
        knowledge: "Білім саласы",
        location: "Орналасу",
        notSelected: "Таңдалмаған",
        workplace: "Жұмыс орны",
        degree: "Дәрежесі",
        studyPlace: "Оқу орны",
        email: "Электрондық пошта",
        // Buttons
        nextStep: "Келесі қадам",
        register: "Тіркелу",
        // Months
        months: {
          placeholder: "Айы",
          january: "Қаңтар",
          february: "Ақпан", 
          march: "Наурыз",
          april: "Сәуір",
          may: "Мамыр",
          june: "Маусым",
          july: "Шілде",
          august: "Тамыз",
          september: "Қыркүйек",
          october: "Қазан",
          november: "Қараша",
          december: "Желтоқсан"
        }
      },
      forgotPassword: {
        title: "Құпия сөзді қалпына келтіру",
        description: "Жаңа құпия сөз сіздің электронды поштаға жөберіледі",
        email: "Электронды пошта",
        emailAddress: "Электрондық пошта мекенжайы",
        readerCard: "Оқырман билеті",
        readerCardNumber: "Оқырман билетінің нөмірі",
        emailMethod: "Электронды пошта",
        studentMethod: "Оқырман билеті",
        emailPlaceholder: "yourmail@mail.com",
        readerPlaceholder: "Оқырман нөміріңізді енгізіңіз",
        submit: "Сілтемені жіберу",
        loading: "Сілтеме жіберу...",
        backToLogin: "← Кіруге оралу",
        success: "Сілтеме электронды поштаңызға жіберілді!",
        error: "Құпия сөзді қалпына келтіру қатесі",
        fillRequired: "Электронды поштаны толтырыңыз"
      }
    },

    // Director Blog
    directorBlog: {
      title: "Құрметті оқырмандар!",
      paragraphs: [
        "Сіздердің ойларыңызды, идеяларыңызды, ұсыныстарыңызды және сұрақтарыңызды есту – мен үшін өте маңызды. Әрбір жолданған пікір мен үшін құнды, себебі дәл сіздердің қолдауларыңыз бізді дамуға, жақсара түсуге шабыттандырады.",
        "Енді менімен тікелей байланысып, сізді толғандыратын мәселелермен бөлісуге мүмкіндік бар. Жазған барлық хабарламаларыңызды өзім оқып, қолымнан келгенше жауап беруге тырысамын.",
        "Ашық әрі сенімді диалог кітапханамызды әрқайсыңызға жақындай түседі деп сенемін.",
        "Ізгі ниетпен,",
        "Сеитова Күміс Қарсақбайқызы",
        "Қазақстан Республикасының Ұлттық академиялық кітапханасының директоры"
      ],
      name: "Сеитова Күміс Қарсақбайқызы",
      position: "Қазақстан Республикасының Ұлттық академиялық кітапханасының директоры",
      contactTitle: "Маған хабарласу",
      namePlaceholder: "Аты-жөніңіз",
      emailPlaceholder: "Сіздің поштаңыз",
      messagePlaceholder: "Хабарламаңыз",
      submitBtn: "Жіберу",
      successMessage: "Хабарлама сәтті жіберілді!",
      errorMessage: "Хабарламаны жіберу кезінде қате пайда болды"
    },

    // Common
    common: {
      loading: "Жүктелуде...",
      error: "Қате",
      retry: "Қайталау",
      close: "Жабу",
      cancel: "Болдырмау",
      save: "Сақтау",
      edit: "Өңдеу",
      delete: "Жою",
      view: "Көру",
      back: "Артқа",
      next: "Келесі",
      previous: "Алдыңғы"
    }
  }
};

// Хук для использования переводов
export const useTranslations = () => {
  // Здесь будем импортировать контекст языка
  return {
    t: (key, lang = 'kz') => {
      const keys = key.split('.');
      let value = translations[lang];
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      return value || key;
    }
  };
};
