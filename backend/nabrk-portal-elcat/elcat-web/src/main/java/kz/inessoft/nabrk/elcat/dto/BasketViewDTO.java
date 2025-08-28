package kz.inessoft.nabrk.elcat.dto;

import lombok.Data;

import java.util.List;
import java.util.Locale;

@Data
public class BasketViewDTO {
    List<Integer> brIds;
    Integer orderType;
    Locale locale;
}
