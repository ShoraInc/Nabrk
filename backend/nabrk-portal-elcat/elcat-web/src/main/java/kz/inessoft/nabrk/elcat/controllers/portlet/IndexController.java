//package kz.inessoft.nabrk.elcat.controllers.portlet;
//
//import com.ibm.ws.portletcontainer.portlet.PortletUtils;
//import kz.inessoft.nabrk.dao.api.Role;
//import kz.inessoft.nabrk.dao.dto.MCatalogueType;
//import kz.inessoft.nabrk.dao.dto.MOrderForm;
//import kz.inessoft.nabrk.dao.dto.UserSearchFilterInfo;
//import kz.inessoft.nabrk.dao.repository.CountryRepository;
//import kz.inessoft.nabrk.dao.repository.LangRepository;
//import kz.inessoft.nabrk.dao.repository.OrderRepository;
//import kz.inessoft.nabrk.dao.repository.PublicationTypeRepository;
//import kz.inessoft.nabrk.dao.repository.ReaderRepository;
//import kz.inessoft.nabrk.dao.repository.RubricRepository;
//import kz.inessoft.nabrk.dao.repository.SearchUdcTreeRepository;
//import kz.inessoft.nabrk.dao.repository.SphereRepository;
//import kz.inessoft.nabrk.dao.repository.UDCRepository;
//import kz.inessoft.nabrk.dao.repository.UserSearchFilterRepository;
//import kz.inessoft.nabrk.elcat.dto.SearchDto;
//import kz.inessoft.nabrk.elcat.controllers.service.BRSearchResult;
//import kz.inessoft.nabrk.elcat.controllers.service.SearchService;
//import kz.inessoft.nabrk.elcat.dto.MAdvancedSearchForm;
//import kz.inessoft.nabrk.elcat.dto.MAdvancedSearchItem;
//import kz.inessoft.nabrk.elcat.dto.MCatalogueItem;
//import kz.inessoft.nabrk.elcat.dto.MFilterInfo;
//import kz.inessoft.nabrk.elcat.dto.MPageable;
//import kz.inessoft.nabrk.elcat.dto.MRefinementForm;
//import kz.inessoft.nabrk.elcat.dto.MSimpleSearchForm;
//import kz.inessoft.nabrk.elcat.infrastructure.utils.Constants;
//import kz.inessoft.nabrk.solr.domain.Field;
//import kz.inessoft.nabrk.solr.domain.Filter;
//import kz.inessoft.nabrk.solr.domain.GroupField;
//import kz.inessoft.nabrk.solr.domain.Operation;
//import kz.inessoft.nabrk.solr.service.SolrSearchService;
//import org.apache.solr.client.solrj.SolrServerException;
//import org.codehaus.jackson.map.ObjectMapper;
//import org.codehaus.jackson.map.type.TypeFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.ModelAttribute;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.portlet.ModelAndView;
//import org.springframework.web.portlet.bind.annotation.ActionMapping;
//import org.springframework.web.portlet.bind.annotation.RenderMapping;
//
//import javax.portlet.ActionRequest;
//import javax.portlet.ActionResponse;
//import javax.portlet.PortletRequest;
//import javax.portlet.RenderRequest;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletRequestWrapper;
//import java.io.IOException;
//import java.util.*;
//import java.util.regex.Pattern;
//
//import static kz.inessoft.nabrk.elcat.dto.MRefinementForm.COUNTRY_FIELD;
//import static kz.inessoft.nabrk.elcat.dto.MRefinementForm.GENRE_FIELD;
//import static kz.inessoft.nabrk.elcat.dto.MRefinementForm.LANGUAGE_FIELD;
//import static kz.inessoft.nabrk.elcat.dto.MRefinementForm.PUBLICATIONTYPE_FIELD;
//import static kz.inessoft.nabrk.elcat.dto.MRefinementForm.TOPIC_FIELD;
//import static kz.inessoft.nabrk.elcat.dto.MRefinementForm.YEAR_FIELD;
//import static kz.inessoft.nabrk.solr.domain.Field.all;
//import static kz.inessoft.nabrk.solr.domain.Field.country_edition;
//import static kz.inessoft.nabrk.solr.domain.Field.language;
//import static kz.inessoft.nabrk.solr.domain.Field.publication_type;
//import static kz.inessoft.nabrk.solr.domain.Field.sphere;
//import static kz.inessoft.nabrk.solr.domain.Field.topic;
//import static kz.inessoft.nabrk.solr.domain.Field.udc;
//import static kz.inessoft.nabrk.solr.domain.Operation.AND;
//
//@Controller
//@RequestMapping(value = "view")
//public class IndexController {
//
//    private static final Pattern letterPatter = Pattern.compile("[0-9A-ZА-ЯӘҒҚҢӨҰҮҺЁІ]");
//
//    @Autowired
//    SearchService searchService;
//
//    @Autowired
//    SearchDto sessionStore;
//
//    @Autowired
//    UserSearchFilterRepository userSearchFilterRepository;
//
//    @Autowired
//    SearchUdcTreeRepository searchUdcTreeRepository;
//
//    @Autowired
//    LangRepository langRepository;
//
//    @Autowired
//    CountryRepository countryRepository;
//
//    @Autowired
//    SphereRepository sphereRepository;
//
//    @Autowired
//    PublicationTypeRepository publicationTypeRepository;
//
//    @Autowired
//    UDCRepository udcRepository;
//
//    @Autowired
//    RubricRepository rubricRepository;
//
//    @Autowired
//    OrderController orderController;
//
//    @Autowired
//    ElectronicController electronicController;
//
//    @Autowired
//    OrderRepository orderRepository;
//
//    @Autowired
//    ReaderRepository readerRepository;
//
//    @Autowired
//    SolrSearchService solrSearchService;
//
//    public HttpServletRequest getHttpServletRequest(PortletRequest request) {
//        HttpServletRequest httpServletRequest = PortletUtils.getHttpServletRequest((RenderRequest) request);
//        while (httpServletRequest instanceof HttpServletRequestWrapper) {
//            HttpServletRequestWrapper httpServletRequestWrapper =
//                    (HttpServletRequestWrapper) httpServletRequest;
//            httpServletRequest = (HttpServletRequest) httpServletRequestWrapper.getRequest();
//        }
//        return httpServletRequest;
//    }
//
//    @RenderMapping
//    public ModelAndView handleRenderRequest(RenderRequest request) throws SolrServerException, IOException {
//        HttpServletRequest httpServletRequest = getHttpServletRequest(request);
//        Integer hierarchyBrId = -1;
//        String remoteHost = httpServletRequest.getRemoteHost();
//        boolean isInnerUser = remoteHost.startsWith("10.0.1.") || remoteHost.startsWith("10.32.1.") || remoteHost.equals("192.168.1.140");
//
//        String linkSearchString = httpServletRequest.getParameter("search");
//
//        if (linkSearchString != null) {
//            sessionStore.getFilters().add(new Filter(AND, all, linkSearchString, linkSearchString));
//        }
//
//        String[] orderReadingRoomBrIds = httpServletRequest.getParameterValues("orderRR");
//        if (orderReadingRoomBrIds != null && orderReadingRoomBrIds.length > 0) {
//            Integer orderCount = orderRepository.getToDayReadingRoomOrderCount(request.getRemoteUser());
//            if (orderCount + orderReadingRoomBrIds.length >= 25) {
//                throw new RuntimeException("В один день можно заказать не более 25(двадцати пяти) книг");
//            }
//            for (String brId : orderReadingRoomBrIds) {
//                sessionStore.getReadingRoomBrIds().add(brId);
//            }
//            return orderController.handleRenderRequest(new MOrderForm(), request);
//        }
//
//        String[] orderElectronicBrIds = httpServletRequest.getParameterValues("orderEDD");
//        if (orderElectronicBrIds != null && orderElectronicBrIds.length > 0) {
//            Integer orderCount = orderRepository.getToDayElectronicOrderCount(request.getRemoteUser());
//            readerRepository.checkEmail(request.getRemoteUser());
//            if (orderCount + orderElectronicBrIds.length > 1) {
//                throw new RuntimeException("В один день можно заказать только одну книгу");
//            }
//            for (String brId : orderElectronicBrIds) {
//                sessionStore.getElectronicOrderBrIds().add(brId);
//            }
//            return electronicController.handleRenderRequest(request);
//        }
//
//        String filterIdString = httpServletRequest.getParameter("filterId");
//        if (filterIdString!=null && !filterIdString.isEmpty()) {
//            Integer filterId = Integer.valueOf(filterIdString);
//            UserSearchFilterInfo userSearchFilterInfo = userSearchFilterRepository.loadFilter(filterId);
//
//            ObjectMapper objectMapper = new ObjectMapper();
//            TypeFactory typeFactory = TypeFactory.defaultInstance();
//            List<Filter> filters = objectMapper.readValue(userSearchFilterInfo.filtersAsJson, typeFactory.constructCollectionType(List.class, Filter.class));
//
//            sessionStore.setSearchForm(userSearchFilterInfo.searchForm);
//            sessionStore.setFilters(filters);
//        }
//        String rubricIdString = httpServletRequest.getParameter("rubricId");
//        String rubricName = "";
//        BRSearchResult searchResult;
//        List<String> titleFirstLetters = new LinkedList();
//        if (sessionStore.getSearchForm() == Constants.FULLTEXT_SEARCH) {
//            searchResult = searchService.getFullTextCatalogueItems(sessionStore.getFullTextSearchString(), sessionStore.getPage(), sessionStore.getLimit(),request.getLocale());
//        } else {
//            if (rubricIdString!= null && !rubricIdString.isEmpty() || sessionStore.getRubricId() != null) {
//                if (rubricIdString!= null && !rubricIdString.isEmpty()) {
//                    Integer rubricFromParam = Integer.parseInt(rubricIdString);
//                    if (!rubricFromParam.equals(sessionStore.getRubricId())) {
//                        clear();
//                        sessionStore.setRubricId(rubricFromParam);
//                    }
//                }
//                rubricName = rubricRepository.getRubricName(sessionStore.getRubricId(), request.getLocale().getLanguage());
//                searchResult = searchService.getRubricCatalogueItems(sessionStore.getRubricId(), sessionStore.getPage(), sessionStore.getLimit(), request.getLocale());
//            } else if (Constants.HIERARCHY_SEARCH == sessionStore.getSearchForm()) {
//                searchResult = searchService.getCatalogueItemsByHierarchy(sessionStore.getHierarchyBrId(), sessionStore.getPage(), sessionStore.getLimit(), request.getLocale());
//                hierarchyBrId = sessionStore.getHierarchyBrId();
//            } else {
//                searchResult = searchService.getCatalogueItems(sessionStore.getFilters(),sessionStore.getPage(),sessionStore.getLimit(), request.getLocale());
//                List<GroupField> groupByNabrk = solrSearchService.getGroupByNabrk(sessionStore.getFilters(), Field.title_first_letter);
//                titleFirstLetters = fillTitles(groupByNabrk);
//            }
//        }
//        if (sessionStore.getSearchForm() != Constants.HIERARCHY_SEARCH) {
//            sessionStore.setPreviousSearchForm(sessionStore.getSearchForm());
//        }
//
//
//        for (MCatalogueItem catalogItem : searchResult.brItems) {
//            catalogItem.setReadingroom(sessionStore.getReadingRoomBrIds().contains(String.valueOf(catalogItem.getId())));
//            catalogItem.setElectronicOrder(sessionStore.getElectronicOrderBrIds().contains(String.valueOf(catalogItem.getId())));
//            catalogItem.setExhibition(sessionStore.getExhibitionBrIds().contains(catalogItem.getId()));
//            catalogItem.setChecked(sessionStore.isCheckAll() || sessionStore.getCheckedBrIds().contains(catalogItem.getId())?"checked" : "");
//        }
//
//        List<MCatalogueItem> brList = searchResult.brItems;
//
//        ModelAndView view = new ModelAndView("index");
//        view.addObject("lang", request.getLocale().getLanguage());
//        view.addObject("CatalogueTypeList", sessionStore.getCatalogueTypeList().getCatalogueTypeList(request.getLocale()));
//        view.addObject("SearchFormNames", Constants.getSearchFormName(request.getLocale()));
//        view.addObject("SearchFieldList", Field.getSearchedFieldList(request.getLocale(), request.isUserInRole(Role.employees.name())));
//        view.addObject("filterInfoList",getMFilterInfoList(sessionStore.getFilters(), request.getLocale()));
//
//        view.addObject("MSimpleSearchForm",sessionStore.getSimpleSearchForm());
//        view.addObject("MAdvancedSearchForm",sessionStore.getAdvancedSearchForm());
//        view.addObject("MRefinementForm",new MRefinementForm());
//        view.addObject("SearchForm",sessionStore.getSearchForm());
//        view.addObject("rubricName",rubricName);
//        view.addObject("hierarchyBrId", hierarchyBrId);
//
//        if (sessionStore.getSearchForm() == Constants.FULLTEXT_SEARCH) {
//            String text = sessionStore.getFullTextSearchString();
//            view.addObject("Searched", text!=null && !text.isEmpty());
//        } else {
//            boolean searched = !(sessionStore.getFilters().isEmpty() || onlyCatatlogFilter());
//            view.addObject("Searched", searched);
//        }
//
//        view.addObject("isInnerUser",isInnerUser);
//        view.addObject("BRList", brList);
//        view.addObject("titleFirstLetters",titleFirstLetters);
//
//        view.addObject("BRPages", MPageable.getPages(sessionStore.getLimit(), sessionStore.getPage(), searchResult.count));
//        view.addObject("PageCount", MPageable.getPageCount(sessionStore.getLimit(), searchResult.count).intValue());
//        view.addObject("CurrentPage", sessionStore.getPage());
//        view.addObject("Limit", sessionStore.getLimit());
//        view.addObject("BrView", sessionStore.getBrView());
//        view.addObject("checkAll",sessionStore.isCheckAll());
//        view.addObject("resultSize", searchResult.count);
//        view.addObject("isAuth",request.getRemoteUser()!=null);
//
//        if (Constants.HIERARCHY_SEARCH == sessionStore.getSearchForm()) {
//            final List<MCatalogueItem> catalogueItems = searchService.getCatalogueItems(Collections.singletonList(sessionStore.getHierarchyBrId()), request.getLocale(), null);
//            view.addObject("BRHierarchyList", catalogueItems);
//        }
//
//        if (Constants.ADVANCED_SEARCH == sessionStore.getSearchForm()) {
//            view.addObject("languageList", langRepository.getLangAsMap(request.getLocale()));
//        } else if (sessionStore.getSearchForm() == Constants.UDC_SEARCH) {
//            view.addObject("UDCTree", searchUdcTreeRepository.getUDCTree());
//        } else if (sessionStore.getSearchForm() == Constants.FULLTEXT_SEARCH) {
//            view.addObject("searchString", sessionStore.getFullTextSearchString());
//        }
//        return view;
//    }
//
//    private boolean onlyCatatlogFilter() {
//        for (Filter filter : sessionStore.getFilters()) {
//            if (filter.filterType != Filter.CATALOG_FILTER_TYPE) {
//                return false;
//            }
//        }
//        return true;
//    }
//
//    private List<String> fillTitles(List<GroupField> groupByNabrk) {
//        TreeSet<String> titleFirstLetters = new TreeSet<String>();
//        for (GroupField groupField : groupByNabrk) {
//            String letter = groupField.code;
//            if (letter==null) continue;
//            if (letterPatter.matcher(letter).matches()) {
//                titleFirstLetters.add(letter);
//            }
//        }
//        return new ArrayList<String>(titleFirstLetters);
//    }
//
//    public List<MFilterInfo> getMFilterInfoList(List<Filter> filters,Locale locale) {
//        List<MFilterInfo> filterInfoList = new LinkedList<MFilterInfo>();
//        for (Filter filter : filters) {
//            MFilterInfo filterInfo = new MFilterInfo();
//            filterInfo.index = filters.indexOf(filter);
//            filterInfo.caption = filter.caption(locale);
//            filterInfoList.add(filterInfo);
//        }
//        return filterInfoList;
//    }
//
//    @ActionMapping(params = "action=SelectSearchForm")
//    public void handleSelectSearchForm(@RequestParam("id")Short id) {
//        sessionStore.getFilters().clear();
//        sessionStore.setPage(1);
//        sessionStore.getSimpleSearchForm().clear();
//        sessionStore.getAdvancedSearchForm().clear();
//        sessionStore.setRubricId(null);
//        if (id < 6) sessionStore.setSearchForm(id);
//    }
//
//    @ActionMapping(params = "action=clear")
//    public void clear() {
//        sessionStore.setFullTextSearchString("");
//        sessionStore.getFilters().clear();
//        sessionStore.setPage(1);
//        sessionStore.setRubricId(null);
//        sessionStore.setSearchForm(Constants.SIMPLE_SEARCH);
//    }
//
//    @ActionMapping(params = "action=FullTextSearchForm")
//    public void handlerFullTestSearchForm(ActionRequest request, ActionResponse response) throws Exception {
//        sessionStore.setSearchForm(Constants.FULLTEXT_SEARCH);
//        sessionStore.getFilters().clear();
//        sessionStore.setPage(1);
//        sessionStore.setRubricId(null);
//        sessionStore.setFullTextSearchString(request.getParameter("searchString"));
//    }
//
//    @ActionMapping(params = "action=changeLimit")
//    public void handlerChangeLimit(@RequestParam("limit")Integer limit) throws Exception {
//        if (limit>30) throw new IllegalArgumentException("limit can't greet 30");
//        sessionStore.setLimit(limit);
//    }
//
//    @ActionMapping(params = "action=hierarchy")
//    public void handlerHierarchy(@RequestParam("HierarchyBrId")Integer hierarchyBrId) throws Exception {
//        sessionStore.setSearchForm(Constants.HIERARCHY_SEARCH);
//        sessionStore.setHierarchyBrId(hierarchyBrId);
//    }
//
//    @ActionMapping(params = "action=firstLetterSeach")
//    public void handlerFirstLetterSearch(@RequestParam("firstLetter")String firstLetter) throws Exception {
//        sessionStore.getFilters().add(Filter.startWith(Field.title_first_letter,firstLetter));
//    }
//
//    @ActionMapping(params = "action=SimpleSearchForm")
//    public void handleSimpleSearchForm(@ModelAttribute("MSimpleSearchForm") MSimpleSearchForm simpleSearchForm) {
//        sessionStore.setSimpleSearchForm(simpleSearchForm);
//        sessionStore.setRubricId(null);
//
//        if (!sessionStore.getSimpleSearchForm().getSearchInFound()) {
//            addCatalogFilter();
//        }
//        String searchString = simpleSearchForm.getSearchString();
//        if (searchString!=null && !searchString.isEmpty()) {
//            Field field = Field.valueOf(simpleSearchForm.getField());
//            Filter filter = new Filter(AND,field, searchString, searchString);
//            sessionStore.getFilters().add(filter);
//        }
//    }
//
//    private void addCatalogFilter() {
//        sessionStore.getFilters().clear();
//        List<Integer> catalogIdList = new LinkedList<Integer>();
//        List<String> catalogNameList = new LinkedList<String>();
//        if (!sessionStore.getCatalogueTypeList().searchInAllCatalog()) {
//            for (MCatalogueType catalogueType : sessionStore.getCatalogueTypeList().getCatalogueTypeList()) {
//                if (catalogueType.getChecked() && catalogueType.getId() != 0) {
//                    catalogIdList.add(catalogueType.getId());
//                    catalogNameList.add(catalogueType.getName());
//                }
//            }
//        }
//        if (!catalogIdList.isEmpty()) {
//            Filter catalogFilter = new Filter(catalogIdList,catalogNameList);
//            sessionStore.getFilters().add(catalogFilter);
//        }
//    }
//
//    @ActionMapping(params = "action=AdvancedSearchForm")
//    public void handleAdvancedSearchForm(@ModelAttribute MAdvancedSearchForm advancedSearchForm,
//                                         Locale locale) {
//        sessionStore.setAdvancedSearchForm(advancedSearchForm);
//        sessionStore.getFilters().clear();
//        sessionStore.setRubricId(null);
//
//        for (MAdvancedSearchItem item : advancedSearchForm.getAdvancedSearchItems()) {
//            Field field = Field.valueOf(item.getField());
//            Operation operation = Operation.valueOf(item.getOperator());
//            String value = item.getValue();
//            if (value!=null && !value.isEmpty()) {
//                Filter equalsFilter = new Filter(operation,field, value, value);
//                sessionStore.getFilters().add(equalsFilter);
//            }
//        }
//        Filter yearFilter = new Filter(AND,advancedSearchForm.getFromYear(),advancedSearchForm.getToYear());
//        sessionStore.getFilters().add(yearFilter);
//
//        String language = advancedSearchForm.getLanguage();
//        if (language!=null && !language.isEmpty() ) {
//            Filter equalsFilter = getLanguageFilter(sessionStore.getFilters());
//            if (equalsFilter!=null) sessionStore.getFilters().remove(equalsFilter);
//            if (!language.equals("000") ) {
//                sessionStore.getFilters().add(new Filter(AND,Field.language,language,langRepository.getValueLang(language, locale)));
//            }
//        }
//
//        sessionStore.setBrView(advancedSearchForm.getBrView());
//        sessionStore.setLimit(advancedSearchForm.getLimit());
//    }
//
//    private Filter getLanguageFilter(List<Filter> filters) {
//        for (Filter filter : filters) {
//            if (filter.field!=null && filter.field == Field.language) {
//                return filter;
//            }
//        }
//        return null;
//    }
//
//    @ActionMapping(params = "action=UDCSearchForm")
//    public void handleUDCSearchForm(@RequestParam("TreeNodeID") String udcCode) {
//        sessionStore.getFilters().clear();
//        sessionStore.setPage(1);
//        sessionStore.setRubricId(null);
//        sessionStore.getFilters().add(new Filter(AND,udc,udcCode,udcCode));
//    }
//
//    @ActionMapping(params = "action=Pagination")
//    public void handlePagination(@RequestParam("CurrentPage") Integer currentPage) {
//        sessionStore.setPage(currentPage);
//    }
//
//    @ActionMapping(params = "action=PaginationButton")
//    public void handlePaginationButton(@RequestParam("BrView") Integer brView)  {
//        sessionStore.setBrView(brView);
//    }
//
//    @ActionMapping(params = "action=CatalogueTypeList")
//    public void handleCatalogueTypeList(@RequestParam("CatalogueTypeID") Integer CatalogueTypeID) {
//        sessionStore.getCatalogueTypeList().setChecked(CatalogueTypeID);
//        addCatalogFilter();
//    }
//
//    @ActionMapping(params = "action=RefinementForm")
//    public void handlerRefinementForm(@ModelAttribute("MRefinementForm") MRefinementForm form,
//                                      Locale locale) {
//        sessionStore.setPage(1);
//        List<Filter> filters = sessionStore.getFilters();
//        switch (form.getField()) {
//            case COUNTRY_FIELD : filters.add(new Filter(AND, country_edition, form.getCountry(),countryRepository.getCountryValue(form.getCountry(), locale))); break;
//            case GENRE_FIELD : filters.add(new Filter(AND, sphere, form.getGenre().toString(),sphereRepository.getSphere(String.valueOf(form.getGenre()), locale))); break;
//            case LANGUAGE_FIELD : filters.add(new Filter(AND, language, form.getLanguage(),langRepository.getValueLang(form.getLanguage(), locale))); break;
//            case PUBLICATIONTYPE_FIELD : filters.add(new Filter(AND, publication_type, form.getPublicationType().toString(),publicationTypeRepository.getPublicationTypeName(form.getPublicationType(), locale.getLanguage()))); break;
//            case TOPIC_FIELD : filters.add(new Filter(AND, topic, form.getTopic(),udcRepository.getTopicValue(form.getTopic()))); break;
//            case YEAR_FIELD : replaceYearFilter(filters,form.getFromYear(), form.getToYear()); break;
//        }
//    }
//
//    @ActionMapping(params = "action=doFilterForm")
//    public void handlerFilterForm(@RequestParam("filterIndex") Integer filterIndex) {
//        sessionStore.getFilters().remove(filterIndex.intValue());
//    }
//
//    @ActionMapping(params = "action=returnFromHierarchy")
//    public void handleReturnFromHierarchy(@RequestParam("param1") Integer param1) {
//        sessionStore.setSearchForm(sessionStore.getPreviousSearchForm());
//    }
//
//    @ExceptionHandler(Exception.class)
//    public ModelAndView handleException(Exception exception) {
//        ModelAndView view = new ModelAndView("error");
//        view.addObject("error", exception.getLocalizedMessage());
//        return view;
//    }
//
//    private void replaceYearFilter(List<Filter> filters,Integer fromYear, Integer toYear) {
//        Filter yearFilter = getYearFilter(filters);
//        if (yearFilter == null) {
//            yearFilter = new Filter(AND,fromYear,toYear);
//            filters.add(yearFilter);
//        } else {
//            yearFilter.startYear = fromYear;
//            yearFilter.endYear = toYear;
//        }
//    }
//
//    private Filter getYearFilter(List<Filter> filters) {
//        for (Filter filter : filters) {
//            if (filter.filterType == Filter.YEAR_FILTER_TYPE) {
//                return filter;
//            }
//        }
//        return null;
//    }
//}
