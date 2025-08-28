package kz.inessoft.nabrk.elcat.controller;

import kz.inessoft.nabrk.dao.api.Role;
import kz.inessoft.nabrk.dao.api.SessionService;
import kz.inessoft.nabrk.dao.dto.SearchUdcTreeInfo;
import kz.inessoft.nabrk.dao.repository.SearchUdcTreeRepository;
import kz.inessoft.nabrk.elcat.controllers.service.BRSearchResult;
import kz.inessoft.nabrk.elcat.controllers.service.SearchService;
import kz.inessoft.nabrk.elcat.dao.api.ServletSessionInfo;
import kz.inessoft.nabrk.elcat.dto.SaveSearchDTO;
import kz.inessoft.nabrk.elcat.dto.SearchDTO;
import kz.inessoft.nabrk.elcat.dto.MPageable;
import kz.inessoft.nabrk.elcat.enums.SearchType;
import kz.inessoft.nabrk.solr.domain.Field;
import kz.inessoft.nabrk.solr.domain.Filter;
import kz.inessoft.nabrk.solr.domain.GroupField;
import kz.inessoft.nabrk.solr.domain.MRKeyValue;
import kz.inessoft.nabrk.solr.service.SolrSearchService;
import org.apache.solr.client.solrj.SolrServerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/view")
public class IndexController {
    private static final Pattern letterPatter = Pattern.compile("[0-9A-ZА-ЯӘҒҚҢӨҰҮҺЁІ]");

    @Autowired
    SearchService searchService;

    @Autowired
    SessionService sessionService;

    @Autowired
    SolrSearchService solrSearchService;

    @Autowired
    ServletSessionInfo servletSessionInfo;

    @Autowired
    SearchUdcTreeRepository searchUdcTreeRepository;


    @GetMapping("/SearchFieldList")
    public Map<String, String> getSearchFieldList(@RequestParam(name = "lang") Locale locale) {
        Map<String, String> collect = Field.getSearchedFieldList(locale, servletSessionInfo.isUserInRole(Role.employees.name())).stream()
                .collect(Collectors.toMap(MRKeyValue::getKey, MRKeyValue::getValue));
        return collect;
    }

    @PostMapping(value = "/Search")
    public Map<String, Object> getSearchResult(@RequestBody SearchDTO searchDto) throws SolrServerException {
        Map<String, Object> result = new HashMap<>();
        if (searchDto.getSearchType().toUpperCase().equals(SearchType.FULLTEXT.name())) {
            BRSearchResult searchResult = searchService.
                    getFullTextCatalogueItems(searchDto.getFullTextSearchText(), searchDto.getPage(), searchDto.getLimit(), searchDto.getLocale());
            result.put("BRList", searchResult.brItems);
            result.put("PageCount", MPageable.getPageCount(searchDto.getLimit(), searchResult.count).intValue());
            result.put("resultSize", searchResult.count);
            result.put("BRPages", MPageable.getPages(searchDto.getLimit(), searchDto.getPage(), searchResult.count));
            return result;
        }


        List<Filter> filters = searchService.getSearchFilters(searchDto);

        BRSearchResult searchResult = searchService.
                getCatalogueItems(filters, searchDto.getPage(), searchDto.getLimit(), searchDto.getLocale());
        result.put("BRList", searchResult.brItems);
        List<GroupField> groupByNabrk = solrSearchService.getGroupByNabrk(filters, Field.title_first_letter);
        result.put("TitleFirstLetters", searchService.fillTitles(groupByNabrk));
        result.put("PageCount", MPageable.getPageCount(searchDto.getLimit(), searchResult.count).intValue());
        result.put("ResultSize", searchResult.count);
        result.put("BRPages", MPageable.getPages(searchDto.getLimit(), searchDto.getPage(), searchResult.count));
        result.put("filterInfoList", searchService.getMFilterInfoList(filters, searchDto.getLocale()));
        if (!searchDto.getSearchType().toUpperCase().equals(SearchType.UDC.name())) {
            result.put("CatalogIdFilters", searchDto.getCatalogIdFilters());
        }
        result.put("SearchItems", searchDto.getSearchItems());
        result.put("RefinementItems", searchService.getRefinementItems(filters, searchDto.getLocale()));
        return result;
    }

    @GetMapping(value = "/GetUdcSearchTree")
    public ResponseEntity<?> getUdcSearchTree() {
        SearchUdcTreeInfo udcTreeInfo = searchUdcTreeRepository.getUDCTreeInfo();
        return ResponseEntity.ok(udcTreeInfo.getUdcTree());
    }


    @PostMapping(value = "/SaveQuery")
    public Map<Object, Object> saveFilters(@RequestBody SaveSearchDTO saveSearchDto) {
        if (sessionService.getUserName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        Map<Object, Object> result = new HashMap<>();
        int id = searchService.saveQuery(saveSearchDto);
        if (id == -1) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        result.put("filterId", id);
        result.put("searchType", saveSearchDto.getSearchType());
        return result;
    }

    @GetMapping("/ExecuteQuery")
    public Map<String, Object> executeQuery(@RequestParam Integer filterID,
                                            @RequestParam Locale locale) throws SolrServerException {
        SearchDTO searchDto = searchService.getSearchDtoFromSavedFilter(filterID);
        searchDto.setLocale(locale);
        return getSearchResult(searchDto);
    }

    @GetMapping("/Suggest")
    public List<String> suggest(@RequestParam("fieldName") String fieldName,
                                @RequestParam("searchText") String prefix){
        Field field = Field.valueOf(fieldName);
        try {
            return solrSearchService.suggest(field, prefix);
        } catch (SolrServerException e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/ArCard")
    public Map<Integer, String> requestArCard(@RequestParam("arID") Integer arID){
        String arCard = searchService.getArCardView(arID);
        Map<Integer, String> result = new HashMap<>();
        result.put(arID, arCard);
        return result;
    }
}
