import React, { useState } from "react";
import "./RegistrationForm.scss";
import LoginHeader from "../../../components/layout/LoginHeader/LoginHeader";
import backButton from "../assets/icons/back_button.png";
import { switchToLogin } from "../../../store/modalSlice";
import { useDispatch } from "react-redux";
import AuthApi from "../../../api/authApi";

const RegistrationForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);

  // Объединенное состояние для всех данных формы
  const [allFormData, setAllFormData] = useState({
    // Шаг 1 - Личные данные
    firstName: "",
    lastName: "",
    fatherName: "",
    gender: "",
    birthDay: "",
    birthMonth: "Айы",
    birthYear: "",
    nationality: "Қазақ",
    address: "",

    // Шаг 2 - Образование
    knowledge: "",
    location: "Таңдалмаған",
    workplace: "",
    degree: "",
    studyPlace: "",
    email: "",
  });

  const handleSwitchToLogin = () => {
    dispatch(switchToLogin());
  };

  // Опции для селектов и радио-кнопок
  const genderOptions = [
    { value: "Ер", label: "Ер" },
    { value: "Әйел", label: "Әйел" },
    { value: "Айтпағанды жөн көру", label: "Айтпағанды жөн көру" },
  ];

  const monthOptions = [
    { value: "Айы", label: "Айы" },
    { value: "Қаңтар", label: "Қаңтар" },
    { value: "Ақпан", label: "Ақпан" },
    { value: "Наурыз", label: "Наурыз" },
    { value: "Сәуір", label: "Сәуір" },
    { value: "Мамыр", label: "Мамыр" },
    { value: "Маусым", label: "Маусым" },
    { value: "Шілде", label: "Шілде" },
    { value: "Тамыз", label: "Тамыз" },
    { value: "Қыркүйек", label: "Қыркүйек" },
    { value: "Қазан", label: "Қазан" },
    { value: "Қараша", label: "Қараша" },
    { value: "Желтоқсан", label: "Желтоқсан" },
  ];

  const nationalityOptions = [
    { value: "Айы", label: "Айы" },
    { value: "Қазақ", label: "Қазақ" },
    { value: "Орыс", label: "Орыс" },
    { value: "Өзбек", label: "Өзбек" },
    { value: "Басқа", label: "Басқа" },
  ];

  const knowledgeOptions = [
    { value: "Көрсетілмеген", label: "Көрсетілмеген" },
    { value: "Жоғары", label: "Жоғары" },
    { value: "Толық емес жоғары", label: "Толық емес жоғары" },
    { value: "Арнаулы орта", label: "Арнаулы орта" },
    { value: "Орта", label: "Орта" },
    { value: "Толық емес орта", label: "Толық емес орта" },
    { value: "Техникалық орта", label: "Техникалық орта" },
  ];

  const degreeOptions = [
    { value: "Көрсетілмеген", label: "Көрсетілмеген" },
    { value: "Бакалавр", label: "Бакалавр" },
    { value: "Магистр", label: "Магистр" },
    { value: "Ғылым кандидаты", label: "Ғылым кандидаты" },
    { value: "Ғылым докторы", label: "Ғылым докторы" },
    { value: "PhD докторы", label: "PhD докторы" },
  ];

  const locationOptions = [
    { value: "Таңдалмаған", label: "Таңдалмаған" },
    { value: "Қазақстан", label: "Қазақстан" },
    { value: "Ресей", label: "Ресей" },
    { value: "Басқа", label: "Басқа" },
  ];

  // Обработчики изменений
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Для поля года рождения - разрешаем только цифры
    if (name === 'birthYear') {
      if (value && !/^\d{0,4}$/.test(value)) {
        return; // Не обновляем состояние если введено не число
      }
    }
    
    setAllFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name, value) => {
    setAllFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Переход к следующему шагу
  const handleNextStep = (e) => {
    e.preventDefault();

    // Валидация для первого шага
    if (currentStep === 1) {
      if (!allFormData.firstName.trim() || !allFormData.lastName.trim()) {
        alert("Тегі мен Аты міндетті");
        return;
      }
    }

    setCurrentStep(2);
  };

  // Возврат к предыдущему шагу
  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  // Финальная отправка формы
  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    // Валидация обязательных полей
    if (!allFormData.firstName.trim()) {
      alert("Аты міндетті");
      return;
    }
    if (!allFormData.lastName.trim()) {
      alert("Тегі міндетті");
      return;
    }
    if (!allFormData.email.trim()) {
      alert("Email міндетті");
      return;
    }
    if (!allFormData.birthYear || allFormData.birthYear.trim() === '') {
      alert("Туған жылы міндетті");
      return;
    }
    
    // Преобразуем год рождения в число и валидируем
    const birthYear = parseInt(allFormData.birthYear, 10);
    const currentYear = new Date().getFullYear();
    const minAge = 14;
    const maxAllowedYear = currentYear - minAge;
    
    if (isNaN(birthYear) || birthYear < 1900 || birthYear > maxAllowedYear) {
      alert(`Туған жылы дұрыс емес. 1900-ден ${maxAllowedYear} дейінгі жылды енгізіңіз (минимальный возраст ${minAge} лет)`);
      return;
    }
    
    if (!allFormData.gender || allFormData.gender === '') {
      alert("Жынысы міндетті");
      return;
    }

    try {
      // Подготовка данных для API
      const registrationData = {
        firstName: allFormData.firstName.trim(),
        lastName: allFormData.lastName.trim(),
        middleName: allFormData.fatherName.trim() || null,
        email: allFormData.email.trim(),
        genderId: getGenderId(allFormData.gender),
        yearOfBirth: Number(birthYear),
        nationalityId: getNationalityId(allFormData.nationality),
        homeAddress: allFormData.address.trim() || null,
        educationId: getEducationId(allFormData.knowledge),
        socialStatusId: getSocialStatusId(allFormData.workplace),
        academicDegreeId: getAcademicDegreeId(allFormData.degree),
        job: allFormData.workplace.trim() || null,
        placeOfStudy: allFormData.studyPlace.trim() || null
      };

      console.log("Отправка данных на сервер:", registrationData);
      
      // Дополнительная проверка типов перед отправкой
      const requiredNumericFields = {
        genderId: registrationData.genderId,
        yearOfBirth: registrationData.yearOfBirth,
        nationalityId: registrationData.nationalityId,
        educationId: registrationData.educationId,
        socialStatusId: registrationData.socialStatusId,
        academicDegreeId: registrationData.academicDegreeId
      };
      
      for (const [fieldName, value] of Object.entries(requiredNumericFields)) {
        if (!Number.isInteger(value) || value < 1) {
          console.error(`Поле ${fieldName} содержит некорректное значение:`, value);
          alert(`Қате: ${fieldName} поле дұрыс толтырылмаған`);
          return;
        }
      }

      console.log("Отправка данных на сервер:", registrationData);

      // Отправка на сервер
      const response = await AuthApi.fullRegistration(registrationData);
      
      console.log("Ответ сервера:", response);
      
      alert("Тіркеу сәтті! Сіздің email-ге хабарландыру жіберілді.");
      onClose();
      
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      
      // Более детальная обработка ошибок
      let errorMessage = "Тіркеу қатесі";
      if (error.response?.data?.message) {
        errorMessage += `: ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      alert(errorMessage);
    }
  };

  // Функции для преобразования значений в ID (возвращают числа)
  const getGenderId = (gender) => {
    const genderMap = {
      'Ер': 1,
      'Әйел': 2,
      'Айтпағанды жөн көру': 3
    };
    return genderMap[gender] || 3;
  };

  const getNationalityId = (nationality) => {
    const nationalityMap = {
      'Қазақ': 1,
      'Орыс': 2,
      'Өзбек': 3,
      'Қырғыз': 4,
      'Тәжік': 5,
      'Түрікмен': 6,
      'Басқа': 7
    };
    return nationalityMap[nationality] || 1;
  };

  const getEducationId = (education) => {
    const educationMap = {
      'Көрсетілмеген': 1,
      'Жоғары': 2,
      'Толық емес жоғары': 3,
      'Арнаулы орта': 4,
      'Орта': 5,
      'Толық емес орта': 6,
      'Техникалық орта': 7
    };
    return educationMap[education] || 1;
  };

  const getSocialStatusId = (status) => {
    const statusMap = {
      'Студент': 1,
      'Жұмысшы': 2,
      'Қызметкер': 3,
      'Зейнеткер': 4,
      'Жұмыссыз': 5,
      'Кәсіпкер': 6,
      'Басқа': 7
    };
    return statusMap[status] || 1;
  };

  const getAcademicDegreeId = (degree) => {
    const degreeMap = {
      'Көрсетілмеген': 1,
      'Бакалавр': 2,
      'Магистр': 3,
      'Ғылым кандидаты': 4,
      'Ғылым докторы': 5,
      'PhD докторы': 6
    };
    return degreeMap[degree] || 1;
  };

  const handleClose = () => {
    onClose();
  };

  const handleGoBack = () => {
    if (currentStep === 1) {
      onClose();
    } else {
      handlePrevStep();
    }
  };

  // Компонент для рендеринга радио-кнопок
  const RadioGroup = ({ name, options, value, onChange, columns = 3 }) => (
    <div className="multi-step-form__radio-group">
      {options.map((option) => (
        <label key={option.value} className="multi-step-form__radio">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(name, e.target.value)}
          />
          <span className="multi-step-form__radio-text">{option.label}</span>
        </label>
      ))}
    </div>
  );

  // Рендер первого шага
  const renderStep1 = () => (
    <form className="multi-step-form__form" onSubmit={handleNextStep}>
      {/* Тегі */}
      <div className="multi-step-form__section">
        <label className="multi-step-form__label">
          Тегі
          <input
            type="text"
            className="multi-step-form__input"
            name="lastName"
            value={allFormData.lastName}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      {/* Аты */}
      <div className="multi-step-form__section">
        <label className="multi-step-form__label">
          Аты
          <input
            type="text"
            className="multi-step-form__input"
            name="firstName"
            value={allFormData.firstName}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      {/* Әкесінің аты */}
      <div className="multi-step-form__section">
        <label className="multi-step-form__label">
          Әкесінің аты
          <input
            type="text"
            className="multi-step-form__input"
            name="fatherName"
            value={allFormData.fatherName}
            onChange={handleInputChange}
          />
        </label>
      </div>

      {/* Жынысы */}
      <div className="multi-step-form__section">
        <h3 className="multi-step-form__section-title">Жынысы</h3>
        <RadioGroup
          name="gender"
          options={genderOptions}
          value={allFormData.gender}
          onChange={handleRadioChange}
          columns={3}
        />
      </div>

      {/* Туған жылы */}
      <div className="multi-step-form__section">
        <h3 className="multi-step-form__section-title">Туған жылы</h3>
        <div className="multi-step-form__birth-row">
          <input
            type="text"
            className="multi-step-form__input multi-step-form__input--small"
            placeholder="Күні"
            name="birthDay"
            value={allFormData.birthDay}
            onChange={handleInputChange}
          />
          <select
            className="multi-step-form__select"
            name="birthMonth"
            value={allFormData.birthMonth}
            onChange={handleInputChange}
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="multi-step-form__input multi-step-form__input--small"
            placeholder="Жылы (1990)"
            name="birthYear"
            value={allFormData.birthYear}
            onChange={handleInputChange}
            min="1900"
            max={new Date().getFullYear() - 14}
            title="Минимальный возраст 14 лет"
          />
        </div>
      </div>

      {/* Ұлт */}
      <div className="multi-step-form__section">
        <label className="multi-step-form__label">
          Ұлт
          <select
            className="multi-step-form__select"
            name="nationality"
            value={allFormData.nationality}
            onChange={handleInputChange}
          >
            {nationalityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Тұрғылықты мекенжайы */}
      <div className="multi-step-form__section">
        <label className="multi-step-form__label">
          Тұрғылықты мекенжайы
          <input
            type="text"
            className="multi-step-form__input"
            placeholder="Мысалы: Астана қ, Шәміші көшесі 1/2"
            name="address"
            value={allFormData.address}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <button type="submit" className="multi-step-form__submit">
        Жалғастыру
      </button>
    </form>
  );

  // Рендер второго шага (существующие поля образования)
  const renderStep2 = () => {
    const RadioGroupStep2 = ({
      name,
      options,
      value,
      onChange,
      columns = 2,
    }) => (
      <div className="multi-step-form__radio-group">
        {Array.from(
          { length: Math.ceil(options.length / columns) },
          (_, rowIndex) => (
            <div key={rowIndex} className="multi-step-form__radio-row">
              {options
                .slice(rowIndex * columns, (rowIndex + 1) * columns)
                .map((option) => (
                  <label key={option.value} className="multi-step-form__radio">
                    <input
                      type="radio"
                      name={name}
                      value={option.value}
                      checked={value === option.value}
                      onChange={(e) => onChange(name, e.target.value)}
                    />
                    <span className="multi-step-form__radio-text">
                      {option.label}
                    </span>
                  </label>
                ))}
            </div>
          )
        )}
      </div>
    );

    return (
      <form className="multi-step-form__form" onSubmit={handleFinalSubmit}>
        {/* Білім секциясы */}
        <div className="multi-step-form__section">
          <h3 className="multi-step-form__section-title">Білім</h3>
          <RadioGroupStep2
            name="knowledge"
            options={knowledgeOptions}
            value={allFormData.knowledge}
            onChange={handleRadioChange}
            columns={2}
          />
        </div>

        {/* Өлкеметтік жағдайы */}
        <div className="multi-step-form__section">
          <label className="multi-step-form__label">
            Өлкеметтік жағдайы
            <select
              className="multi-step-form__select"
              name="location"
              value={allFormData.location}
              onChange={handleInputChange}
              required
            >
              {locationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Жұмыс орны */}
        <div className="multi-step-form__section">
          <label className="multi-step-form__label">
            Жұмыс орны
            <input
              type="text"
              className="multi-step-form__input"
              name="workplace"
              value={allFormData.workplace}
              onChange={handleInputChange}
              placeholder="Жұмыс орнын енгізіңіз"
            />
          </label>
        </div>

        {/* Ғылыми дәреже */}
        <div className="multi-step-form__section">
          <h3 className="multi-step-form__section-title">Ғылыми дәреже</h3>
          <RadioGroupStep2
            name="degree"
            options={degreeOptions}
            value={allFormData.degree}
            onChange={handleRadioChange}
            columns={3}
          />
        </div>

        {/* Оқу орны */}
        <div className="multi-step-form__section">
          <label className="multi-step-form__label">
            Оқу орны
            <input
              type="text"
              className="multi-step-form__input"
              name="studyPlace"
              value={allFormData.studyPlace}
              onChange={handleInputChange}
              placeholder="Оқу орнын енгізіңіз"
            />
          </label>
        </div>

        {/* Email */}
        <div className="multi-step-form__section">
          <label className="multi-step-form__label">
            Электрондық пошта мекенжайы
            <input
              type="email"
              className="multi-step-form__input"
              name="email"
              value={allFormData.email}
              onChange={handleInputChange}
              placeholder="yourmail@mail.com"
              required
            />
          </label>
        </div>

        <button
          type="submit"
          className="multi-step-form__submit"
          disabled={!allFormData.email.trim()}
        >
          Дайын
        </button>
      </form>
    );
  };

  return (
    <div className="multi-step-form">
      <LoginHeader onClose={handleClose} />

      <div className="multi-step-form__container">
        {/* Прогресс бар */}
        <div className="multi-step-form__progress">
          <div
            className="multi-step-form__progress-fill"
            style={{ width: `${(currentStep / 2) * 100}%` }}
          ></div>
        </div>

        <div className="multi-step-form__header">
          <button
            className="multi-step-form__back-button"
            onClick={handleGoBack}
            type="button"
          >
            <img src={backButton} alt="Артқа" />
          </button>
          <div className="multi-step-form__header-content">
            <div className="multi-step-form__step">{currentStep}/2 қадам</div>
            <h1 className="multi-step-form__title">
              {currentStep === 1
                ? "Негізгі деректер"
                : "Білімі туралы деректер"}
            </h1>
          </div>
        </div>

        <div className="multi-step-form__content">
          {currentStep === 1 ? renderStep1() : renderStep2()}
        </div>

        <div className="multi-step-form__switch">
          <p>Аккаунтыңыз бар ма?</p>
          <button
            className="multi-step-form__switch-btn"
            onClick={handleSwitchToLogin}
            type="button"
          >
            Кіру
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;