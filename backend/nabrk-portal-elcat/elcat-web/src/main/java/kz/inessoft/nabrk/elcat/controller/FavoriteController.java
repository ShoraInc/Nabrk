package kz.inessoft.nabrk.elcat.controller;

import kz.inessoft.nabrk.dao.api.SessionService;
import kz.inessoft.nabrk.dao.repository.FavoriteBrRepository;
import kz.inessoft.nabrk.elcat.dto.FavoriteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/favorite")
public class FavoriteController {
    @Autowired
    SessionService sessionService;

    @Autowired
    FavoriteBrRepository favoriteBrRepository;


    @GetMapping("count")
    public ResponseEntity<?> getFavoriteCount() {
        if (sessionService.getUserName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } else {
            Map<Object, Object> map = new HashMap<>();
            map.put("count", favoriteBrRepository.getFavoriteCount());
            map.put("favorites",
                    favoriteBrRepository.getFavorites(null, null).
                            favoriteList.stream().map(FavoriteBrRepository.FavoriteDTO::getBrId).collect(Collectors.toList()));
            return ResponseEntity.ok(map);
        }
    }

    @PostMapping("add")
    public ResponseEntity<?> addFavorite(@RequestBody FavoriteDTO favoriteDTO) {
        if (sessionService.getUserName() != null) {
            favoriteBrRepository.addFavorite(favoriteDTO.getBrId());
            return ResponseEntity.ok("BR was successfully added to favorites");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("remove")
    public ResponseEntity<?> removeFavorite(@RequestBody FavoriteDTO favoriteDTO) {
        if (sessionService.getUserName() != null) {
            favoriteBrRepository.removeFavorite(favoriteDTO.getBrId());
            return ResponseEntity.ok("BR was successfully removed from favorites");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

}
