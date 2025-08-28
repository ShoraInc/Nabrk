package kz.inessoft.nabrk.elcat.utils;

import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.Rectangle;
import com.lowagie.text.*;
import com.lowagie.text.pdf.Barcode128;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import kz.inessoft.nabrk.dao.repository.CopyRepository;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.util.JRLoader;

import java.awt.*;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

public class PrintUtils {

    public static void export(String ticketNumber, OutputStream outputStream, Connection connection) throws JRException, IOException {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("TicketNumber", ticketNumber);

        InputStream inputStream = PrintUtils.class.getResourceAsStream("/kz/inessoft/nabrk/utils/Ticket.jasper");
        JasperReport jasperReport = (JasperReport) JRLoader.loadObject(inputStream);
        inputStream.close();
        JasperPrint print = JasperFillManager.fillReport(jasperReport, parameters, connection);

        JRExporter exporter = new JRPdfExporter();
        exporter.setParameter(JRExporterParameter.JASPER_PRINT, print);
        exporter.setParameter(JRExporterParameter.OUTPUT_STREAM, outputStream);
        exporter.exportReport();
    }

    public static void printBarCodes(java.util.List<CopyRepository.CopyBarcodeAndInventory> barCodes, OutputStream outputStream) throws JRException, IOException, DocumentException {
        Rectangle pageSize = new Rectangle(0, 0, 84, 56);
        Document document = new Document(pageSize, 0, 0, 0, 0);

        PdfWriter writer = PdfWriter.getInstance(document, outputStream);
        document.open();
        PdfContentByte cb = writer.getDirectContent();
        for (CopyRepository.CopyBarcodeAndInventory barCode : barCodes) {
            Font f12 = FontFactory.getFont("/fonts/Arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 3);

            Paragraph pa = new Paragraph("ҚР Ұлттық Академиялық Кітапханасы", f12);
            pa.setAlignment(Element.ALIGN_CENTER);

            Paragraph pa2 = new Paragraph("Национальная Академическая Библиотека РК", f12);
            pa2.setAlignment(Element.ALIGN_CENTER);

            document.add(pa);
            document.add(pa2);
            document.add(getBarcodeImage(cb, barCode.barcode, 18));

            document.newPage();
            Font fontBig = FontFactory.getFont("/fonts/Arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 14);
            Paragraph paragraph1 = new Paragraph(barCode.inventoryNumber, fontBig);
            Paragraph paragraph2 = new Paragraph(barCode.inventoryNumber, fontBig);
            paragraph1.setAlignment(Element.ALIGN_CENTER);
            paragraph1.setLeading(15, 0);
            paragraph2.setSpacingBefore(10);
            paragraph2.setAlignment(Element.ALIGN_CENTER);
            paragraph2.setLeading(15, 0);

            document.add(paragraph1);
            document.add(new LineSeparator(1, 200, Color.BLACK, 1, -10));
            document.add(paragraph2);
            document.newPage();
        }
        document.close();
    }

    private static Paragraph createPar(Font f12, String text, int leading) {
        Paragraph pa = new Paragraph(text, f12);
        pa.setAlignment(Element.ALIGN_CENTER);

//        if (leading!=0) pa.setLeading(leading);
        pa.setIndentationLeft(-60);
        pa.setIndentationRight(-60);
        return pa;
    }

    private static Image getBarcodeImage(PdfContentByte cb, String barcode, int yPos) {
        Barcode128 shipBarCode2 = getBarcode128(barcode);

        Image imgShipBarCode2 = shipBarCode2.createImageWithBarcode(cb, Color.black, Color.black);
        imgShipBarCode2.setAbsolutePosition(2, yPos);
        imgShipBarCode2.setAlignment(1);
        return imgShipBarCode2;
    }

    private static Barcode128 getBarcode128(String barcode) {
        String code402 = barcode + Barcode128.FNC1;


        Barcode128 shipBarCode = new Barcode128();
        shipBarCode.setX(0.72f);
        shipBarCode.setN(1.5f);
        shipBarCode.setChecksumText(true);
        shipBarCode.setGenerateChecksum(true);
        shipBarCode.setSize(8f);
        shipBarCode.setTextAlignment(Element.ALIGN_CENTER);


        shipBarCode.setBaseline(8f);
        shipBarCode.setCode(code402);
        shipBarCode.setBarHeight(14f);
        return shipBarCode;
    }

    public static void printMoveAct(Connection connection, Integer moveActId, OutputStream outputStream) throws JRException, IOException {
        InputStream resourceAsStream = PrintUtils.class.getResourceAsStream("MoveActTemplate.jasper");
        printMoveAct(connection, moveActId, outputStream, resourceAsStream);
    }

    public static void printMoveAct(Connection connection, Integer moveActId, OutputStream outputStream, InputStream resourceAsStream) throws JRException, IOException {
        HashMap<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("move_act_id", moveActId);
        JasperReport jasperReport = (JasperReport) JRLoader.loadObject(resourceAsStream);
        resourceAsStream.close();
        JasperPrint print = JasperFillManager.fillReport(jasperReport, paramMap, connection);

        JRExporter exporter = new JRPdfExporter();
        exporter.setParameter(JRExporterParameter.JASPER_PRINT, print);
        exporter.setParameter(JRExporterParameter.OUTPUT_STREAM, outputStream);
        exporter.exportReport();
    }
}
