package kz.nabrk.nabrkoauth2server.utils;

import lombok.Builder;
import lombok.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Random;

@Component
@Builder
public class WorkspaceUtils {
    public String generateBarCode(String ticketNumber) {
        String zeros = "";

        for (int i = 9; i > ticketNumber.length(); --i) {
            zeros = zeros.concat("0");
        }

        String subBar = "225".concat(zeros).concat(ticketNumber);
        char[] cs = subBar.toCharArray();
        int even = 0;
        int odd = 0;

        int i;
        for (i = 1; i < cs.length; i += 2) {
            even += Integer.parseInt(String.valueOf(cs[i]));
        }

        for (i = 0; i < cs.length; i += 2) {
            odd += Integer.parseInt(String.valueOf(cs[i]));
        }

        String string = Integer.toString(even * 3 + odd);
        int checksum = 10 - Integer.parseInt(string.substring(string.length() - 1));
        if (checksum == 10) {
            checksum = 0;
        }

        return subBar.concat(String.valueOf(checksum));
    }


    public String generatePassword() {
        return ((Double) (new Random(LocalDateTime.now().getSecond()).nextDouble())).toString().substring(2, 7);
    }


}
