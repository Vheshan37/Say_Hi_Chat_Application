package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.HibernateUtil;
import model.entity.User;
import model.entity.UserStatus;
import model.validators.Validators;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@MultipartConfig
@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();
        JsonObject jsonObject = new JsonObject();

        String name = req.getParameter("name");
        String mobile = req.getParameter("mobile");
        Part image = req.getPart("image");

        jsonObject.addProperty("success", false);

        if (name.isEmpty()) {
            jsonObject.addProperty("message", "Name is required. Please enter your Name.");
        } else if (!Validators.checkWordCount(name, 2)) {
            jsonObject.addProperty("message", "The name must include both a first name and a last name.");
        } else if (mobile.isEmpty()) {
            jsonObject.addProperty("message", "Mobile number is required.");
        } else if (!Validators.validateMobile(mobile)) {
            jsonObject.addProperty("message", "Invalid mobile number. Please enter a valid mobile number.");
        } else {
            Criteria userTable = session.createCriteria(User.class);
            userTable.add(Restrictions.eq("mobile", mobile));
            if (userTable.list().isEmpty()) { // New user
                Criteria userStatusTable = session.createCriteria(UserStatus.class);
                userStatusTable.add(Restrictions.eq("status", "offline"));
                UserStatus userStatus = (UserStatus) userStatusTable.uniqueResult();

                User user = new User();
                user.setName(name);
                user.setMobile(mobile);
                user.setDateTime(new Date());
                user.setStatus(userStatus);

                session.save(user);
                session.beginTransaction().commit();

                if (image != null) {
                    // Save profile image
                    String serverPath = req.getServletContext().getRealPath("").replace("\\build\\web", "\\web");
                    String imagePath = serverPath + File.separator + "profile_pictures" + File.separator + mobile + ".png";
                    File file = new File(imagePath);
                    Files.copy(
                            image.getInputStream(),
                            file.toPath(),
                            StandardCopyOption.REPLACE_EXISTING
                    );
                }

                jsonObject.addProperty("success", true);
            } else {
                jsonObject.addProperty("message", "An account already exists with this mobile number.");
            }
        }

        session.close();
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(jsonObject));
    }

}
