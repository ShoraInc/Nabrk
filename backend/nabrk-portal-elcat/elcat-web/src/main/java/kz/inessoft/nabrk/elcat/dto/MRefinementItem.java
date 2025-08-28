package kz.inessoft.nabrk.elcat.dto;

import java.io.Serializable;

public class MRefinementItem implements Serializable {

//    private String key;
    private String value;
    private Long count;
    private String name;
//    private Boolean disabled;
//    private String type;

//    public String getKey() {
//        return key;
//    }
//
//    public void setKey(String key) {
//        this.key = key;
//    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    //    public Boolean getDisabled() {
//        return disabled;
//    }
//
//    public void setDisabled(Boolean disabled) {
//        this.disabled = disabled;
//    }
//
//    public String getType() {
//        return type;
//    }
//
//    public void setType(String type) {
//        this.type = type;
//    }
}
