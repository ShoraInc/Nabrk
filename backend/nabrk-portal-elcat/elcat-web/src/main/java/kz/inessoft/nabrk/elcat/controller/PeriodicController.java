package kz.inessoft.nabrk.elcat.controller;

import kz.inessoft.nabrk.dao.dto.TreeNode;
import kz.inessoft.nabrk.dao.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;

@RestController
public class PeriodicController {
    @Autowired
    SubscriptionRepository subscriptionRepository;

    @GetMapping("periodicInfoTree")
    public List<TreeNode> requestPeriodicInfoTree(@RequestParam("brID") Integer brID, @RequestParam("locale") Locale locale){
        List<TreeNode> tree = subscriptionRepository.getPeriodicYearsAndNumbersTree(brID);
        List<TreeNode> result = new LinkedList<TreeNode>();
        for (TreeNode level1Node : tree) {
            result.add(level1Node);
            result.addAll(level1Node.children);
            for (TreeNode child : level1Node.children) {
                child.value = parseAndLocalizePeriodicDate(child.value, locale);
            }
        }
        return result;
    }

    private String parseAndLocalizePeriodicDate(String value, Locale locale) {
        if (value == null || value.isEmpty()) return "";

        if (value.contains("-")) {
               return localizePeriod(value, locale);
        } else {
            if (value.contains(".")) {
                String[] dayMonth = value.split("\\.");
                return localizeDayAndMonth(dayMonth[0], dayMonth[1], locale);
            } else {
                return localizeOnlyMonth(value, locale);
            }
        }
    }

    private String localizeOnlyMonth(String monthCode, Locale locale) {
        return ResourceBundle.getBundle("kz.inessoft.nabrk.elcat.Language-ext", locale).getString("month."+monthCode);
    }

    private String localizeDayAndMonth(String day, String monthCode, Locale locale) {
        if (locale.toString().equals("ru")) {
            return day + " " + ResourceBundle.getBundle("kz.inessoft.nabrk.elcat.Language-ext", locale).getString("monthFrom." + monthCode);
        } else {
            return day + " " + ResourceBundle.getBundle("kz.inessoft.nabrk.elcat.Language-ext", locale).getString("month." + monthCode);
        }
    }

    private String localizePeriod(String period, Locale locale) {
        String[] parts = period.split("-");
        if (period.contains(".")) {
            String[] start = parts[0].split("\\.");
            String[] end = parts[1].split("\\.");
            String startDay = start[0];
            String startMonth = start[1];
            String endDay = end[0];
            String endMonth = end[1];
            if (locale.toString().equals("kk")) {
                String localized = startDay + " " + ResourceBundle.getBundle("kz.inessoft.nabrk.elcat.Language-ext", locale).getString("monthFrom." + startMonth)
                        + " - " + endDay + " " + ResourceBundle.getBundle("kz.inessoft.nabrk.elcat.Language-ext", locale).getString("monthTo." + endMonth);
                return localized;
            } else {
                return localizeDayAndMonth(startDay, startMonth, locale) + " - " + localizeDayAndMonth(endDay, endMonth, locale);
            }
        } else {
            return localizeOnlyMonth(parts[0], locale) + " - " + localizeOnlyMonth(parts[1], locale);
        }
    }
}
