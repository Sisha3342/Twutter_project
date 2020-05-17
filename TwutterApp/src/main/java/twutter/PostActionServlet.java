package twutter;

import com.google.gson.Gson;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Date;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@MultipartConfig
public class PostActionServlet extends HttpServlet {
    private static PostsList posts = new PostsList(15);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String parameterName = "id";
        String postId = req.getParameter(parameterName);

        Post postToReturn = posts.getPost(postId);

        resp.getWriter().print((new Gson()).toJson(postToReturn));
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String parameterName = "id";
        String postId = req.getParameter(parameterName);

        resp.getWriter().print(posts.remove(postId));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String[] reqUri = req.getRequestURI().split("/");

        if (reqUri.length == 3 && reqUri[2].equals("search")) {
            Gson gson = new Gson();

            resp.getWriter().print(posts.getPosts().stream().map(gson::toJson).
                    collect(Collectors.joining("\n")));
        }
        else {
            Map<String, String[]> map = req.getParameterMap();

            Post postToAdd;
            try {
                postToAdd = new Post.Builder(map.get("id")[0], map.get("description")[0],
                        new SimpleDateFormat("yy-MM-dd HH:mm:ss").parse(map.get("createdAt")[0]), map.get("author")[0]).
                        setLikes(Collections.emptyList()).
                        setHashTags(List.of(map.get("hashTags")[0].split(","))).build();
            } catch (ParseException e) {
                return ;
            }

            if (map.containsKey("photoLink")) {
                postToAdd.setPhotoLink(map.get("photoLink")[0]);
            }

            resp.getWriter().write(String.valueOf(posts.add(postToAdd)));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String parameterName = "id";
        String postId = req.getParameter(parameterName);

        Post editedPost = (new Gson()).fromJson(req.getReader().readLine(), Post.class);

        resp.getWriter().print(posts.edit(postId, editedPost));
    }
}
