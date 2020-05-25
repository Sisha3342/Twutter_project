package postInstances;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Filter {
    private Date startDate;
    private Date endDate;
    private String author;
    private List<String> hashTags;

    private Filter(Builder builder) {
        this.startDate = builder.startDate;
        this.endDate = builder.endDate;
        this.author = builder.author;
        this.hashTags = builder.hashTags;
    }

    public static class Builder {
        private Date startDate = null;
        private Date endDate = null;
        private String author;
        private List<String> hashTags;

        public Builder() {
            hashTags = new ArrayList<>();
            author = "";
        }

        public Builder StartDate(Date date) {
            this.startDate = date;
            return this;
        }

        public Builder EndDate(Date date) {
            this.endDate = date;
            return this;
        }

        public Builder Author(String author) {
            this.author = author;
            return this;
        }

        public Builder HashTags(List<String> tags) {
            this.hashTags = tags;
            return this;
        }

        public Filter build() {return new Filter(this);};
    }

    public String getAuthor() {
        return author;
    }

    public Date getStartDate() {
        return startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public List<String> getHashTags() {
        return hashTags;
    }
}
