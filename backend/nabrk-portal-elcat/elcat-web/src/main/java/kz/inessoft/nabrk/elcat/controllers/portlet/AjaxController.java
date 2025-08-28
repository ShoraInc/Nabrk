//package kz.inessoft.nabrk.elcat.controllers.portlet;
//
//import kz.inessoft.nabrk.dao.dto.SearchResult;
//import kz.inessoft.nabrk.dao.dto.TreeNode;
//import kz.inessoft.nabrk.dao.repository.ArRepository;
//import kz.inessoft.nabrk.dao.repository.CountryRepository;
//import kz.inessoft.nabrk.dao.repository.FavoriteBrRepository;
//import kz.inessoft.nabrk.dao.repository.LangRepository;
//import kz.inessoft.nabrk.dao.repository.OrderRepository;
//import kz.inessoft.nabrk.dao.repository.PublicationTypeRepository;
//import kz.inessoft.nabrk.dao.repository.ReaderRepository;
//import kz.inessoft.nabrk.dao.repository.SphereRepository;
//import kz.inessoft.nabrk.dao.repository.SubscriptionRepository;
//import kz.inessoft.nabrk.dao.repository.UDCRepository;
//import kz.inessoft.nabrk.dao.repository.UserSearchFilterRepository;
//import kz.inessoft.nabrk.elcat.controllers.service.SearchService;
//import kz.inessoft.nabrk.elcat.dto.MBasketCount;
//import kz.inessoft.nabrk.elcat.dto.MCatalogueItem;
//import kz.inessoft.nabrk.elcat.dto.MRefinementForm;
//import kz.inessoft.nabrk.elcat.dto.MRefinementItem;
//import kz.inessoft.nabrk.elcat.infrastructure.utils.Constants;
//import kz.inessoft.nabrk.solr.domain.Field;
//import kz.inessoft.nabrk.solr.domain.GroupField;
//import kz.inessoft.nabrk.solr.domain.SolrSearchResult;
//import kz.inessoft.nabrk.solr.service.SolrSearchService;
//import org.apache.poi.xssf.usermodel.XSSFRow;
//import org.apache.poi.xssf.usermodel.XSSFSheet;
//import org.apache.poi.xssf.usermodel.XSSFWorkbook;
//import org.apache.poi.xwpf.usermodel.XWPFDocument;
//import org.apache.poi.xwpf.usermodel.XWPFTable;
//import org.apache.poi.xwpf.usermodel.XWPFTableRow;
//import org.apache.solr.client.solrj.SolrServerException;
//import org.codehaus.jackson.map.ObjectMapper;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.portlet.bind.annotation.ResourceMapping;
//
//import javax.portlet.ResourceRequest;
//import javax.portlet.ResourceResponse;
//import java.io.IOException;
//import java.io.OutputStream;
//import java.util.Collection;
//import java.util.LinkedList;
//import java.util.List;
//import java.util.Locale;
//import java.util.ResourceBundle;
//
//@Controller
//@RequestMapping(value = "view", params = "view=ajax")
//public class AjaxController {
//
//    public static final int MAX_EXPORT_COUNT = 1000;
//
//    @Autowired
//    SessionStore sessionStore;
//
//    @Autowired
//    SolrSearchService solrSearchService;
//
//    @Autowired
//    SearchService searchService;
//
//    @Autowired
//    FavoriteBrRepository favoriteBrRepository;
//
//    @Autowired
//    OrderRepository orderRepository;
//
//    @Autowired
//    UserSearchFilterRepository userSearchFilterRepository;
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
//    ReaderRepository readerRepository;
//
//    @Autowired
//    SubscriptionRepository subscriptionRepository;
//
//    @Autowired
//    ArRepository arRepository;
//
//    @ResourceMapping("refinement")
//    public void handleRefinement(@RequestParam("RefinementType") Integer refType,
//                                 ResourceRequest request,
//                                 ResourceResponse response) throws IOException, SolrServerException {
//
//        final Field field = getField(refType);
//
//        List<GroupField> groupFields = solrSearchService.getGroupByNabrk(sessionStore.getFilters(), field);
//
//        List<MRefinementItem> refinementItems = new LinkedList<MRefinementItem>();
//        for (GroupField groupField : groupFields) {
//            if (field == Field.topic && "4".equals(groupField.code)) continue; // 4 кода нет в УДК
//            if (field == Field.sphere && "0".equals(groupField.code)) continue;
//            String value = getRefinementValue(groupField.code,refType,request.getLocale());
//            MRefinementItem refinementItem = new MRefinementItem();
//            refinementItem.setCount(groupField.count);
//            refinementItem.setKey(groupField.code);
//            refinementItem.setType(refType.toString());
//            refinementItem.setDisabled(false);
//            refinementItem.setValue(value);
//            refinementItems.add(refinementItem);
//        }
//        write(response,refinementItems);
//    }
//
//    private Field getField(Integer refType) {
//        switch (refType) {
//            case MRefinementForm.LANGUAGE_FIELD : return Field.language;
//            case MRefinementForm.COUNTRY_FIELD : return Field.country_edition;
//            case MRefinementForm.PUBLICATIONTYPE_FIELD : return Field.publication_type;
//            case MRefinementForm.TOPIC_FIELD : return Field.topic;
//            case MRefinementForm.GENRE_FIELD : return Field.sphere;
//            default:
//                String message = String.format("Refinement type %s not found",refType);
//                throw new RuntimeException(message);
//        }
//    }
//
//    private String getUnknown(Locale locale) {
//        if (Constants.LOCALE_RU.equals(locale.getLanguage())) {
//            return  "Не указано";
//        } else if (Constants.LOCALE_EN.equals(locale.getLanguage())) {
//            return  "Unknown";
//        } else {
//            return  "Көрсетілмеген";
//        }
//    }
//
//
//    public String getRefinementValue(String groupValue, Integer refType, Locale locale) {
//        if (groupValue==null || groupValue.isEmpty()) return getUnknown(locale);
//
//        switch (refType) {
//            case MRefinementForm.LANGUAGE_FIELD : return langRepository.getValueLang(groupValue, locale);
//            case MRefinementForm.COUNTRY_FIELD : return countryRepository.getCountryValue(groupValue, locale);
//            case MRefinementForm.PUBLICATIONTYPE_FIELD : return publicationTypeRepository.getPublicationTypeName(Short.valueOf(groupValue), locale.getLanguage());
//            case MRefinementForm.TOPIC_FIELD : return udcRepository.getTopicValue(groupValue);
//            case MRefinementForm.GENRE_FIELD : return sphereRepository.getSphere(groupValue, locale);
//            default:
//                String message = String.format("Refinement type %s not found",refType);
//                throw new RuntimeException(message);
//        }
//    }
//
//    @ResourceMapping("addToBasket")
//    public void processRequest(@RequestParam("brId") String orderBrId,
//                               @RequestParam("controlType") Integer controlType,
//                               @RequestParam("isActive") Boolean isActive,
//                               ResourceRequest resourceRequest,
//                               ResourceResponse resourceResponse) throws IOException {
//
//        if (!isActive) {
//            if (controlType==1) {
//                Integer orderCount = orderRepository.getToDayReadingRoomOrderCount(resourceRequest.getRemoteUser());
//                if (orderCount+sessionStore.getReadingRoomBrIds().size()>=25) {
//                    write(resourceResponse,"В один день можно заказать не более 25(двадцати пяти) книг");
//                    return;
//                }
//            }
//
//            if (controlType==2) {
//                Integer orderCount = orderRepository.getToDayElectronicOrderCount(resourceRequest.getRemoteUser());
//                try {
//                    readerRepository.checkEmail(resourceRequest.getRemoteUser());
//                } catch (Exception e) {
//                    write(resourceResponse,e.getMessage());
//                    return;
//                }
//                if (orderCount+sessionStore.getElectronicOrderBrIds().size()>=1) {
//                    write(resourceResponse,"В один день можно заказать только одну книгу");
//                    return;
//                }
//            }
//        }
//
//        Integer brId= Integer.valueOf(orderBrId.split("_")[0]);
//        if (isActive) {
//            switch (controlType) {
//                case 1 : sessionStore.getReadingRoomBrIds().remove(orderBrId); break;
//                case 2 : sessionStore.getElectronicOrderBrIds().remove(orderBrId); break;
//                case 3 : favoriteBrRepository.removeFavorite(brId);break;
//                default:
//                    String message = String.format("controlType %s not implement",controlType);
//                    throw new RuntimeException(message);
//            }
//        } else {
//            switch (controlType) {
//                case 1 : sessionStore.getReadingRoomBrIds().add(orderBrId); break;
//                case 2 : sessionStore.getElectronicOrderBrIds().add(orderBrId); break;
//                case 3 : favoriteBrRepository.addFavorite(brId);break;
//                default:
//                    String message = String.format("controlType %s not implement",controlType);
//                    throw new RuntimeException(message);
//            }
//        }
//        write(resourceResponse,"success");
//    }
//
//    @ResourceMapping("basketCount")
//    public void requestBasketCount(ResourceResponse response) throws IOException {
//        MBasketCount result = new MBasketCount();
//        result.setOrderCount(sessionStore.getReadingRoomBrIds().size());
//        result.setExhibitionCount(sessionStore.getExhibitionBrIds().size());
//        result.setElectronicCount(sessionStore.getElectronicOrderBrIds().size());
//        result.setFavoriteCount(favoriteBrRepository.getFavoriteCount());
//        write(response, result);
//    }
//
//    @ResourceMapping("checkAll")
//    public void checkAll(@RequestParam("checked")Boolean checked) throws IOException {
//        sessionStore.setCheckAll(checked);
//        sessionStore.getCheckedBrIds().clear();
//    }
//
//    @ResourceMapping("suggest")
//    public void suggest(@RequestParam("fieldName") String fieldName,
//                        @RequestParam("searchText") String prefix,
//                        ResourceResponse response) throws IOException, SolrServerException {
//        Field field = Field.valueOf(fieldName);
//        List<String> suggest = solrSearchService.suggest(field, prefix);
//        write(response, suggest);
//    }
//
//    @ResourceMapping("checkedBr")
//    public void checkBr(@RequestParam("checked")Boolean checked,
//                        @RequestParam("brId") Integer brId) throws IOException {
//        if (!checked) sessionStore.setCheckAll(false);
//        if (checked) {
//            sessionStore.getCheckedBrIds().add(brId);
//        } else {
//            sessionStore.getCheckedBrIds().remove(brId);
//        }
//    }
//
//    @ResourceMapping("exportToWord")
//    public void handleExportWord(ResourceRequest request, ResourceResponse response) throws IOException, SolrServerException {
//        XWPFDocument document = new XWPFDocument();
//
//        XWPFTable table = document.createTable();
//        XWPFTableRow headerRow = table.createRow();
//        headerRow.createCell().setText("№");
//        headerRow.createCell().setText("Описание");
//
//        List<MCatalogueItem> catalogItems = getCatalogueItems(request);
//        for (MCatalogueItem catalogItem : catalogItems) {
//            XWPFTableRow tableRow = table.createRow();
//            tableRow.createCell().setText(catalogItem.getId().toString());
//            tableRow.createCell().setText(catalogItem.getAuthors()
//                            + "\n\n" + catalogItem.getName()
//                            + "\n\n" + catalogItem.getUdc()
//                            + "\n\n" + catalogItem.getShelfCode()
//                            + "\n\n" + catalogItem.getU330$a()
//                            + "\n\n" + catalogItem.getKeywords()
//            );
//        }
//        response.setContentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
//        document.write(response.getPortletOutputStream());
//    }
//
//    private List<MCatalogueItem> getCatalogueItems(ResourceRequest request) throws SolrServerException {
//        final Collection<Integer> brIds;
//        if (sessionStore.isCheckAll()) {
//            if (sessionStore.getRubricId() == null) {
//                SolrSearchResult result = solrSearchService.searchNabrkPage(sessionStore.getFilters(), 1, MAX_EXPORT_COUNT);
//                brIds = result.brIds;
//            } else {
//                SearchResult result = searchService.getRubricCatalogueItems(sessionStore.getRubricId());
//                brIds = result.idList;
//            }
//            if (brIds.size() > MAX_EXPORT_COUNT) {
//                String message = String.format("Вы не можете экспотировать свыше %s записей, уточните поиск",MAX_EXPORT_COUNT);
//                throw new RuntimeException(message);
//            }
//        } else {
//            brIds = sessionStore.getCheckedBrIds();
//        }
//
//        return searchService.getCatalogueItems(brIds, request.getLocale(), null);
//    }
//
//    @ResourceMapping("exportToExcel")
//     public void handleExportExcel(ResourceRequest request, ResourceResponse response) throws IOException, SolrServerException {
//        XSSFWorkbook wb = new XSSFWorkbook();
//        XSSFSheet sheet = wb.createSheet();
//        XSSFRow headerRow = sheet.createRow(0);
//
//        headerRow.createCell(0).setCellValue("№");
//        headerRow.createCell(1).setCellValue("Описание");
//
//        List<MCatalogueItem> catalogItems = getCatalogueItems(request);
//        int i =1;
//        for (MCatalogueItem catalogItem : catalogItems) {
//            XSSFRow row = sheet.createRow(i++);
//            row.createCell(0).setCellValue(catalogItem.getId().toString());
//            row.createCell(1).setCellValue(catalogItem.getAuthors()
//                            + "\n\n" + catalogItem.getName()
//                            + "\n\n" + catalogItem.getUdc()
//                            + "\n\n" + catalogItem.getShelfCode()
//                            + "\n\n" + catalogItem.getU330$a()
//                            + "\n\n" + catalogItem.getKeywords()
//            );
//        }
//        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//        wb.write(response.getPortletOutputStream());
//    }
//
//    @ResourceMapping("saveQuery")
//    public void saveQuery(@RequestParam("filterName") String filterName,
//                          ResourceResponse response) throws IOException {
//        try {
//            ObjectMapper objectMapper = new ObjectMapper();
//            String filterBody = new String(objectMapper.writeValueAsBytes(sessionStore.getFilters()),"UTF-8");
//            userSearchFilterRepository.saveUserSearchFilter(filterName, filterBody, sessionStore.getSearchForm());
//            response.getWriter().write("SUCCESS");
//        } catch (Exception e) {
//            response.getWriter().write(e.getLocalizedMessage());
//        }
//    }
//
//    @ResourceMapping("periodicInfoTree")
//    public void requestPeriodicInfoTree(@RequestParam("brID") Integer brID,
//                                        ResourceRequest resourceRequest,
//                                        ResourceResponse resourceResponse) throws IOException {
//        List<TreeNode> tree = subscriptionRepository.getPeriodicYearsAndNumbersTree(brID);
//        List<TreeNode> result = new LinkedList<TreeNode>();
//        for (TreeNode level1Node : tree) {
//            result.add(level1Node);
//            result.addAll(level1Node.children);
//            for (TreeNode child : level1Node.children) {
//                child.value = parseAndLocalizePeriodicDate(child.value, resourceRequest.getLocale());
//            }
//        }
//        write(resourceResponse, result);
//    }
//
//    @ResourceMapping("arCard")
//    public void requestArCard(@RequestParam("arID") Integer arID,
//                                        ResourceRequest resourceRequest,
//                                        ResourceResponse resourceResponse) throws IOException {
//        String arCard = arRepository.getCardView(arID);
//        resourceResponse.getWriter().write(arCard);
//    }
//
//    private String parseAndLocalizePeriodicDate(String value, Locale locale) {
//        if (value == null || value.isEmpty()) return "";
//
//        if (value.contains("-")) {
//               return localizePeriod(value, locale);
//        } else {
//            if (value.contains(".")) {
//                String[] dayMonth = value.split("\\.");
//                return localizeDayAndMonth(dayMonth[0], dayMonth[1], locale);
//            } else {
//                return localizeOnlyMonth(value, locale);
//            }
//        }
//    }
//
//    private String localizeOnlyMonth(String monthCode, Locale locale) {
//        return ResourceBundle.getBundle("kz.inessoft.nabrk.elcat.Language-ext", locale).getString("month."+monthCode);
//    }
//
//    private String localizeDayAndMonth(String day, String monthCode, Locale locale) {
//        if (locale.toString().equals("ru")) {
//            return day + " " + ResourceBundle.getBundle("kz.inessoft.nabrk.elcat.Language-ext", locale).getString("monthFrom." + monthCode);
//        } else {
//            return day + " " + ResourceBundle.getBundle("kz.inessoft.nabrk.elcat.Language-ext", locale).getString("month." + monthCode);
//        }
//    }
//
//    private String localizePeriod(String period, Locale locale) {
//        String[] parts = period.split("-");
//        if (period.contains(".")) {
//            String[] start = parts[0].split("\\.");
//            String[] end = parts[1].split("\\.");
//            String startDay = start[0];
//            String startMonth = start[1];
//            String endDay = end[0];
//            String endMonth = end[1];
//            if (locale.toString().equals("kk")) {
//                String localized = startDay + " " + ResourceBundle.getBundle("kz.inessoft.nabrk.elcat.Language-ext", locale).getString("monthFrom." + startMonth)
//                        + " - " + endDay + " " + ResourceBundle.getBundle("kz.inessoft.nabrk.elcat.Language-ext", locale).getString("monthTo." + endMonth);
//                return localized;
//            } else {
//                return localizeDayAndMonth(startDay, startMonth, locale) + " - " + localizeDayAndMonth(endDay, endMonth, locale);
//            }
//        } else {
//            return localizeOnlyMonth(parts[0], locale) + " - " + localizeOnlyMonth(parts[1], locale);
//        }
//    }
//
//    private void write(ResourceResponse response,Object object) throws IOException {
//        OutputStream stream = response.getPortletOutputStream();
//        ObjectMapper mapper = new ObjectMapper();
//        mapper.writeValue(stream, object);
//    }
//}
