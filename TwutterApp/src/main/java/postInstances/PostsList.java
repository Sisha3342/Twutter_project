package postInstances;

import org.apache.commons.lang3.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

public class PostsList {
    private List<Post> posts;

    public PostsList(int postsCount) {
        posts = new ArrayList<>();

        for (int i = 0; i < postsCount; i++) {
            if (i % 2 == 0) {
                this.add(new Post.Builder(String.valueOf(i), "post number" + i, new Date(), "Sasha")
                        .setHashTags(List.of("js" + i, "task12"))
                        .setLikes(List.of("Alex", "Misha", "Mike"))
                        .build());
            }
            else {
                this.add(new Post.Builder(String.valueOf(i),
                        "post number" + i,
                        new Date(i * 100000000),
                        "Alex")
                        .setPhotoLink("images/forest_image.png")
                        .setHashTags(List.of("js", "task12"))
                        .setLikes(List.of("Sasha"))
                        .build());
            }
        }
    }

    public Post getPost(String id) {
        return posts.stream().filter(post -> post.getId().equals(id)).findFirst().orElse(null);
    }

    public static boolean validate(Post post) {
        return  post.getId() != null && !post.getId().isEmpty() &&
                post.getDescription() != null && post.getDescription().length() < 200 &&
                post.getCreatedAt() != null &&
                post.getAuthor() != null && post.getAuthor().length() > 0;
    }

    public boolean add(Post post) {
        if (validate(post)) {
            posts.add(post);

            return true;
        }

        return false;
    }

    public boolean remove(String id) {
        return posts.removeIf(post -> post.getId().equals(id));
    }

    public boolean edit(String id, Post post) {
        Post foundPost = this.getPost(id);

        if (post == null || post.getId() != null || post.getAuthor() != null ||
                post.getCreatedAt() != null) {
            return false;
        }

        if (post.getDescription() != null) {
            foundPost.setDescription(post.getDescription());
        }

        if (post.getPhotoLink() != null) {
            post.setPhotoLink(post.getPhotoLink());
        }

        if (post.getHashTags() != null) {
            foundPost.setHashTags(post.getHashTags());
        }

        if (post.getLikes() != null) {
            foundPost.setLikes(post.getLikes());
        }

        return true;
    }

    public List<Post> getPosts(int skip, int top, Filter filter) {
        List<Post> filteredPosts = posts.subList(skip, skip + top);

        if (filter != null) {
            if (StringUtils.isNotEmpty(filter.getAuthor())) {
                filteredPosts = filteredPosts.stream().filter(post -> post.getAuthor().
                        equals(filter.getAuthor())).collect(Collectors.toList());
            }

            if (filter.getStartDate() != null) {
                filteredPosts = filteredPosts.stream().filter(post -> post.getCreatedAt().
                        after(filter.getStartDate())).collect(Collectors.toList());
            }

            if (filter.getEndDate() != null) {
                filteredPosts = filteredPosts.stream().filter(post -> post.getCreatedAt().
                        before(filter.getEndDate())).collect(Collectors.toList());
            }

            if (!filter.getHashTags().isEmpty()) {
                filteredPosts = filteredPosts.stream().filter(post -> post.getHashTags().
                        containsAll(filter.getHashTags())).collect(Collectors.toList());
            }
        }

        filteredPosts.sort((post1, post2) -> {
            if (post1.getCreatedAt().after(post2.getCreatedAt())) {
                return -1;
            }

            if (post1.getCreatedAt().before(post2.getCreatedAt())) {
                return 1;
            }

            return 0;
        });

        return filteredPosts;
    }

    public int getLength() {
        return posts.size();
    }
}
