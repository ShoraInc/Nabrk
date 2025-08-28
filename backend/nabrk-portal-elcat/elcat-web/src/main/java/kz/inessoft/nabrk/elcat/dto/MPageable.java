package kz.inessoft.nabrk.elcat.dto;

import java.io.Serializable;
import java.util.List;
import java.util.Vector;

/**
 * Created by erlan.ibraev on 31.03.14.
 */
public class MPageable implements Serializable {
    public static int pageLimit = 7;

    private int start;
    private int limit;
    private int page;
    private int brCount;

    public MPageable(int start, int limit, int page, int brCount) {
        this.start = start;
        this.limit = limit;
        this.page = page;
        this.brCount = brCount;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getBrCount() {
        return brCount;
    }

    public void setBrCount(int brCount) {
        this.brCount = brCount;
    }

    // Расчет пагинации

    public static Long getPageCount(Integer limit, Integer size) {
        int tmpI = (size.intValue() % limit.intValue() != 0 ? 1 : 0) +  size.intValue() / limit.intValue();
        Long result = new Long(tmpI);
        return result;
    }

    public static List<MPageable> getPages(Integer new_limit, Integer currentPage, Integer size) {
        List<MPageable> pages = new Vector<MPageable>();

        if (new_limit != null && new_limit.intValue() > 0) {

            List<MPageable> new_pages = new Vector<MPageable>();

            long pageCount = MPageable.getPageCount(new_limit, size);
            int brCount = size;
            int current = 0;
            for(int i=0; i < pageCount; i++) {
                if(currentPage < 7) {
                    if ( i < 7 || pageCount - 1 == i) {
                        new_pages.add(new MPageable(current,new_limit.intValue(),i+1, brCount));
                    }
                } else if (pageCount - currentPage < 6) {
                    if(0 == i || pageCount - i < 8) {
                        new_pages.add(new MPageable(current,new_limit.intValue(),i+1, brCount));
                    }
                } else {
                    if ( (0 == i) || (currentPage - 4 < i && i < currentPage + 3) || (pageCount - 1 == i)) {
                        new_pages.add(new MPageable(current,new_limit.intValue(),i+1, brCount));
                    }
                }
                current += new_limit.intValue();
            }

            pages = new_pages;
        }

        return pages;
    }

}
