class PostsList {
    constructor(posts) {
        this._posts = posts.concat();

        this.saveToLocalStorage();
    }

    getPage(skip=0, top=10, filterConfig=undefined) {
        let postsToReturn = this._posts.concat();

        if (filterConfig) {
            for (let property in filterConfig) {
                switch (property) {
                    case "hashTags":
                        for(let i = 0; i < filterConfig.hashTags.length; i++) {
                            postsToReturn = postsToReturn.filter(post => post.hashTags.includes(filterConfig.hashTags[i]));
                        }
                        break;
                    case "startDate":
                        postsToReturn = postsToReturn.filter(post => post.createdAt >= filterConfig.startDate);
                        break;
                    case "endDate":
                        postsToReturn = postsToReturn.filter(post => post.createdAt <= filterConfig.endDate);
                        break;
                    case "author":
                        postsToReturn = postsToReturn.filter(post => post["author"].includes(filterConfig["author"]));
                        break;
                    default:
                        postsToReturn = postsToReturn.filter(post => post[property] === filterConfig[property]);
                        break;
                }
            }
        }

        postsToReturn.sort(function (post1, post2) {
            if (post1.createdAt < post2.createdAt) {
                return 1;
            }
            
            if (post2.createdAt < post1.createdAt) {
                return -1;
            }
            
            return 0;   
        });

        return new PostsList(postsToReturn.slice(skip, skip + top));
    }

    get(id) {
        return this._posts.find(post => post.id === id);
    }

    static _validate_property(post, property) {
        switch (property) {
            case 'id':
                return typeof post.id === 'string';
            case 'description':
                return typeof post.description === 'string' && post.description.length < 200;
            case 'createdAt':
                return Object.prototype.toString.call(post.createdAt) === '[object Date]';
            case 'author':
                return typeof post.author === 'string' && post.author.length !== 0;
            case 'hashTags':
                return post.hashTags && post.hashTags.every(tag => typeof tag === 'string');
            case 'likes':
                return post.likes && post.likes.every(tag => typeof tag === 'string');
            case 'photoLink':
                return typeof post.photoLink === 'string';
            default:
                return false;
        }
    }

    static validate(post) {
        let validProperty = PostsList._validate_property;

        return validProperty(post, 'id') &&
               validProperty(post, 'description') &&
               validProperty(post, 'createdAt') &&
               validProperty(post, 'author') &&
               validProperty(post, 'hashTags') &&
               validProperty(post, 'likes');
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
        for (let property in post) {
            if (property === 'id' || property === 'createdAt' || property === 'author' || property === 'likes') {
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

        for (let property in post) {
            postToEdit[property] = post[property];
        }

        return true;
    }

    getLength() {
        return this._posts.length;
    }

    saveToLocalStorage() {
        localStorage.setItem('posts', JSON.stringify(this));
    }

    static restoreFromLocalStorage() {
        return new PostsList(JSON.parse(localStorage.getItem('posts'))._posts);
    }
}

function* generatePosts(postsCount) {
    let date = new Date;

    for (let i = 0; i < postsCount; i++) {
        if (i % 2 === 0) {
            yield {
                id: i.toString(),
                description: 'post number ' + i,
                createdAt: new Date(date.getTime() + i * 100000000),
                author: 'Sasha',
                hashTags: ['js' + i, 'task6'],
                likes: ['Misha', 'Alex', 'Mike']
            };
        }
        else {
            yield {
                id: i.toString(),
                description: 'post number ' + i,
                createdAt: new Date(date.getTime() - i * 100000000),
                author: 'Alex',
                photoLink: 'images/forest_image.png',
                hashTags: ['js', 'task6'],
                likes: ['Sasha']
            };
        }
    }
}

class PostDiv {
    constructor(post) {
        this._post = post;
    }

    getPostDiv() {
        let post = document.createElement('div');

        post.className = 'test-post';

        post.append(this._getPostHeader());
        post.append(this._getPostDescription());
        post.append(this._getPostFooter());

        return post;
    }

    _getPostHeader() {
        let postHeader = document.createElement('div');

        postHeader.className = 'post-header';
        postHeader.innerHTML = '<h3>' + this._post.author + '</h3>' + '<h4>' + this._post.createdAt.toLocaleString() + '</h4>';
        postHeader.innerHTML += '<i>' + this._post.hashTags.map(tag => {
            return '#' + tag;
        }); + '</i>';

        return postHeader;
    }

    _getPostDescription() {
        let postDescription = document.createElement('div');

        postDescription.className = 'post-description';
        postDescription.innerHTML = '<p>' + this._post.description + '</p>';

        if (this._post.hasOwnProperty('photoLink')) {
            let postDescriptionImage = document.createElement('img');

            postDescriptionImage.className = 'post-image';
            postDescriptionImage.setAttribute('src', this._post.photoLink);

            postDescription.append(postDescriptionImage);
        }

        return postDescription;
    }

    _getPostFooter() {
        let postFooter = document.createElement('div');
        let likesDisplay = document.createElement('span');
        let likesCount = document.createElement('span');
        let postButtons = document.createElement('div');
        let editButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        
        postFooter.className = 'post-footer';
        
        likesDisplay.className = 'likes-display';
        likesDisplay.innerHTML = '<img class="post-like" src="images/like_image.png">';
    
        likesCount.className = 'likes-count';
        likesCount.textContent = this._post.likes.length;

        likesDisplay.append(likesCount);

        postFooter.append(likesDisplay);
        
        postButtons.className = 'post-actions-buttons';
        postButtons.style.visibility = 'hidden';

        editButton.className = 'action-button';
        editButton.textContent = 'Edit';

        deleteButton.className = 'action-button';
        deleteButton.textContent = 'Delete';

        postButtons.append(editButton);
        postButtons.append(deleteButton);
        postFooter.append(postButtons);

        return postFooter;
    }
}