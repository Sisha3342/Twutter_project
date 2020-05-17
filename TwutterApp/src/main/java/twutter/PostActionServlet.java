package twutter;

import com.google.gson.Gson;
import postInstances.Filter;
import postInstances.Post;
import postInstances.PostsList;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
        Map<String, String[]> map = req.getParameterMap();

        if (reqUri.length == 3 && reqUri[2].equals("search")) {
            Gson gson = new Gson();

            resp.getWriter().print(posts.getPosts(0, posts.getLength(), null).stream().map(gson::toJson).
                    collect(Collectors.joining("\n")));
        }
        else if (map.containsKey("skip")) {
            Gson gson = new Gson();

            Filter.Builder filterBuilder = new Filter.Builder();

            if (map.containsKey("author") && !map.get("author")[0].equals("")) {
                filterBuilder.setAuthor(map.get("author")[0]);
            }

            try {
                if (map.containsKey("startDate") && !map.get("startDate")[0].equals("")) {
                    filterBuilder.setStartDate(new SimpleDateFormat("yy-MM-dd HH:mm:ss").parse(map.get("startDate")[0]));
                }

                if (map.containsKey("endDate") && !map.get("endDate")[0].equals("")) {
                    filterBuilder.setEndDate(new SimpleDateFormat("yy-MM-dd HH:mm:ss").parse(map.get("endDate")[0]));
                }
            } catch (ParseException ex) {
                return ;
            }

            if (map.containsKey("hashTags") && !map.get("hashTags")[0].equals("")) {
                filterBuilder.setHashTags(List.of(map.get("hashTags")[0].split(",")));
            }

            resp.getWriter().print(posts.getPosts(Integer.parseInt(map.get("skip")[0]),
                    Integer.parseInt(map.get("top")[0]), filterBuilder.build()).stream().map(gson::toJson).
                    collect(Collectors.joining("\n")));
        }
        else {
            Post postToAdd;

            try {
                postToAdd = new Post.Builder(map.get("id")[0], map.get("description")[0],
                        new SimpleDateFormat("yy-MM-dd HH:mm:ss").parse(map.get("createdAt")[0]), map.get("author")[0]).
                        setLikes(new ArrayList<>()).
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
