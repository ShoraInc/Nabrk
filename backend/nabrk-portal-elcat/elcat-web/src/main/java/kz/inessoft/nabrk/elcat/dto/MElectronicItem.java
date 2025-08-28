package kz.inessoft.nabrk.elcat.dto;

import kz.inessoft.nabrk.filestore.FileStoreUtils;

import java.io.Serializable;

public class MElectronicItem implements Serializable {
    private Integer brId;
    private Boolean contents;
    private String pages;
    private String chapters;
    private String comment;
    private Short copyYear;
    private Short copyNum;

    public String getCoverURL() {
        return FileStoreUtils.getCoverURL(brId, 1000 * 60 * 60);
    }

    public String getDownloadURL() {
        return FileStoreUtils.getFullPdfURL(brId,1000*60*60,true);
    }

    public String getDownload24URL() {
        return FileStoreUtils.get24PdfURL(brId,1000*60*60,true);
    }

    public Integer getBrId() {
        return brId;
    }

    public void setBrId(Integer brId) {
        this.brId = brId;
    }

    public Boolean getContents() {
        return contents;
    }

    public void setContents(Boolean contents) {
        this.contents = contents;
    }

    public String getPages() {
        return pages;
    }

    public void setPages(String pages) {
        this.pages = pages;
    }

    public String getChapters() {
        return chapters;
    }

    public void setChapters(String chapters) {
        this.chapters = chapters;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Short getCopyYear() {
        return copyYear;
    }

    public void setCopyYear(Short copyYear) {
        this.copyYear = copyYear;
    }

    public Short getCopyNum() {
        return copyNum;
    }

    public void setCopyNum(Short copyNum) {
        this.copyNum = copyNum;
    }
}
