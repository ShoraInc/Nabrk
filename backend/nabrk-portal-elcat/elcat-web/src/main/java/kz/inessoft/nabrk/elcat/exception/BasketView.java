package kz.inessoft.nabrk.elcat.exception;

public class BasketView extends RuntimeException {
    String message;

    public BasketView(String message) {
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
