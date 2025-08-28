package kz.inessoft.nabrk.elcat.dto;

import java.io.Serializable;

public class MRefinementForm implements Serializable {
    private String language;
    private Integer fromYear;
    private Integer toYear;
    private String country;
    private Short publicationType;
    private String topic;
    private Integer genre;
    private Integer field = 0;

    private String title;

    public static final int LANGUAGE_FIELD = 1;
    public static final int COUNTRY_FIELD = 2;
    public static final int PUBLICATIONTYPE_FIELD = 3;
    public static final int TOPIC_FIELD = 4;
    public static final int GENRE_FIELD = 5;
    public static final int YEAR_FIELD = 6;

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Integer getFromYear() {
        return fromYear;
    }

    public void setFromYear(Integer fromYear) {
        this.fromYear = fromYear;
    }

    public Integer getToYear() {
        return toYear;
    }

    public void setToYear(Integer toYear) {
        this.toYear = toYear;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Short getPublicationType() {
        return publicationType;
    }

    public void setPublicationType(Short publicationType) {
        this.publicationType = publicationType;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public Integer getGenre() {
        return genre;
    }

    public void setGenre(Integer genre) {
        this.genre = genre;
    }

    public Integer getField() {
        return field;
    }

    public void setField(Integer field) {
        this.field = field;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
