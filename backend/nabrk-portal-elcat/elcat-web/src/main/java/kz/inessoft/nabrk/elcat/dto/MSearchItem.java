package kz.inessoft.nabrk.elcat.dto;

import kz.inessoft.nabrk.solr.domain.Field;
import kz.inessoft.nabrk.solr.domain.Operation;
import lombok.Data;

@Data
public class MSearchItem {
    Operation operation;
    Field field;
    String value;
}
