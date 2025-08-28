package kz.inessoft.nabrk.elcat.controller;


import kz.inessoft.nabrk.dao.api.SessionService;
import kz.inessoft.nabrk.dao.dto.InsertElectronicOrderInfo;
import kz.inessoft.nabrk.dao.dto.MOrderForm;
import kz.inessoft.nabrk.dao.dto.OrderException;
import kz.inessoft.nabrk.dao.repository.DepRepository;
import kz.inessoft.nabrk.dao.repository.ElectronicOrderRepository;
import kz.inessoft.nabrk.dao.repository.FavoriteBrRepository;
import kz.inessoft.nabrk.dao.repository.OrderRepository;
import kz.inessoft.nabrk.dao.utils.MapStringParamProvider;
import kz.inessoft.nabrk.elcat.controllers.service.SearchService;
import kz.inessoft.nabrk.elcat.dto.BasketViewDTO;
import kz.inessoft.nabrk.elcat.dto.MElectronicForm;
import kz.inessoft.nabrk.elcat.dto.MElectronicItem;
import kz.inessoft.nabrk.elcat.infrastructure.utils.Constants;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("basket")
public class OrderController {

    @Autowired
    DepRepository depRepository;

    @Autowired
    SearchService searchService;

    @Autowired
    SessionService sessionService;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    FavoriteBrRepository favoriteBrRepository;

    @Autowired
    ElectronicOrderRepository electronicOrderRepository;


    @PostMapping("view")
    public Map<Object, Object> view(@RequestBody BasketViewDTO viewDto) {
        if (sessionService.getUserName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        Map<Object, Object> map = new HashMap<>();
        if (viewDto.getOrderType() == 1 && viewDto.getBrIds().size() > 25) {
            map.put("errorMessageRu", "В один день можно заказать не более двадцати пяти книг");
            map.put("errorMessageEn", "No more than twenty-five books can be ordered in one day");
            map.put("errorMessageKk", "Күніне жиырма бес кітаптан артық тапсырыс беруге болмайды");
            map.put("errorMessageLa", "Kúnine jıyrma bes kitaptan artyq tapsyrys berýge bolmaıdy");
        } else if (viewDto.getOrderType() == 2 && viewDto.getBrIds().size() > 5) {
            map.put("errorMessageRu", "В один день можно заказать не более пяти книг");
            map.put("errorMessageEn", "No more than five books can be ordered in one day");
            map.put("errorMessageKk", "Күніне бес кітаптан артық тапсырыс беруге болмайды");
            map.put("errorMessageLa", "Kúnine bes kitaptan artyq tapsyrys berýge bolmaıdy");
        } else {
            map.put("BrList", searchService.getCatalogueItems(viewDto.getBrIds(), viewDto.getLocale(), null));
            if (viewDto.getOrderType() == 1) {
                map.put("Departments", depRepository.getDepartmentList(viewDto.getBrIds(), viewDto.getLocale()));
            }
        }
        return map;
    }

    @PostMapping("order")
    public ResponseEntity<?> order(@RequestBody MOrderForm orderForm) {
        try {
            if (sessionService.getUserName() == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
            }
            Map<String, String> paramMap = new HashMap<>();
            paramMap.put("TO_DEP_CODE", "");
            paramMap.put("USER_NAME", sessionService.getUserName());
            paramMap.put("start", "0");
            paramMap.put("page", "1");
            paramMap.put("limit", "25");
            paramMap.put("FROM_DATE", LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
            paramMap.put("TO_DATE", LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
            if (orderForm.getItemList().size() +
                    orderRepository.getTableData(new MapStringParamProvider(paramMap)).count > 25) {
                    Map<Object, String> map = new HashMap<>();
                    switch (orderForm.getItemList().get(0).getLocale().getLanguage()) {
                        case Constants.LOCALE_EN:
                            map.put("error", "Twenty five books can be ordered per day");
                            break;
                        case Constants.LOCALE_RU:
                            map.put("error", "В один день можно заказать только двадцать пять книг");
                            break;
                        case Constants.LOCALE_KZ:
                            map.put("error", "Күніне тек жиырма бес кітапқа тапсырыс беруге болады");
                            break;
                        case Constants.LOCALE_la:
                            map.put("error", "Kúnine tek jıyrma bes kitapqa tapsyrys berýge bolady");
                            break;
                    }
                    return new ResponseEntity<>(map, HttpStatus.OK);
            }
            orderRepository.order(orderForm);
            return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, "application/json").build();
        } catch (OrderException e) {
            Map<Object, String> map = new HashMap<>();
            orderForm.getItemList().stream()
                    .filter(mOrderFormItem -> mOrderFormItem.getErrorMessage() != null)
                    .forEach(mOrderFormItem -> map.put(mOrderFormItem.getBrId(), mOrderFormItem.getErrorMessage()));
            return new ResponseEntity<>(map, HttpStatus.OK);
        }
    }

    @PostMapping("elOrder")
    public ResponseEntity<?> order(@RequestBody MElectronicForm form) {
        if (sessionService.getUserName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        Map<String, String> paramMap = new HashMap<>();
        paramMap.put("ORDER_STATUS_ID", "");
        paramMap.put("USER_NAME", sessionService.getUserName());
        paramMap.put("start", "0");
        paramMap.put("page", "1");
        paramMap.put("limit", "25");
        paramMap.put("FROM_DATE", LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
        paramMap.put("TO_DATE", LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
        if (form.getItemList().size() +
                electronicOrderRepository.getTableData(new MapStringParamProvider(paramMap)).count > 5) {
            Map<String, String> map = new HashMap<>();
            switch (form.getLocale().getLanguage()) {
                case Constants.LOCALE_EN:
                    map.put("error", "Only five books can be ordered per day");
                    break;
                case Constants.LOCALE_RU:
                    map.put("error", "В один день можно заказать только пять книг");
                    break;
                case Constants.LOCALE_KZ:
                    map.put("error", "Күніне тек бес кітапқа тапсырыс беруге болады");
                    break;
                case Constants.LOCALE_la:
                    map.put("error", "Kúnine tek bes kitapqa tapsyrys berýge bolady");
                    break;
            }
            return new ResponseEntity<>(map, HttpStatus.OK);
        }
        for (MElectronicItem item : form.getItemList()) {
            InsertElectronicOrderInfo orderInfo = new InsertElectronicOrderInfo();
            orderInfo.brId = item.getBrId();
            orderInfo.chapters = item.getChapters();
            orderInfo.isContents = (short) (item.getContents() ? 1 : 0);
            orderInfo.orderComment = item.getComment();
            orderInfo.pages = item.getPages();
            electronicOrderRepository.order(orderInfo);
        }
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, "application/json").build();
    }

    @GetMapping("favorite")
    public Map<Object, Object> getFavoriteCount() {
        Map<Object, Object> map = new HashMap<>();
        if (sessionService.getUserName() == null) {
            map.put("count", 0);
        } else {
            map.put("count", favoriteBrRepository.getFavoriteCount());
        }
        return map;
    }
}
