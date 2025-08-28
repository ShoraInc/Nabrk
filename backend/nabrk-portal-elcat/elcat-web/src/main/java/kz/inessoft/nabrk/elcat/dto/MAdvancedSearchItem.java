package kz.inessoft.nabrk.elcat.dto;

public class MAdvancedSearchItem  {
    private String operator;
    private String field;
    private String value;

    public MAdvancedSearchItem() {

    }

    public MAdvancedSearchItem(String field, String value, String operator) {
        this.field = field;
        this.value = value;
        this.operator = operator;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
