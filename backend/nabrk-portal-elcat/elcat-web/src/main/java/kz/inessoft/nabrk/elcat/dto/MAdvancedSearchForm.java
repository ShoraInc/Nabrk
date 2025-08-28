package kz.inessoft.nabrk.elcat.dto;

import kz.inessoft.nabrk.elcat.infrastructure.utils.Constants;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

public class MAdvancedSearchForm  implements Serializable {
    private List<MAdvancedSearchItem> advancedSearchItems;
    private String toYear;
    private String fromYear;
    private String language;
    private int brView;
    private int limit;

    public MAdvancedSearchForm() {
        clear();
    }

    public void setToYear(String toYear) {
        this.toYear = toYear;
    }

    public void setFromYear(String fromYear) {
        this.fromYear = fromYear;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setBrView(int brView) {
        this.brView = brView;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public String getToYear() {
        return toYear;
    }

    public String getFromYear() {
        return fromYear;
    }

    public String getLanguage() {
        return language;
    }

    public int getBrView() {
        return brView;
    }

    public int getLimit() {
        return limit;
    }

    public List<MAdvancedSearchItem> getAdvancedSearchItems() {
        return advancedSearchItems;
    }

    public void setAdvancedSearchItems(List<MAdvancedSearchItem> advancedSearchItems) {
        this.advancedSearchItems = advancedSearchItems;
    }

    public void clear() {
        this.fromYear = "1800";
        this.toYear = String.valueOf(Constants.getCurrentYear());
        this.language = "ru";
        this.brView = 1;
        this.limit = 10;
        this.advancedSearchItems = new LinkedList<MAdvancedSearchItem>();
        advancedSearchItems.add(new MAdvancedSearchItem("all", "", "FIRST"));
        advancedSearchItems.add(new MAdvancedSearchItem("all", "", "AND"));
        this.language="000";
    }
}
