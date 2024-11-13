package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import model.dto.ContactDTO;
import model.dto.HomeChatDTO;
import model.entity.Chat;
import model.entity.ChatStatus;
import model.entity.RelationShip;
import model.entity.User;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "ContactList", urlPatterns = {"/ContactList"})
public class ContactList extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();
        JsonObject jsonObject = new JsonObject();
        List<ContactDTO> responseList = new ArrayList<>();

        int userID = Integer.valueOf(req.getParameter("user"));

        User user = (User) session.get(User.class, userID);

        Criteria userTable = session.createCriteria(User.class);
        userTable.add(Restrictions.ne("id", userID));
        userTable.addOrder(Order.asc("name"));
        List<User> userList = userTable.list();

        List<ContactDTO> hasRelationList = new ArrayList<>();
        List<ContactDTO> noRelationList = new ArrayList<>();

        for (User userItem : userList) {

            ContactDTO contactDTO = new ContactDTO();
            contactDTO.setUser(userItem);

            Criteria relationshipTable = session.createCriteria(RelationShip.class);
            relationshipTable.add(Restrictions.and(
                    Restrictions.eq("user", user),
                    Restrictions.eq("relative", userItem)
            ));
            relationshipTable.setMaxResults(1);

            String applicationPath = req.getServletContext().getRealPath("//profile_pictures").replace("\\build\\web", "\\web");
            String filePath = applicationPath + "//" + userItem.getMobile() + ".png";

            File file = new File(filePath);

            if (file.exists()) {
                contactDTO.setHasImage(true);
            } else {
                String[] words = userItem.getName().trim().split("\\s+");

                String firstLetter = words[0].substring(0, 1);
                String secondLetter = words[1].substring(0, 1);

                contactDTO.setLetterName(firstLetter + secondLetter);
            }

            if (!relationshipTable.list().isEmpty()) {
                RelationShip relationShip = (RelationShip) relationshipTable.uniqueResult();
                contactDTO.setHasRelationShip(true);
                contactDTO.setRelativeName(relationShip.getName());
                hasRelationList.add(contactDTO);
            } else {
                contactDTO.setHasRelationShip(false);
                noRelationList.add(contactDTO);
            }

        }

        hasRelationList.sort((c1, c2) -> {
            String relName1 = c1.getRelativeName();
            String relName2 = c2.getRelativeName();
            return relName1.compareTo(relName2);
        });

        noRelationList.sort((c1, c2) -> {
            String mobile1 = c1.getUser().getMobile();
            String mobile2 = c2.getUser().getMobile();
            return mobile1.compareTo(mobile2);
        });

        responseList.addAll(hasRelationList);
        responseList.addAll(noRelationList);

        jsonObject.add("usersList", gson.toJsonTree(responseList));

        session.beginTransaction().commit();
        session.close();
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(jsonObject));
    }

}
