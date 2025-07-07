import React, { useState } from "react";
import "./RegistrationForm.scss";
import LoginHeader from "../../../components/LoginHeader/LoginHeader";
import backButton from "../assets/icons/back_button.png";
import { switchToLogin } from "../../../store/modalSlice";
import { useDispatch } from "react-redux";

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
  const handleFinalSubmit = (e) => {
    e.preventDefault();

    // Валидация для второго шага
    if (!allFormData.email.trim()) {
      alert("Email міндетті");
      return;
    }

    console.log("Вся форма отправлена:", allFormData);

    // Здесь будет отправка на сервер
    // await submitRegistration(allFormData);

    onClose();
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
            type="text"
            className="multi-step-form__input multi-step-form__input--small"
            placeholder="Жылы"
            name="birthYear"
            value={allFormData.birthYear}
            onChange={handleInputChange}
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
