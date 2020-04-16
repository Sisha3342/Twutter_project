package twutter;

import java.util.Date;
import java.util.List;

public class Post {
    private String id;
    private String description;
    private Date createdAt;
    private String author;
    private String photoLink;
    private List<String> hashTags;
    private List<String> likes;

    public Post(String id, String description, Date createdAt, String author, String photoLink,
                List<String> hashTags, List<String> likes) {
        this.id = id;
        this.description = description;
        this.createdAt = (Date)createdAt.clone();
        this.author = author;
        this.photoLink = photoLink;
        this.hashTags = List.copyOf(hashTags);
        this.likes = List.copyOf(likes);
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = (Date)createdAt.clone();
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public void setPhotoLink(String photoLink) {
        this.photoLink = photoLink;
    }

    public void setHashTags(List<String> hashTags) {
        this.hashTags = List.copyOf(hashTags);
    }

    public void setLikes(List<String> likes) {
        this.likes = List.copyOf(likes);
    }

    public String getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public String getAuthor() {
        return author;
    }

    public String getPhotoLink() {
        return photoLink;
    }

    public List<String> getHashTags() {
        return hashTags;
    }

    public List<String> getLikes() {
        return likes;
    }
}
