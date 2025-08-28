package kz.inessoft.nabrk.elcat.dto;

import lombok.Data;

import java.util.List;
import java.util.Locale;

@Data
public class SearchDTO {
    private Locale locale;
    private int limit = 10;
    private int page = 1;
    private List<Integer> catalogIdFilters;
    private List<MAdvancedSearchItem> searchItems;
    private String searchType;
    private Integer fromYear;
    private Integer toYear;
    private String language;
    private String fullTextSearchText;
}
