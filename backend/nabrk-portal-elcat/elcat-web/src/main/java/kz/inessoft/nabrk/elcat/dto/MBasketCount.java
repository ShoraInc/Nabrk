package kz.inessoft.nabrk.elcat.dto;

/**
 * Created by erlan.ibraev on 04.04.14.
 */
public class MBasketCount {
    private Integer orderCount;
    private Integer electronicCount;
    private Integer favoriteCount;
    private Integer exhibitionCount;

    public MBasketCount() {
        this.orderCount = 0;
        this.electronicCount = 0;
        this.exhibitionCount = 0;
        this.favoriteCount = 0;
    }

    public MBasketCount(Integer orderCount, Integer electronicCount, Integer favoriteCount, Integer exhibitionCount) {
        this.orderCount = orderCount;
        this.electronicCount = electronicCount;
        this.favoriteCount = favoriteCount;
        this.exhibitionCount = exhibitionCount;
    }

    public Integer getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(Integer orderCount) {
        this.orderCount = orderCount;
    }

    public Integer getElectronicCount() {
        return electronicCount;
    }

    public void setElectronicCount(Integer electronicCount) {
        this.electronicCount = electronicCount;
    }

    public Integer getFavoriteCount() {
        return favoriteCount;
    }

    public void setFavoriteCount(Integer favoriteCount) {
        this.favoriteCount = favoriteCount;
    }

    public Integer getExhibitionCount() {
        return exhibitionCount;
    }

    public void setExhibitionCount(Integer exhibitionCount) {
        this.exhibitionCount = exhibitionCount;
    }
}
