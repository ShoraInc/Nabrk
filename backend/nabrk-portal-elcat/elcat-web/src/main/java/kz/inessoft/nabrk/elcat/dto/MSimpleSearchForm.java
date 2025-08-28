package kz.inessoft.nabrk.elcat.dto;

import java.io.Serializable;

public class MSimpleSearchForm implements Serializable {
    private String field;
    private String searchString;
    private Boolean searchInFound;

    public MSimpleSearchForm() {

    }

    public MSimpleSearchForm(String field, String searchString) {
        this.field = field;
        this.searchString = searchString;
    }


    public String getSearchString() {
        return searchString;
    }

    public void setSearchString(String searchString) {
        this.searchString = searchString;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public Boolean getSearchInFound() {
        if (searchInFound==null) {
            searchInFound = false;
        }
        return searchInFound;
    }

    public void setSearchInFound(Boolean searchInFound) {
        this.searchInFound = searchInFound;
    }

    public void clear() {
        searchString="";
    }
}
