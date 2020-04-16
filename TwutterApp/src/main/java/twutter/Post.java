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

    public static class Builder {
        private String id;
        private String description;
        private Date createdAt;
        private String author;

        private String photoLink = null;
        private List<String> hashTags = null;
        private List<String> likes = null;

        public Builder(String id, String description, Date createdAt, String author) {
            this.id = id;
            this.description = description;
            this.createdAt = (Date)createdAt.clone();
            this.author = author;
        }

        public Builder setPhotoLink(String photoLink) {
            this.photoLink = photoLink;
            return this;
        }

        public Builder setHashTags(List<String> hashTags) {
            this.hashTags = List.copyOf(hashTags);
            return this;
        }

        public Builder setLikes(List<String> likes) {
            this.likes = List.copyOf(likes);
            return this;
        }

        public Post build() {
            return new Post(this);
        }
    }

    private Post(Builder builder) {
        this.id = builder.id;
        this.description = builder.description;
        this.createdAt = builder.createdAt;
        this.author = builder.author;
        this.photoLink = builder.photoLink;
        this.hashTags = builder.hashTags;
        this.likes = builder.likes;
    }

    public void setDescription(String description) {
        this.description = description;
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
