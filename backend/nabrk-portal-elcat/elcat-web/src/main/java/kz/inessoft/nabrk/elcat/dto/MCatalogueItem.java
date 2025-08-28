package kz.inessoft.nabrk.elcat.dto;

import kz.inessoft.nabrk.dao.dto.ElCatalogBr;
import kz.inessoft.nabrk.filestore.AppProperties;
import kz.inessoft.nabrk.filestore.FileStoreUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.env.PropertiesPropertySource;

import java.io.IOException;
import java.util.Properties;

public class MCatalogueItem extends ElCatalogBr {

    private String checked;
    private Boolean readingroom;
    private Boolean electronicOrder;
    private Boolean exhibition;

    private static final String host = AppProperties.getInstance().readValue("app.fileStore.api.host");

    public String getCoverURL() {
        return FileStoreUtils.getCoverURL(getId(), 1000 * 60 * 60);
    }

    public String getDownloadURL() {
        return FileStoreUtils.getFullPdfURL(getId(), 1000 * 60 * 60, true);
    }

    public String getDownload24URL() {
        return FileStoreUtils.get24PdfURL(getId(), 1000 * 60 * 60, true);
    }

    public String getChecked() {
        return checked;
    }

    public void setChecked(String checked) {
        this.checked = checked;
    }

    public Boolean getReadingroom() {
        return readingroom;
    }

    public void setReadingroom(Boolean readingroom) {
        this.readingroom = readingroom;
    }

    public Boolean getElectronicOrder() {
        return electronicOrder;
    }

    public void setElectronicOrder(Boolean electronicOrder) {
        this.electronicOrder = electronicOrder;
    }

    public Boolean getExhibition() {
        return exhibition;
    }

    public void setExhibition(Boolean exhibition) {
        this.exhibition = exhibition;
    }

    private boolean contentExists(String fileName) {
        try {
            return FileStoreUtils.requestContentExists(Long.valueOf(getId()), fileName, host);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public Boolean getViewIn() {
        return super.getViewIn() && contentExists(FileStoreUtils.pdfFullFileName);
    }

    @Override
    public Boolean getViewOut() {
        return super.getViewOut() && contentExists(FileStoreUtils.pdfFullFileName);
    }

    @Override
    public Boolean getDownload24In() {
        return super.getDownload24In() && contentExists(FileStoreUtils.pdf24FileName);
    }

    @Override
    public Boolean getDownload24Out() {
        return super.getDownload24Out() && contentExists(FileStoreUtils.pdf24FileName);
    }

    @Override
    public Boolean getDownloadFullIn() {
        return super.getDownloadFullIn() && contentExists(FileStoreUtils.pdfFullFileName);
    }

    @Override
    public Boolean getDownloadFullOut() {
        return super.getDownloadFullOut() && contentExists(FileStoreUtils.pdfFullFileName);
    }
}
