package kz.inessoft.nabrk.elcat.dto;

import java.io.Serializable;

public class MExhibitionItem implements Serializable {
    private Long brId;
    private Long exhibitionId;
    private Integer count;
    private Boolean checked;

    public MExhibitionItem() {

    }

    public MExhibitionItem(Long brId, Long exhibitionId, Integer count) {
        this.brId = brId;
        this.exhibitionId = exhibitionId;
        this.count = count;
        this.checked = false;
    }

    public Long getBrId() {
        return brId;
    }

    public void setBrId(Long brId) {
        this.brId = brId;
    }

    public Long getExhibitionId() {
        return exhibitionId;
    }

    public void setExhibitionId(Long exhibitionId) {
        this.exhibitionId = exhibitionId;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public Boolean getChecked() {
        return checked;
    }

    public void setChecked(Boolean checked) {
        this.checked = checked;
    }
}
