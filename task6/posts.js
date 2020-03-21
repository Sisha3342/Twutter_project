;(function() {
    function* generatePosts(postsCount) {
        let date = new Date;

        for(let i = 0; i < postsCount; i++) {
            if (i % 2 === 0) {
                yield {
                    id: i.toString(),
                    description: "I'm post number " + i,
                    createdAt: new Date(date.getTime() + i * 10000),
                    author: "Sasha" + i,
                    hashTags: ["js" + i, "task6"],
                    likes: ["Misha", "Alex", "Mike"]
                };
            }
            else {
                yield {
                    id: i.toString(),
                    description: "I'm post number " + i,
                    createdAt: new Date(date.getTime() - i * 10000),
                    author: "Alex",
                    photoLink: "link number " + i,
                    hashTags: ["js", "task6"],
                    likes: ["Sasha"]
                };
            }
        }
    }

    let posts = [...generatePosts(20)];

    function getPosts(skip=0, top=10, filterConfig=undefined) {
        let postsToReturn = posts.concat();

        if (filterConfig) {
            for(let property in filterConfig) {
                if (property === "hashTags") {
                    for(let i = 0; i < filterConfig.hashTags.length; i++) {
                        postsToReturn = postsToReturn.filter(post => post.hashTags.includes(filterConfig.hashTags[i]))
                    }
                }
                else {
                    postsToReturn = postsToReturn.filter(post => post[property] === filterConfig[property]);
                }
            }
        }

        postsToReturn.sort(function (post1, post2) {
            if (post1.createdAt < post2.createdAt) {
                return 1;
            }
            else if (post2.createdAt < post1.createdAt) {
                return -1;
            }
            else {
                return 0;
            }
        });

        return postsToReturn.slice(skip, skip + top);
    }

    function getPost(id) {
        return posts.find(post => post.id === id);
    }

    function validatePostProperty(post, property) {
        switch (property) {
            case "id":
                return typeof post.id === "string";
            case "description":
                return typeof post.description === "string" && post.description.length < 200;
            case "createdAt":
                return Object.prototype.toString.call(post.createdAt) === '[object Date]';
            case "author":
                return typeof post.author === "string" && post.author.length !== 0;
            case "hashTags":
                return post.hashTags.every(tag => typeof tag === "string");
            case "likes":
                return post.likes.every(tag => typeof tag === "string");

        }
    }

    function validatePost(post) {
        return validatePostProperty(post, "id") &&
               validatePostProperty(post, "description") &&
               validatePostProperty(post, "createdAt") &&
               validatePostProperty(post, "author") &&
               validatePostProperty(post, "hashTags") &&
               validatePostProperty(post, "likes");
    }

    function addPost(post) {
        if (validatePost(post)) {
            posts.push(post);

            return true;
        }

        return false;
    }

    function checkEditPost(post) {
        for(let property in post) {
            if (property === "id" || property === "createdAt" || property === "author" || property === "likes") {
                return false;
            }
            else if (!validatePostProperty(post, property)) {
                return false;
            }
        }

        return true;
    }

    function editPost(id, post) {
        if (!checkEditPost(post)) {
            return false;
        }

        let postToEdit = getPost(id);

        for(let property in post) {
            postToEdit[property] = post[property];
        }

        return true;
    }

    function removePost(id) {
        let postIndex = posts.findIndex(post => post.id === id)

        if (postIndex !== -1) {
            posts.splice(postIndex, 1);

            return true;
        }

        return false;
    }
}());