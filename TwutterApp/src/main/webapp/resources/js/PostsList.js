class PostsList {
    constructor(posts) {
        this._posts = posts.concat();
    }

    getPage(skip=0, top=this._posts.length, filterConfig=undefined) {
        let postsToReturn = this._posts.concat();

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

    get(id) {
        return this._posts.find(post => post.id === id);
    }

    static _validate_property(post, property) {
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
                return post.hashTags && post.hashTags.every(tag => typeof tag === "string");
            case "likes":
                return post.hashTags && post.likes.every(tag => typeof tag === "string");
            case "photoLink":
                return typeof post.photoLink === "string";
            default:
                return false;
        }
    }

    static validate(post) {
        let validProperty = PostsList._validate_property;

        return validProperty(post, "id") &&
            validProperty(post, "description") &&
            validProperty(post, "createdAt") &&
            validProperty(post, "author") &&
            validProperty(post, "hashTags") &&
            validProperty(post, "likes");
    }

    add(post) {
        if (PostsList.validate(post)) {
            this._posts.push(post);

            return true;
        }

        return false;
    }

    remove(id) {
        let postIndex = this._posts.findIndex(post => post.id === id)

        if (postIndex !== -1) {
            this._posts.splice(postIndex, 1);

            return true;
        }

        return false;
    }

    static _validateEditPost(post) {
        for(let property in post) {
            if (property === "id" || property === "createdAt" || property === "author" || property === "likes") {
                return false;
            }
            else if (!PostsList._validate_property(post, property)) {
                return false;
            }
        }

        return true;
    }

    edit(id, post) {
        if (!PostsList._validateEditPost(post)) {
            return false;
        }

        let postToEdit = this.get(id);

        for(let property in post) {
            postToEdit[property] = post[property];
        }

        return true;
    }

    addAll(newPosts) {
        let invalidPosts = [];

        for (let post in newPosts) {
            if (PostsList.validate(post)) {
                this.add(post);
            }
            else {
                invalidPosts.push(post);
            }
        }

        return invalidPosts;
    }

    clear() {
        this._posts = [];
    }
}

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

testPosts = new PostsList([...generatePosts(20)]);

console.log("----------------------------------------------------");
console.log("top 5 posts (1 skipped) with hashTags containing js");
testPosts.getPage(1, 5, {"hashTags": ["js"]}).forEach(function (post) {
    console.log(post);
});

console.log("----------------------------------------------------");
console.log("get first post test");
console.log(testPosts.get("0"));

console.log("----------------------------------------------------");
console.log("validate valid post");
console.log(PostsList.validate({id: "2", createdAt: new Date(),
    description: "test", author: "sasha", hashTags: [], likes: []}));
console.log("validate invalid post");
console.log(PostsList.validate({id: "1"}));

console.log("----------------------------------------------------");
console.log("Add post and then get it");
testPosts.add({id: "123", createdAt: new Date(),
    description: "test description", author: "alex", hashTags: [], likes: []});
console.log(testPosts.get("123"));

console.log("----------------------------------------------------");
console.log("Edit 0'th post (already exists");
testPosts.edit("0", {photoLink: "edited link"});
console.log(testPosts.get("0"));

console.log("----------------------------------------------------");
console.log("test remove 0'th post");
console.log(testPosts.remove("0"));
console.log("----------------------------------------------------");

console.log("----------------------------------------------------");
console.log("Test clearing the page");
testPosts.clear();
console.log("Array length: %d", testPosts.getPage().length);
console.log("----------------------------------------------------");