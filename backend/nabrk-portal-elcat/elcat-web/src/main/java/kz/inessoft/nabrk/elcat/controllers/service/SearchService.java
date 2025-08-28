package kz.inessoft.nabrk.elcat.controllers.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import kz.inessoft.nabrk.dao.dto.MCatalogueType;
import kz.inessoft.nabrk.dao.dto.MCatalogueTypeList;
import kz.inessoft.nabrk.dao.dto.SearchResult;
import kz.inessoft.nabrk.dao.dto.UserSearchFilterInfo;
import kz.inessoft.nabrk.dao.repository.*;
import kz.inessoft.nabrk.elcat.dto.*;
import kz.inessoft.nabrk.elcat.enums.SearchType;
import kz.inessoft.nabrk.elcat.infrastructure.utils.Constants;
import kz.inessoft.nabrk.solr.domain.*;
import kz.inessoft.nabrk.solr.service.SolrSearchService;
import org.apache.solr.client.solrj.SolrServerException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static kz.inessoft.nabrk.solr.domain.Field.*;
import static kz.inessoft.nabrk.solr.domain.Operation.AND;

@Service
public class SearchService {
    private static final Pattern letterPatter = Pattern.compile("[0-9A-ZА-ЯӘҒҚҢӨҰҮҺЁІ]");

    @Value("${app.solr.max_export_count}")
    private int MAX_EXPORT_COUNT;

    @Autowired
    BrRepository brRepository;

    @Autowired
    SolrSearchService solrSearchService;

    @Autowired
    BrLinkRepository brLinkRepository;

    @Autowired
    RubricBrRepository rubricBrRepository;

    @Autowired
    CountryRepository countryRepository;

    @Autowired
    SphereRepository sphereRepository;

    @Autowired
    LangRepository langRepository;

    @Autowired
    PublicationTypeRepository publicationTypeRepository;

    @Autowired
    UDCRepository udcRepository;

    @Autowired
    UserSearchFilterRepository userSearchFilterRepository;

    @Autowired
    ArRepository arRepository;

    public BRSearchResult getCatalogueItems(List<Filter> filters, Integer page, Integer limit, final Locale locale) throws SolrServerException {
        if (filters.size() == 0) {
            return new BRSearchResult(new LinkedList<MCatalogueItem>(), 0);
        }
        SolrSearchResult result = solrSearchService.searchNabrkPage(filters, page, limit);
        List<MCatalogueItem> catalogueItems = getCatalogueItems(result.brIds, locale, null);
        return new BRSearchResult(catalogueItems, result.count.intValue());
    }

    public List<MCatalogueItem> getCatalogueItems(Collection<Integer> brIds, Locale locale, Integer hierarchyBrId) {
        List<MCatalogueItem> catalogueItems = new LinkedList<MCatalogueItem>();
        for (Integer brId : brIds) {
            MCatalogueItem catalogueItem = new MCatalogueItem();
            catalogueItem.setId(brId);
            catalogueItems.add(catalogueItem);
        }
        brRepository.fillElCatalogBrs(catalogueItems, locale, hierarchyBrId);
        return catalogueItems;
    }

    public List<MCatalogueItem> getAllCatalogueItems(List<Filter> searchFilters, Locale locale){
        try {
            SolrSearchResult result = solrSearchService.searchNabrkPage(searchFilters, 1, null);
            return getCatalogueItems(result.brIds, locale, null);
        } catch (SolrServerException e) {
            e.printStackTrace();
            throw new RuntimeException();
        }
    }

    public BRSearchResult getCatalogueItemsByHierarchy(Integer hierarchyBrId, Integer page, Integer limit, Locale locale) {
        int offset = (page - 1) * limit;
        limit = page * limit;

        final Collection<Integer> linkBrIds = brLinkRepository.getLinkBrIds(hierarchyBrId, offset, limit);
        int count = brLinkRepository.getLinkCount(hierarchyBrId);
        final List<MCatalogueItem> catalogueItems = getCatalogueItems(linkBrIds, locale, hierarchyBrId);
        return new BRSearchResult(catalogueItems, count);
    }

    public BRSearchResult getFullTextCatalogueItems(String fullTextSearchString, int page, int limit, Locale locale) throws SolrServerException {
        if (fullTextSearchString == null || fullTextSearchString.isEmpty()) {
            return new BRSearchResult(new LinkedList<MCatalogueItem>(), 0);
        }
        SolrSearchResult result = solrSearchService.searchFullTextSearchKaneb(fullTextSearchString, page, limit);
        List<MCatalogueItem> catalogueItems = getCatalogueItems(result.brIds, locale, null);
        return new BRSearchResult(catalogueItems, result.count.intValue());
    }

    public BRSearchResult getRubricCatalogueItems(Integer rubricId, Integer page, Integer limit, final Locale locale) {
        int offset = (page - 1) * limit;
        limit = page * limit;
        SearchResult searchResult = rubricBrRepository.getRubricBrIds(rubricId, SolrSearchService.nabrkCatalogIds, limit, offset);
        List<MCatalogueItem> catalogueItems = getCatalogueItems(searchResult.idList, locale, null);
        return new BRSearchResult(catalogueItems, searchResult.count);
    }

    public SearchResult getRubricCatalogueItems(Integer rubricId) {
        return rubricBrRepository.getRubricBrIds(rubricId, SolrSearchService.nabrkCatalogIds, -1, -1);
    }

    public List<Filter> getSearchFilters(SearchDTO searchDto) {
        List<Filter> filters = new LinkedList<>();
        Locale locale = searchDto.getLocale();
        if (searchDto.getSearchItems() != null && !searchDto.getSearchItems().isEmpty()) {

            for (MAdvancedSearchItem item : searchDto.getSearchItems()) {
                Field field = Field.valueOf(item.getField());
                Operation operation;
                try {
                     operation = Operation.valueOf(item.getOperator());
                } catch (IllegalArgumentException e) {
//                    throw new RuntimeException(e.getMessage() + " with operator " + item.getOperator());
                    operation = Operation.AND;
                }
                String value = item.getValue();
                Filter filter;
                if (item.getField().equals(title_first_letter.name())) {
                    filter = Filter.startWith(Field.title_first_letter, value);
                } else if (item.getField().equals(country_edition.name())) {
                    if (value == null || value.isEmpty()) {
                        filter = (new Filter(AND, country_edition, "[\"\" TO *]", getUnknown(locale), true));
                    } else {
                        filter = (new Filter(AND, country_edition, value, countryRepository.getCountryValue(value, locale)));
                    }
                } else if (item.getField().equals(sphere.name())) {
                    filter = (new Filter(AND, sphere, value, sphereRepository.getSphere(value, locale)));
                } else if (item.getField().equals(language.name())) {
                    if (value == null || value.isEmpty()) {
                        filter = (new Filter(AND, language, "000", getUnknown(locale)));
                    } else {
                        filter = (new Filter(AND, language, value, langRepository.getValueLang(value, locale)));
                    }
                } else if (item.getField().equals(publication_type.name())) {
                    if (value == null || value.isEmpty()) {
                        filter = (new Filter(AND, publication_type, "0", getUnknown(locale)));
                    } else {
                        filter = (new Filter(AND, publication_type, value,
                                publicationTypeRepository.getPublicationTypeName(Short.valueOf(value), locale.getLanguage())));
                    }
                } else if (item.getField().equals(topic.name())) {
                    if (value == null || value.isEmpty()) {
                        filter = (new Filter(AND, topic, "000", getUnknown(locale)));
                    } else {
                        filter = (new Filter(AND, topic, value, udcRepository.getTopicValue(value)));
                    }
                } else {
                    filter = new Filter(operation, field, value, value);
                }

                filters.add(filter);
            }
        }

        MCatalogueTypeList list = new MCatalogueTypeList();
        List<Integer> catalogFilters = searchDto.getCatalogIdFilters();
        if (searchDto.getSearchType() == null || !searchDto.getSearchType().toUpperCase().equals(SearchType.UDC.name())) {
            if (!(catalogFilters == null || catalogFilters.isEmpty() || catalogFilters.contains(0))) { // 0 == все каталоги
                List<String> catalogNameList = catalogFilters.stream().map(i -> getCatalogName(list, locale, i)).collect(Collectors.toList());
                Filter catalogFilter = new Filter(catalogFilters, catalogNameList);
                filters.add(catalogFilter);
            }
        }

        if (searchDto.getFromYear() != null && searchDto.getToYear() != null) {
            Filter yearFilter = new Filter(AND, searchDto.getFromYear(), searchDto.getToYear());
            filters.add(yearFilter);
        }
        if (SearchType.valueOf(searchDto.getSearchType().toUpperCase(Locale.ROOT)) == SearchType.ADVANCED) {
            String language = searchDto.getLanguage();
            if (language != null && !language.isEmpty() && !language.equals("000")) {
                filters.add(new Filter(AND, Field.language, language, langRepository.getValueLang(language, searchDto.getLocale())));
            }
        }
        return filters;
    }

    public Map<String, List<MRefinementItem>> getRefinementItems(List<Filter> filters, Locale locale) throws SolrServerException {
        Map<String, List<MRefinementItem>> refinementItems = new HashMap<>();
        for (int i = MRefinementForm.LANGUAGE_FIELD; i < MRefinementForm.YEAR_FIELD; i++) {
            final Field field = getField(i);

            List<GroupField> groupFields = solrSearchService.getGroupByNabrk(filters, field);

            List<MRefinementItem> items = new LinkedList<>();
            for (GroupField groupField : groupFields) {
                if (field == Field.topic && "4".equals(groupField.code)) continue; // 4 кода нет в УДК
                if (field == Field.sphere && "0".equals(groupField.code)) continue;
                String value = getRefinementValue(groupField.code, i, locale);
                MRefinementItem refinementItem = new MRefinementItem();
                refinementItem.setCount(groupField.count);
                refinementItem.setValue(groupField.code);
//                refinementItem.setType(String.valueOf(i));
//                refinementItem.setDisabled(false);
                refinementItem.setName(value);
                items.add(refinementItem);
            }
            refinementItems.put(field.name(), items);
        }
        return refinementItems;
    }

    public List<MFilterInfo> getMFilterInfoList(List<Filter> filters, Locale locale) {
        List<MFilterInfo> filterInfoList = new LinkedList<MFilterInfo>();
        for (Filter filter : filters) {
            MFilterInfo filterInfo = new MFilterInfo();
            filterInfo.setIndex(filters.indexOf(filter));
            filterInfo.setCaption(filter.caption(locale));
            filterInfoList.add(filterInfo);
        }
        return filterInfoList;
    }

    public List<String> fillTitles(List<GroupField> groupByNabrk) {
        TreeSet<String> titleFirstLetters = new TreeSet<String>();
        for (GroupField groupField : groupByNabrk) {
            String letter = groupField.code;
            if (letter == null) continue;
            if (letterPatter.matcher(letter).matches()) {
                titleFirstLetters.add(letter);
            }
        }
        return new ArrayList<String>(titleFirstLetters);
    }

    private String getUnknown(Locale locale) {
        switch (locale.getLanguage()) {
            case Constants.LOCALE_EN:
                return "Unknown";
            case Constants.LOCALE_RU:
                return "Не указано";
            case Constants.LOCALE_KZ:
                return "Көрсетілмеген";
            case Constants.LOCALE_la:
                return "Кörsetılmegen";
            default:
                throw new RuntimeException("Locale " + locale.getLanguage() + " not supported");
        }
    }

    protected String getCatalogName(MCatalogueTypeList list, Locale locale, int id) {
        for (MCatalogueType catalogueType : list.getCatalogueTypeList()) {
            catalogueType.setLanguage(locale.toString());
            if (catalogueType.getId() == id) {
                return catalogueType.getName();
            }
        }
        throw new RuntimeException("Catalog with id " + id + " not found");
    }

    private Field getField(Integer refType) {
        switch (refType) {
            case MRefinementForm.LANGUAGE_FIELD:
                return Field.language;
            case MRefinementForm.COUNTRY_FIELD:
                return Field.country_edition;
            case MRefinementForm.PUBLICATIONTYPE_FIELD:
                return Field.publication_type;
            case MRefinementForm.TOPIC_FIELD:
                return Field.topic;
            case MRefinementForm.GENRE_FIELD:
                return Field.sphere;
            default:
                String message = String.format("Refinement type %s not found", refType);
                throw new RuntimeException(message);
        }
    }

    private String getRefinementValue(String groupValue, Integer refType, Locale locale) {
        if (groupValue == null || groupValue.isEmpty()) return getUnknown(locale);

        switch (refType) {
            case MRefinementForm.LANGUAGE_FIELD:
                return langRepository.getValueLang(groupValue, locale);
            case MRefinementForm.COUNTRY_FIELD:
                return countryRepository.getCountryValue(groupValue, locale);
            case MRefinementForm.PUBLICATIONTYPE_FIELD:
                return publicationTypeRepository.getPublicationTypeName(Short.valueOf(groupValue), locale.getLanguage());
            case MRefinementForm.TOPIC_FIELD:
                return udcRepository.getTopicValue(groupValue);
            case MRefinementForm.GENRE_FIELD:
                return sphereRepository.getSphere(groupValue, locale);
            default:
                String message = String.format("Refinement type %s not found", refType);
                throw new RuntimeException(message);
        }
    }

    public int saveQuery(SaveSearchDTO saveSearchDto) {
        List<Filter> filters = this.getSearchFilters(saveSearchDto);
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String filterBody = new String(objectMapper.writeValueAsBytes(filters),"UTF-8");
            return userSearchFilterRepository.saveUserSearchFilter(saveSearchDto.getFilterName(),
                    filterBody, SearchType.valueOf(saveSearchDto.getSearchType().toUpperCase()).getValue());
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    public String getArCardView(Integer arID) {
        return arRepository.getCardView(arID);
    }

    public SearchDTO getSearchDtoFromSavedFilter(Integer filterID) {
        UserSearchFilterInfo info = userSearchFilterRepository.loadFilter(filterID);
        JSONArray filtersAsJson = new JSONArray(info.filtersAsJson);
        SearchDTO searchDto = new SearchDTO();
        List<MAdvancedSearchItem> searchItems = new LinkedList<>();
        for (int i = 0; i < filtersAsJson.length(); i++) {
            JSONObject object = filtersAsJson.getJSONObject(i);
            if (!object.isNull("catalogIdList")) {
                JSONArray list = object.getJSONArray("catalogIdList");
                List<Integer> catalogIdFilters = new ArrayList<>();
                for (int j = 0; j < list.length(); j++) {
                    catalogIdFilters.add(list.getInt(j));
                }
                searchDto.setCatalogIdFilters(catalogIdFilters);
            } else if (object.getInt("startYear") != 0 && object.getInt("endYear") != 0) {
                searchDto.setFromYear(object.getInt("startYear"));
                searchDto.setToYear(object.getInt("endYear"));
            } else {
                MAdvancedSearchItem item = new MAdvancedSearchItem();
                item.setValue(object.getString("value"));
                item.setOperator(object.getString("operation"));
                item.setField(object.getString("field"));
                searchItems.add(item);
            }
        }
        searchDto.setSearchItems(searchItems);
        searchDto.setSearchType(SearchType.getFromValue(info.searchForm).name());
        return searchDto;
    }
}
