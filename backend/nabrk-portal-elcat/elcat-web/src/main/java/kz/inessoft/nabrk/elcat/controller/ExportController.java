package kz.inessoft.nabrk.elcat.controller;

import kz.inessoft.nabrk.elcat.controllers.service.ExportService;
import kz.inessoft.nabrk.elcat.controllers.service.SearchService;
import kz.inessoft.nabrk.elcat.dto.ExportDTO;
import kz.inessoft.nabrk.elcat.dto.SearchDTO;
import kz.inessoft.nabrk.solr.exceptions.SearchAllException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.stream.Collectors;

@RestController
@RequestMapping("export")
public class ExportController {

    @Autowired
    SearchService searchService;

    @Autowired
    ExportService exportService;

    @PostMapping("toWord")
    public ResponseEntity<ByteArrayResource> exportToWord(@RequestBody ExportDTO exportDto) {
        HttpHeaders header = new HttpHeaders();
        header.setContentType(new MediaType("application",
                "vnd.openxmlformats-officedocument.wordprocessingml.document"));
        header.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=catalog_items.docx");
        ByteArrayOutputStream stream = exportService.exportToWordStream(
                searchService.getCatalogueItems(
                        Arrays.stream(exportDto.getBrIds()).collect(Collectors.toList()), exportDto.getLocale(), null));
        return new ResponseEntity<>(new ByteArrayResource(stream.toByteArray()),
                header, HttpStatus.CREATED);
    }

    @PostMapping("allToWord")
    public ResponseEntity<?> exportAllToWord(@RequestBody SearchDTO searchDto) {
        try {
        HttpHeaders header = new HttpHeaders();
        header.setContentType(new MediaType("application",
                "vnd.openxmlformats-officedocument.wordprocessingml.document"));
        header.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=catalog_items.docx");
        ByteArrayOutputStream stream = exportService.exportToWordStream(
                searchService.getAllCatalogueItems(searchService.getSearchFilters(searchDto), searchDto.getLocale()));
        return new ResponseEntity<>(new ByteArrayResource(stream.toByteArray()),
                header, HttpStatus.CREATED);
        } catch (SearchAllException exception) {
            return new ResponseEntity(Collections.singletonMap("message", exception.getMessage(searchDto.getLocale())), HttpStatus.OK);
        }
    }

    @PostMapping("toExcel")
    public ResponseEntity<ByteArrayResource> exportToExcel(@RequestBody ExportDTO exportDto) {
        HttpHeaders header = new HttpHeaders();
        header.setContentType(new MediaType("application",
                "vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        header.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=catalog_items.xlsx");
        ByteArrayOutputStream stream = exportService.exportToExcelStream(
                searchService.getCatalogueItems(Arrays.stream(exportDto.getBrIds()).collect(Collectors.toList()),
                        exportDto.getLocale(), null));
        return new ResponseEntity<>(new ByteArrayResource(stream.toByteArray()), header, HttpStatus.CREATED);
    }

    @PostMapping("allToExcel")
    public ResponseEntity<?> exportAllToExcel(@RequestBody SearchDTO searchDto) {
        try {
            HttpHeaders header = new HttpHeaders();
            header.setContentType(new MediaType("application",
                    "vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            header.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=catalog_items.xlsx");
            ByteArrayOutputStream stream = exportService.exportToExcelStream(
                    searchService.getAllCatalogueItems(searchService.getSearchFilters(searchDto), searchDto.getLocale()));
            return new ResponseEntity<>(new ByteArrayResource(stream.toByteArray()), header, HttpStatus.CREATED);
        } catch (SearchAllException exception) {
            return new ResponseEntity(Collections.singletonMap("message", exception.getMessage(searchDto.getLocale())), HttpStatus.OK);
        }

    }
}
