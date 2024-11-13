package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.File;
import java.io.IOException;
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
import model.entity.Group;
import model.entity.GroupMemberStatus;
import model.entity.GroupUser;
import model.entity.User;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@MultipartConfig
@WebServlet(name = "CreateGroup", urlPatterns = {"/CreateGroup"})
public class CreateGroup extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("success", false);

        try {
            String name = req.getParameter("name");
            int userId = Integer.parseInt(req.getParameter("user"));
            Part image = req.getPart("image");
            User user = (User) session.get(User.class, userId);

            // Create new Group
            Group group = new Group();
            group.setName(name);
            session.save(group);

            GroupMemberStatus groupMemberStatus = getMemberStatus(session); // Get Owner Status

            // Add the Creater as Owner of the group
            GroupUser groupUser = new GroupUser();
            groupUser.setGroup(group);
            groupUser.setUser(user);
            groupUser.setStatus(groupMemberStatus);
            session.save(groupUser);

            jsonObject.addProperty("hasImage", false);
            try {
                if (image != null) {
                    // Save profile image
                    String serverPath = req.getServletContext().getRealPath("").replace("\\build\\web", "\\web");
                    String imagePath = serverPath + File.separator + "group_pictures" + File.separator + "group(" + group.getId() + ").png";
                    File file = new File(imagePath);
                    Files.copy(
                            image.getInputStream(),
                            file.toPath(),
                            StandardCopyOption.REPLACE_EXISTING
                    );
                    jsonObject.addProperty("hasImage", true);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            session.beginTransaction().commit();
            jsonObject.addProperty("success", true);
            jsonObject.addProperty("groupID", group.getId());
        } catch (NumberFormatException e) {
            System.out.println(e);
        } finally {
            session.close();
            resp.setContentType("application/json");
            resp.getWriter().write(gson.toJson(jsonObject));
        }
    }

    public GroupMemberStatus getMemberStatus(Session session) {
        Criteria criteria = session.createCriteria(GroupMemberStatus.class);
        criteria.add(Restrictions.eq("status", "Owner"));
        GroupMemberStatus groupMemberStatus = (GroupMemberStatus) criteria.uniqueResult();
        return groupMemberStatus;
    }

}
