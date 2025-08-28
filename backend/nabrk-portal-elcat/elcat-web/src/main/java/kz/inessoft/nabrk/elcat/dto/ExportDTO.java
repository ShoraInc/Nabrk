package kz.inessoft.nabrk.elcat.dto;

import lombok.Data;

import java.util.Locale;

@Data
public class ExportDTO {
    Integer[] brIds;
    Locale locale;
}
