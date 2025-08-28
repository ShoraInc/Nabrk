package kz.nabrk.nabrkoauth2server.utils;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

public class CaseConvertUtils {
    public static String toCamelCase(String s) {
        StringBuilder sb = new StringBuilder(s.toLowerCase());
        for (int i = 0; i < sb.length(); i++) {
            if (sb.charAt(i) == '_') {
                sb.deleteCharAt(i);
                sb.replace(i, i + 1, String.valueOf(Character.toUpperCase(sb.charAt(i))));
            }
        }
        return sb.toString();
    }

    public static Map<String, Object> createCamelCaseObject(Map<String, Object> data) {
        Map<String, Object> d = new LinkedHashMap<>();
        data.keySet().forEach((key) -> {
            d.put(toCamelCase(key), data.get(key));
        });
        return d;
    }
}
