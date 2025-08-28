package kz.inessoft.nabrk.elcat.controllers.portlet;
//
//import kz.inessoft.nabrk.dao.repository.ReaderRepository;
//import kz.inessoft.nabrk.dao.repository.ResupplyReaderRepository;
//import kz.inessoft.nabrk.dao.dto.MResupplyForm;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.ModelAttribute;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.portlet.ModelAndView;
//import org.springframework.web.portlet.bind.annotation.ActionMapping;
//import org.springframework.web.portlet.bind.annotation.RenderMapping;
//
//import javax.portlet.ActionResponse;
//import javax.portlet.RenderRequest;
//
//@Controller
//@RequestMapping(value = "view", params = "view=resupply")
public class ResupplyController {}
//
//    @Autowired
//    ReaderRepository readerRepository;
//
//    @Autowired
//    ResupplyReaderRepository resupplyReaderRepository;
//
//    @RenderMapping
//    public ModelAndView handleRenderRequest(RenderRequest request) {
//
//        MResupplyForm resupplyFundForm = new MResupplyForm();
//        final String remoteUser = request.getRemoteUser();
//        if (remoteUser!=null) {
//            final ReaderRepository.ReaderDTO reader = readerRepository.getReader(remoteUser);
//            resupplyFundForm.setFio(reader.getLastAndFirstName());
//            resupplyFundForm.setEmail(reader.getEmail());
//        }
//
//        String paramActionSuccess = request.getParameter("Success");
//        Boolean orderSuccess = paramActionSuccess!=null && paramActionSuccess.equals("true");
//
//        ModelAndView view = new ModelAndView("resupply");
//        view.addObject("ResupplyFundForm",resupplyFundForm);
//        view.addObject("success",orderSuccess);
//        return view;
//    }
//
//    @ActionMapping(params = "action=resupplyOrder")
//    public void handleRemoveElOrder(@ModelAttribute MResupplyForm resupplyForm,ActionResponse actionResponse) {
//        resupplyReaderRepository.add(resupplyForm);
//        actionResponse.setRenderParameter("Success", "true");
//        actionResponse.setRenderParameter("view", "resupply");
//    }
//}
