package kz.inessoft.nabrk.elcat.utils;

import java.io.IOException;
import java.io.InputStream;

public class ImageStore {

    public static byte[] getNoPhotoImage() throws IOException {
        InputStream resourceAsStream = ImageStore.class.getResourceAsStream("no_photo.gif");
        byte[] bytes = new byte[resourceAsStream.available()];
        resourceAsStream.read(bytes);
        resourceAsStream.close();
        return bytes;
    }
}
