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
import model.entity.RelationShip;
import model.entity.User;
import org.hibernate.Session;

@WebServlet(name = "SaveContact", urlPatterns = {"/SaveContact"})
public class SaveContact extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();
        JsonObject jsonObject = new JsonObject();

        int contactID = Integer.valueOf(req.getParameter("contact"));
        String name = req.getParameter("name");
        int user = Integer.valueOf(req.getParameter("user"));

        User userObject = (User) session.get(User.class, user);
        User relativeObject = (User) session.get(User.class, contactID);

        RelationShip relationShip = new RelationShip();
        relationShip.setName(name);
        relationShip.setUser(userObject);
        relationShip.setRelative(relativeObject);

        session.save(relationShip);
        session.beginTransaction().commit();

        jsonObject.addProperty("success", true);

        session.close();
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(jsonObject));
    }

}
