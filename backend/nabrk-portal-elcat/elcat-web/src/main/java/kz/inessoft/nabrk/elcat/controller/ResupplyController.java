package kz.inessoft.nabrk.elcat.controller;

import kz.inessoft.nabrk.dao.dto.MResupplyForm;
import kz.inessoft.nabrk.dao.repository.ResupplyReaderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/resupply")
public class ResupplyController {
    @Autowired
    ResupplyReaderRepository resupplyReaderRepository;

    @PostMapping(value = "/createResupplyReader")
    @ResponseBody
    public ResponseEntity<?> createResupplyReader(@RequestBody MResupplyForm mResupplyForm){
            resupplyReaderRepository.add(mResupplyForm);
            return ResponseEntity.ok("Success");
    }
}
