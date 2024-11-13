package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.HibernateUtil;
import org.hibernate.Session;

@MultipartConfig
@WebServlet(name = "ChangeImage", urlPatterns = {"/ChangeImage"})
public class ChangeImage extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("success", false);

        Part image = req.getPart("image");
        String mobile = req.getParameter("mobile");

        try {
            String serverPath = req.getServletContext().getRealPath("").replace("\\build\\web", "\\web");
            String imagePath = serverPath + File.separator + "profile_pictures" + File.separator + mobile + ".png";
            File file = new File(imagePath);

            if (image != null) {
                Files.copy(
                        image.getInputStream(),
                        file.toPath(),
                        StandardCopyOption.REPLACE_EXISTING
                );
                jsonObject.addProperty("success", true);
            } else {
                jsonObject.addProperty("message", "Image not found.");
            }

        } catch (IOException e) {
            jsonObject.addProperty("message", "Profile update failed: " + e.getMessage());
        }

        session.close();
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(jsonObject));

    }

}
