package kz.inessoft.nabrk.elcat.controllers.service;

import kz.inessoft.nabrk.elcat.dto.MCatalogueItem;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class ExportService {

    @Autowired
    SearchService searchService;


    public ByteArrayOutputStream exportToExcelStream(List<MCatalogueItem> catalogItems) {
        try {
            ByteArrayOutputStream stream = new ByteArrayOutputStream();
            XSSFWorkbook wb = new XSSFWorkbook();
            XSSFSheet sheet = wb.createSheet();
            XSSFRow headerRow = sheet.createRow(0);

            headerRow.createCell(0).setCellValue("№");
            headerRow.createCell(1).setCellValue("Описание");

            int i = 1;
            for (MCatalogueItem catalogItem : catalogItems) {
                XSSFRow row = sheet.createRow(i++);
                row.createCell(0).setCellValue(catalogItem.getId().toString());
                row.createCell(1).setCellValue(catalogItem.getAuthors()
                        + "\n\n" + catalogItem.getName()
                        + "\n\n" + catalogItem.getUdc()
                        + "\n\n" + catalogItem.getShelfCode()
                        + "\n\n" + catalogItem.getAnnotation()
                        + "\n\n" + catalogItem.getKeywords()
                );
            }
            wb.write(stream);
            return stream;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException();
        }
    }

    public ByteArrayOutputStream exportToWordStream(List<MCatalogueItem> catalogItems) {
        try {
            ByteArrayOutputStream stream = new ByteArrayOutputStream();
            XWPFDocument document = new XWPFDocument();
            XWPFTable table = document.createTable(catalogItems.size() + 2, 2);
            // + 2 - одна строка для headerRow и еще одна чтобы последний столбец корректно отоброжался
            XWPFTableRow headerRow = table.getRow(0);
            headerRow.getCell(0).setText("№");
            headerRow.getCell(1).setText("Описание");
            for (MCatalogueItem catalogItem : catalogItems) {
                XWPFTableRow tableRow = table.getRow(catalogItems.indexOf(catalogItem) + 1);
                tableRow.getCell(0).setText(catalogItem.getId().toString());
                tableRow.getCell(1).setText(catalogItem.getAuthors()
                        + "\n\n" + catalogItem.getName()
                        + "\n\n" + catalogItem.getUdc()
                        + "\n\n" + catalogItem.getShelfCode()
                        + "\n\n" + catalogItem.getAnnotation()
                        + "\n\n" + catalogItem.getKeywords()
                );
            }
            document.write(stream);
            return stream;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException();
        }
    }
}
