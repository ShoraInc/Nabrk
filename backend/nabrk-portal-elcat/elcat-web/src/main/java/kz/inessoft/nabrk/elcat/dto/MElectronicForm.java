package kz.inessoft.nabrk.elcat.dto;

import java.io.Serializable;
import java.util.List;
import java.util.Locale;

public class MElectronicForm implements Serializable {

    private List<MElectronicItem> itemList;

    private Locale locale;

    public Locale getLocale() {
        return locale;
    }

    public void setLocale(Locale locale) {
        this.locale = locale;
    }

    public List<MElectronicItem> getItemList() {
        return itemList;
    }

    public void setItemList(List<MElectronicItem> itemList) {
        this.itemList = itemList;
    }
}
