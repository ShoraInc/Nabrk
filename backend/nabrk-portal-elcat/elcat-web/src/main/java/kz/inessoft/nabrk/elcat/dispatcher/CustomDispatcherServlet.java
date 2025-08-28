package kz.inessoft.nabrk.elcat.dispatcher;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

public class CustomDispatcherServlet extends DispatcherServlet {
    public CustomDispatcherServlet() {
        this.setDispatchOptionsRequest(true);
    }

    public CustomDispatcherServlet(WebApplicationContext webApplicationContext) {
        super(webApplicationContext);
    }

}
