package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import model.entity.User;
import model.validators.Validators;
import org.hibernate.Session;

@WebServlet(name = "ChangeName", urlPatterns = {"/ChangeName"})
public class ChangeName extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("success", false);

        int userID = Integer.valueOf(req.getParameter("user"));
        String name = req.getParameter("name");
        User user = (User) session.get(User.class, userID);

        if (name.isEmpty()) {
            jsonObject.addProperty("message", "Name is required. Please enter your Name.");
        } else if (!Validators.checkWordCount(name, 2)) {
            jsonObject.addProperty("message", "The name must include both a first name and a last name.");
        } else {
            try {
                user.setName(name);
                session.update(user);
                session.beginTransaction().commit();
                jsonObject.addProperty("success", true);
                jsonObject.addProperty("message", "Name changed.");
            } catch (Exception e) {
                jsonObject.addProperty("message", "Modification failed.");
            }
        }
        
        session.close();
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(jsonObject));
    }

}
