package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import model.dto.UserDTO;
import model.entity.User;
import model.validators.Validators;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "SignIn", urlPatterns = {"/SignIn"})
public class SignIn extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("success", false);

        String mobile = req.getParameter("mobile");
        if (mobile.isEmpty()) {
            jsonObject.addProperty("message", "Mobile number is required.");
        } else if (!Validators.validateMobile(mobile)) {
            jsonObject.addProperty("message", "Invalid mobile number. Please enter a valid mobile number.");
        } else {
            Criteria userTable = session.createCriteria(User.class);
            userTable.add(Restrictions.eq("mobile", mobile));

            if (userTable.list().isEmpty()) { // Invalid User
                jsonObject.addProperty("message", "No account on this mobile number");
            } else { // Registered user
                User user = (User) userTable.uniqueResult();
                UserDTO userDTO = new UserDTO();
                userDTO.setId(user.getId());
                userDTO.setName(user.getName());
                userDTO.setMobile(user.getMobile());
                userDTO.setDateTime(user.getDateTime());
                userDTO.setStatus(user.getStatus());
                userDTO.setHasImage(false);

                String applicationPath = req.getServletContext().getRealPath("//profile_pictures").replace("\\build\\web", "\\web");
                String filePath = applicationPath + "//" + user.getMobile() + ".png";

                File file = new File(filePath);

                if (file.exists()) {
                    userDTO.setHasImage(true);
                } else {
                    String[] words = user.getName().trim().split("\\s+");

                    String firstLetter = words[0].substring(0, 1);
                    String secondLetter = words[1].substring(0, 1);

                    userDTO.setLetterName(firstLetter + secondLetter);
                }

                jsonObject.add("user", gson.toJsonTree(userDTO));
                jsonObject.addProperty("success", true);
            }
        }

        session.close();
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(jsonObject));
    }

}
