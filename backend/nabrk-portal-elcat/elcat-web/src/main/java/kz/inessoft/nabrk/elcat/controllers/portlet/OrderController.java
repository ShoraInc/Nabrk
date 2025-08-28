//package kz.inessoft.nabrk.elcat.controllers.portlet;
//
//import com.ibm.ws.portletcontainer.portlet.PortletUtils;
//import kz.inessoft.nabrk.dao.api.Role;
//import kz.inessoft.nabrk.dao.dto.MOrderForm;
//import kz.inessoft.nabrk.dao.dto.MOrderFormItem;
//import kz.inessoft.nabrk.dao.dto.OrderException;
//import kz.inessoft.nabrk.dao.repository.BrRepository;
//import kz.inessoft.nabrk.dao.repository.DepRepository;
//import kz.inessoft.nabrk.dao.repository.OrderRepository;
//import kz.inessoft.nabrk.dao.utils.Utils;
//import kz.inessoft.nabrk.elcat.controllers.service.SearchService;
//import kz.inessoft.nabrk.elcat.dto.MCatalogueItem;
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
//import javax.portlet.ActionResponse;
//import javax.portlet.PortletRequest;
//import javax.portlet.RenderRequest;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletRequestWrapper;
//import java.sql.Date;
//import java.sql.Time;
//import java.util.HashMap;
//import java.util.LinkedList;
//import java.util.List;
//import java.util.Map;
//
//
//
//@Controller
//@RequestMapping(value = "view", params = "view=order")
//public class OrderController {
//
//    @Autowired
//    SearchService searchService;
//
//    @Autowired
//    SessionStore sessionStore;
//
//    @Autowired
//    DepRepository depRepository;
//
//    @Autowired
//    OrderRepository orderRepository;
//
//    @Autowired
//    BrRepository brRepository;
//
//    @RenderMapping
//    public ModelAndView handleRenderRequest(@ModelAttribute MOrderForm orderForm, RenderRequest request) {
//        HttpServletRequest httpServletRequest = getHttpServletRequest(request);
//        String remoteHost = httpServletRequest.getRemoteHost();
//        boolean isInnerUser = remoteHost.startsWith("10.0.1.") || remoteHost.startsWith("10.32.1.") || remoteHost.equals("192.168.1.140");
//
//        long currentTimeMillis = System.currentTimeMillis()+ 30 * 60 * 1000;
//        Date date= new Date(currentTimeMillis); // +30 minute
//        Time time = new Time(currentTimeMillis);
//
//        if (orderForm.getItemList()==null) {
//            List<MOrderFormItem> orderFormItems = new LinkedList<MOrderFormItem>();
//            for (String readingRoomBrId : sessionStore.getReadingRoomBrIds()) {
//                final String[] split = readingRoomBrId.split("_");
//                Integer brId = Integer.valueOf(split[0]);
//                Short copyYear =null;
//                Short copyNum =null;
//                if (split.length==3) {
//                    copyYear = Short.valueOf(split[1]);
//                    copyNum = Short.valueOf(split[2]);
//                }
//                MOrderFormItem orderFormItem = new MOrderFormItem();
//                orderFormItem.setDate(Utils.getStringValue(date));
//                orderFormItem.setTime(Utils.getStringValue(time));
//                orderFormItem.setBrId(brId);
//                orderFormItem.setDepartment("0");
//                orderFormItem.setCopyYear(copyYear);
//                orderFormItem.setCopyNum(copyNum);
//                orderFormItems.add(orderFormItem);
//            }
//            orderForm.setItemList(orderFormItems);
//        }
//        List<Integer> brIds = new LinkedList<Integer>();
//        for (String readingRoomBrId : sessionStore.getReadingRoomBrIds()) {
//            final String[] split = readingRoomBrId.split("_");
//            Integer brId = Integer.valueOf(split[0]);
//            brIds.add(brId);
//        }
//
//        List<MCatalogueItem> catalogItems = searchService.getCatalogueItems(brIds, request.getLocale(), null);
//        Map<Integer,MCatalogueItem> orders = new HashMap<Integer, MCatalogueItem>();
//        for (MCatalogueItem catalogItem : catalogItems) {
//            orders.put(catalogItem.getId(), catalogItem);
//        }
//        String paramActionSuccess = request.getParameter("orderActionSuccess");
//
//        Boolean orderSuccess = paramActionSuccess!=null && paramActionSuccess.equals("true");
//
//        ModelAndView view = new ModelAndView("order");
//        view.addObject("MOrderForm",orderForm);
//        view.addObject("brList", orders);
//        view.addObject("DepartmentList", depRepository.getDepartmentList(brIds,request.getLocale()));
//        view.addObject("isEmployee", request.isUserInRole(Role.employees.name()));
//        view.addObject("orderSuccess",orderSuccess);
//        view.addObject("isInnerUser",isInnerUser);
//        return view;
//    }
//
//    @ActionMapping(params = "action=OrderForm")
//    public void handleSimpleSearchForm(@ModelAttribute MOrderForm orderForm,
//                                       ActionResponse response) {
//        response.setRenderParameter("view", "order");
//        try {
//            orderRepository.order(orderForm);
//            orderForm.setItemList(null);
//            sessionStore.getReadingRoomBrIds().clear();
//            response.setRenderParameter("orderActionSuccess", "true");
//        } catch (OrderException e) {
//            response.setRenderParameter("orderActionSuccess", "false");
//        }
//    }
//
//    @ActionMapping(params = "action=removeOrder")
//    public void handleRemoveElOrder(@RequestParam("brId")String brId,
//                                    ActionResponse response) {
//        sessionStore.getReadingRoomBrIds().remove(brId);
//        response.setRenderParameter("view", "order");
//    }
//
//    @ExceptionHandler(Exception.class)
//    public ModelAndView handleException(Exception exception) {
//        ModelAndView view = new ModelAndView("error");
//        view.addObject("error", exception.getLocalizedMessage());
//        return view;
//    }
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
//}
//
