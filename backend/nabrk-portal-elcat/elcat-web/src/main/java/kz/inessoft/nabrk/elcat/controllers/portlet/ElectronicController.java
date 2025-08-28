package kz.inessoft.nabrk.elcat.controllers.portlet;
//
//import com.ibm.ws.portletcontainer.portlet.PortletUtils;
//import kz.inessoft.nabrk.dao.api.Role;
//import kz.inessoft.nabrk.dao.dto.InsertElectronicOrderInfo;
//import kz.inessoft.nabrk.dao.repository.ElectronicOrderRepository;
//import kz.inessoft.nabrk.elcat.controllers.service.SearchService;
//import kz.inessoft.nabrk.elcat.dto.MCatalogueItem;
//import kz.inessoft.nabrk.elcat.dto.MElectronicForm;
//import kz.inessoft.nabrk.elcat.dto.MElectronicItem;
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
//import java.util.HashMap;
//import java.util.LinkedList;
//import java.util.List;
//import java.util.Map;
//
//@Controller
//@RequestMapping(value = "view", params = "view=electronic")
public class ElectronicController {}
//
//    @Autowired
//    SessionStore sessionStore;
//
//    @Autowired
//    SearchService searchService;
//
//    @Autowired
//    ElectronicOrderRepository electronicOrderRepository;
//
//    @RenderMapping
//    public ModelAndView handleRenderRequest(RenderRequest request) {
//        HttpServletRequest httpServletRequest = getHttpServletRequest(request);
//        String remoteHost = httpServletRequest.getRemoteHost();
//        boolean isInnerUser = remoteHost.startsWith("10.0.1.") || remoteHost.startsWith("10.32.1.") || remoteHost.equals("192.168.1.140");
//
//        List<MElectronicItem> electronicItems = new LinkedList<MElectronicItem>();
//        List<Integer> brIds = new LinkedList<Integer>();
//        for (String orderBrId : sessionStore.getElectronicOrderBrIds()) {
//            final String[] split = orderBrId.split("_");
//            Integer brId = Integer.valueOf(split[0]);
//            Short copyYear =null;
//            Short copyNum =null;
//            if (split.length==3) {
//                copyYear = Short.valueOf(split[1]);
//                copyNum = Short.valueOf(split[2]);
//            }
//
//            MElectronicItem electronicItem = new MElectronicItem();
//            electronicItem.setBrId(brId);
//            electronicItem.setCopyYear(copyYear);
//            electronicItem.setCopyYear(copyNum);
//            electronicItems.add(electronicItem);
//            brIds.add(brId);
//        }
//
//        List<MCatalogueItem> catalogItems = searchService.getCatalogueItems(brIds, request.getLocale(), null);
//        Map<Integer,MCatalogueItem> orders = new HashMap<Integer, MCatalogueItem>();
//        for (MCatalogueItem catalogItem : catalogItems) {
//            orders.put(catalogItem.getId(), catalogItem);
//        }
//
//        MElectronicForm electronicForm = new MElectronicForm();
//        electronicForm.setItemList(electronicItems);
//
//        ModelAndView view = new ModelAndView("electronic");
//        view.addObject("MElectronicForm", electronicForm);
//        view.addObject("brList", orders);
//        view.addObject("isEmployee", request.isUserInRole(Role.employees.name()));
//        view.addObject("orderSuccess",request.getParameter("actionSuccess")!=null);
//        view.addObject("isInnerUser",isInnerUser);
//
//        return view;
//    }
//
//    @ActionMapping(params = "action=ElectronicForm")
//    public void handleSimpleSearchForm(@ModelAttribute MElectronicForm electronicForm,
//                                       ActionResponse response) {
//        for (MElectronicItem item : electronicForm.getItemList()) {
//            InsertElectronicOrderInfo orderInfo = new InsertElectronicOrderInfo();
//            orderInfo.brId = item.getBrId();
//            orderInfo.chapters = item.getChapters();
//            orderInfo.isContents = (short)(item.getContents() ? 1 : 0);
//            orderInfo.orderComment = item.getComment();
//            orderInfo.pages = item.getPages();
//            electronicOrderRepository.order(orderInfo);
//        }
//        sessionStore.getElectronicOrderBrIds().clear();
//        response.setRenderParameter("view", "electronic");
//        response.setRenderParameter("actionSuccess","true");
//    }
//
//    @ActionMapping(params = "action=removeElOrder")
//    public void handleRemoveElOrder(@RequestParam("brId")String brId,
//                                    ActionResponse response) {
//        sessionStore.getElectronicOrderBrIds().remove(brId);
//        response.setRenderParameter("view", "electronic");
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
