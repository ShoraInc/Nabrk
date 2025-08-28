package kz.inessoft.nabrk.elcat.infrastructure.utils;

import java.util.*;

public class Constants {
    public static final short FULLTEXT_SEARCH = 1;
    public static final short SIMPLE_SEARCH = 2;
    public static final short ADVANCED_SEARCH = 3;
    public static final short UDC_SEARCH = 4;
    public static final short HIERARCHY_SEARCH = 5;
    public static final short FIRST_LETTER_SEARCH = 6;

    public static final String LOCALE_RU = "ru";
    public static final String LOCALE_EN = "en";
    public static final String LOCALE_KZ = "kk";
    public static final String LOCALE_la = "la";

    public static final String[] SEARCH_FORM_NAME = {"Unknown", "Full Text", "Simple Search", "Advanced Search", "UDC Search", "Hierarchy", "Back"};
    public static final String[] SEARCH_FORM_NAME_RU = {"Unknown", "Полнотекстовый", "Простой поиск", "Расширенный поиск", "Поиск по УДК", "Иерархия", "Back"};
    public static final String[] SEARCH_FORM_NAME_KZ = {"Unknown", "Толық мәтіндік іздеу", "Іздеу", "Кеңейтілген іздеу", "ӘОЖ бойынша іздеу", "Иерархия", "Артқа"};
    public static final String[] SEARCH_FORM_NAME_EN = {"Unknown", "Full Text", "Simple Search", "Advanced Search", "UDC Search", "Hierarchy", "Back"};
    public static final String[] SEARCH_FROM_NAME_la_KZ = {"Unknown", "Tolyq mátіndіk іzdeý", "Izdeý", "Keńeıtіlgen іzdeý", "ÁOJ boıynsha іzdeý", "Ierarhııa", "Artqa"};



    public static String[] getSearchFormName(Locale locale) {
        if (locale.getLanguage().equals(Constants.LOCALE_RU)) {
            return SEARCH_FORM_NAME_RU;
        } else if (locale.getLanguage().equals(Constants.LOCALE_KZ)) {
            return SEARCH_FORM_NAME_KZ;
        } else if (locale.getLanguage().equals(Constants.LOCALE_EN)) {
            return SEARCH_FORM_NAME_EN;
        }else if (locale.getLanguage().equals(Constants.LOCALE_la)) {
            return SEARCH_FROM_NAME_la_KZ;
        } else {
            return SEARCH_FORM_NAME;
        }
    }

    public static int getCurrentYear() {
        Calendar calendar = Calendar.getInstance(TimeZone.getDefault(), Locale.getDefault());
        calendar.setTime(new Date());
        return calendar.get(Calendar.YEAR);
    }
}
