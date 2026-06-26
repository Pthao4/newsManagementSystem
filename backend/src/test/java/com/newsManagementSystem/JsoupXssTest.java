package com.newsManagementSystem;

import org.junit.jupiter.api.Test;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

public class JsoupXssTest {
    
    @Test
    public void testXssSanitization() {
        // Dữ liệu giả lập bị hacker chèn mã độc Javascript
        String maliciousHtml = "<h1>Tiêu đề bài viết</h1>"
                + "<p>Đây là nội dung bình thường.</p>"
                + "<script>alert('Hacker đã chiếm quyền điều khiển!');</script>"
                + "<p><a href=\"javascript:alert('Đánh cắp cookie')\">Click vào đây để nhận thưởng</a></p>"
                + "<img src=\"x\" onerror=\"alert('XSS qua thẻ img')\" />"
                + "<b style=\"color: red;\">Chữ in đậm màu đỏ an toàn</b>";

        // Chạy qua màng lọc Jsoup với chế độ relaxed
        String safeHtml = Jsoup.clean(maliciousHtml, Safelist.relaxed());

        System.out.println("=================================================");
        System.out.println("🔴 TRƯỚC KHI LÀM SẠCH (CÓ MÃ ĐỘC):");
        System.out.println(maliciousHtml);
        System.out.println("=================================================");
        System.out.println("🟢 SAU KHI QUA BỘ LỌC JSOUP (AN TOÀN):");
        System.out.println(safeHtml);
        System.out.println("=================================================");
    }
}
