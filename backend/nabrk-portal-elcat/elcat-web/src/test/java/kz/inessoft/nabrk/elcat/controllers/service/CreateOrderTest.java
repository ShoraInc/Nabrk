package kz.inessoft.nabrk.elcat.controllers.service;

import kz.inessoft.nabrk.dao.dto.MOrderForm;
import kz.inessoft.nabrk.dao.dto.MOrderFormItem;
import kz.inessoft.nabrk.dao.repository.OrderRepository;
import org.apache.log4j.ConsoleAppender;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.PatternLayout;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.LinkedList;
import java.util.List;


@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration
public class CreateOrderTest {

    @Autowired
    OrderRepository orderRepository;

    @Test
    @Ignore
    public void testCreateOrder() throws Exception {
        Logger rootLogger = Logger.getRootLogger();
        System.out.println(rootLogger.getLevel().toString());
        rootLogger.setLevel(Level.DEBUG);
        rootLogger.addAppender(new ConsoleAppender(
                new PatternLayout("%d{ISO8601} [%-5p][%-16.16t][%32.32c] - %m%n")));

        MOrderForm orderForm = new MOrderForm();
        List<MOrderFormItem> items = new LinkedList<MOrderFormItem>();

        orderForm.setItemList(items);

        MOrderFormItem item = new MOrderFormItem();
        item.setBrId(76808);
        item.setDate("25.01.2016");
        item.setTime("12:39:21");
        item.setDepartment("ОЧЗ,КХ");
        items.add(item);

        item = new MOrderFormItem();
        item.setBrId(486340);
        item.setDate("25.01.2016");
        item.setTime("12:39:21");
        item.setDepartment("0");
        items.add(item);

        orderRepository.order(orderForm);
    }
}
