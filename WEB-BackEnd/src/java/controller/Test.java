package controller;

import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import model.entity.User;
import model.entity.UserStatus;
import org.hibernate.Session;

@WebServlet(name = "Test", urlPatterns = {"/Test"})
public class Test extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();

        UserStatus userStatus = (UserStatus) session.load(UserStatus.class, 2);

        User user = new User();
        user.setName("Vihanga Heshan");
        user.setMobile("0719892932");
        user.setDateTime(new Date());
        user.setStatus(userStatus);

        session.save(user);
        session.beginTransaction().commit();

        System.out.println("Registration Complete");
    }

}
