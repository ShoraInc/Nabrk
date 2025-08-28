package kz.inessoft.nabrk.elcat.controllers.service;

import kz.inessoft.nabrk.elcat.dto.MCatalogueItem;

import java.util.List;

public class BRSearchResult {
    public final List<MCatalogueItem> brItems;
    public final int count ;

    public BRSearchResult(List<MCatalogueItem> brItems, int count) {
        this.brItems = brItems;
        this.count = count;
    }
}
