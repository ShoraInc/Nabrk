import React, { useState, useEffect, useRef } from "react";
import "./Events.scss";
import TimeIcon from "./assets/icons/clock.png";
import EventsApi from "../../../../api/eventsApi";

export default function Events() {
  const [activeDate, setActiveDate] = useState(0);
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tabsRef = useRef(null);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    const tabs = tabsRef.current;
    if (tabs && tabs.children[activeDate]) {
      const activeTab = tabs.children[activeDate];
      const { offsetLeft, offsetWidth } = activeTab;
      tabs.style.setProperty("--indicator-left", `${offsetLeft}px`);
      tabs.style.setProperty("--indicator-width", `${offsetWidth}px`);
    }
  }, [activeDate, eventsData]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await EventsApi.getActiveEvents({
        lang: "kz",
      });

      let upcomingDates = [];

      if (response.events && response.events.length > 0) {
        // Группируем события по датам
        const groupedEvents = EventsApi.groupEventsByDate(response.events);

        // Получаем следующие 7 дней с событиями
        upcomingDates = EventsApi.getUpcomingDatesWithEvents(groupedEvents, 7);
      } else {
        // Если нет событий, показываем следующие 7 дней пустыми
        upcomingDates = EventsApi.getUpcomingDatesWithEvents({}, 7);
      }

      setEventsData(upcomingDates);

      // Устанавливаем активную дату на первый день с событиями, или на сегодня
      const firstDateWithEvents = upcomingDates.findIndex(
        (date) => date.hasEvents
      );
      setActiveDate(firstDateWithEvents !== -1 ? firstDateWithEvents : 0);
    } catch (err) {
      console.error("Failed to load events:", err);
      setError(err.message);

      // В случае ошибки показываем пустые даты
      const emptyDates = EventsApi.getUpcomingDatesWithEvents({}, 7);
      setEventsData(emptyDates);
      setActiveDate(0);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (eventId) => {
    // Здесь можно добавить навигацию к детальной странице события
    console.log("Opening event:", eventId);
    // Например: navigate(`/events/${eventId}`);
  };

  // Компонент загрузки
  const LoadingState = () => (
    <div className="events-container">
      <h1 className="events-title">Іс-шаралар күнтізбесі</h1>

      {/* Загрузка табов */}
      <div className="date-tabs">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="date-tab">
            <div
              style={{
                height: "16px",
                width: "40px",
                backgroundColor: "#f0f0f0",
                marginBottom: "4px",
                borderRadius: "2px",
              }}
            ></div>
            <div
              style={{
                height: "14px",
                width: "60px",
                backgroundColor: "#f0f0f0",
                borderRadius: "2px",
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Загрузка событий */}
      <div className="event-content">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="event-item">
            <div className="event-time">
              <div className="time-circle">
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "50%",
                  }}
                ></div>
              </div>
              <div
                style={{
                  height: "16px",
                  width: "50px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "2px",
                }}
              ></div>
            </div>
            <div className="event-details">
              <div
                style={{
                  height: "18px",
                  width: "80%",
                  backgroundColor: "#f0f0f0",
                  marginBottom: "8px",
                  borderRadius: "2px",
                }}
              ></div>
              <div
                style={{
                  height: "18px",
                  width: "60%",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "2px",
                }}
              ></div>
            </div>
            <div className="event-location">
              <div
                style={{
                  height: "14px",
                  width: "120px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "2px",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Компонент ошибки
  const ErrorState = () => (
    <div className="events-container">
      <h1 className="events-title">Іс-шаралар күнтізбесі</h1>

      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "#dc2626",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "300",
            margin: "0 0 8px 0",
          }}
        >
          Қате орын алды
        </h3>
        <p
          style={{
            fontSize: "14px",
            opacity: 0.8,
            margin: "0 0 16px 0",
          }}
        >
          Іс-шараларды жүктеу мүмкін болмады
        </p>
        <button
          onClick={loadEvents}
          style={{
            padding: "12px 24px",
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Қайта жүктеу
        </button>
      </div>
    </div>
  );

  // Компонент пустого состояния для конкретной даты
  const EmptyDateState = () => (
    <div
      style={{
        textAlign: "center",
        padding: "40px 20px",
        color: "#666",
      }}
    >
      <div style={{ fontSize: "36px", marginBottom: "12px" }}>📅</div>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: "300",
          margin: "0 0 4px 0",
        }}
      >
        Бұл күні іс-шаралар жоқ
      </h3>
      <p
        style={{
          fontSize: "12px",
          opacity: 0.7,
          margin: 0,
        }}
      >
        Басқа күндерді таңдап көріңіз
      </p>
    </div>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  const currentDateData = eventsData[activeDate];

  return (
    <div className="events-container">
      <h1 className="events-title">Іс-шаралар күнтізбесі</h1>

      <div className="date-tabs" ref={tabsRef}>
        {eventsData.map((item, index) => (
          <button
            key={index}
            className={`date-tab ${activeDate === index ? "active" : ""} ${
              item.hasEvents ? "has-events" : ""
            }`}
            onClick={() => setActiveDate(index)}
          >
            <span className="date">{item.date}</span>
            <span className="day">{item.day}</span>
            {item.hasEvents && (
              <span
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#c5a63f",
                  borderRadius: "50%",
                  fontSize: "10px",
                }}
              ></span>
            )}
          </button>
        ))}
      </div>

      <div className="event-content">
        {currentDateData && currentDateData.events.length > 0 ? (
          currentDateData.events.map((event, index) => (
            <div
              key={event.id || index}
              className="event-item"
              onClick={() => handleEventClick(event.id)}
              style={{ cursor: event.id ? "pointer" : "default" }}
            >
              <div className="event-time">
                <div className="time-circle">
                  <img src={TimeIcon} alt="time" />
                </div>
                <span className="time">{event.time}</span>
              </div>
              <div className="event-details">
                <h3 className="event-title">{event.title}</h3>
              </div>
              <div className="event-location">
                <span className="location-icon">📍</span>
                <span className="location-text">{event.location}</span>
              </div>
            </div>
          ))
        ) : (
          <EmptyDateState />
        )}
      </div>
    </div>
  );
}
