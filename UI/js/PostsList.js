class PostsList {
    constructor(posts) {
        this._posts = posts.concat();
    }

    getPage(skip=0, top=10, filterConfig=undefined) {
        let postsToReturn = this._posts.concat();

        if (filterConfig) {
            for(let property in filterConfig) {
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
            else if (post2.createdAt < post1.createdAt) {
                return -1;
            }
            else {
                return 0;
            }
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
                return post.hashTags && post.likes.every(tag => typeof tag === 'string');
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
        for(let property in post) {
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

    getLength() {
        return this._posts.length;
    }
}

function* generatePosts(postsCount) {
    let date = new Date;

    for(let i = 0; i < postsCount; i++) {
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
    constructor(post, isAuthorized) {
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
        postHeader.innerHTML = '<h3>' + this._post.author + ', ' + this._post.createdAt.toLocaleString() + '</h3>';
        postHeader.innerHTML += '<i>' + this._post.hashTags.map(post => {
            return '#' + post;
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

testPosts = new PostsList([...generatePosts(40)]);

class View {
    constructor() {
        this._is_authorized = true;
        this._posts = document.querySelector('.posts');
        this._postsList = testPosts;
        this._postsToShowCount = 10;
    }

    setPostsToShowCount(count) {
        this._postsToShowCount = count;
        this.refreshPage();
    }

    setPostsList(postsList) {
        this._postsList = postsList;
        this._postsToShowCount = 10;
        this.refreshPage();
    }

    refreshPage() {
        this._authorizedUserDisplay();
        this._authorizedAddDisplay();

        this._posts.innerHTML = '';

        this._postsList.getPage(undefined, this._postsToShowCount)._posts.forEach(post => {
            this._posts.append((new PostDiv(post)).getPostDiv());
        });

        this._authorizedPostDisplay();
    }

    _authorizedUserDisplay() {
        if (!this._is_authorized) {
            document.querySelector('.log-out').style.visibility = 'hidden';
            document.querySelector('.user-info').style.visibility = 'hidden';
        }
    }

    _authorizedPostDisplay() {
       if (!this._is_authorized) {
           let actionButtons = document.querySelectorAll('.post-actions-buttons');
           actionButtons.forEach(element => {
               element.style.visibility = 'hidden';
           });
       }
    }

    _authorizedAddDisplay() {
        if (!this._is_authorized) {
            document.querySelector('.add-button').style.visibility = 'hidden';
        }
    }

    displayPage(page) {
        let pageHandlers = {addPostPage: this._showAddPostPage,
                            editPostPage: this._showEditPostPage,
                            mainPage: this._showMainPage,
                            authPage: this._showAuthPage};

        for (let handler in pageHandlers) {
            if (handler === page) {
                pageHandlers[handler]('visible');
            }
            else {
                pageHandlers[handler]('hidden');
            }
        }
    }

    _showMainPage(visibility) {
        if (visibility === 'hidden') {
            document.querySelector('.content').remove();
            return ;
        }

        let content = document.createElement('div');
        content.className = 'content';
        
        content.innerHTML = `
        <form name="filtersForm" class="filters">
            <h1>Filters</h1>

            <div class="filter">
                <p>Name</p>
                <input name="nameInput" type="text" placeholder="Name">
            </div>

            <div class="filter">
                <p>Date</p>
                
                <input name="startDateInput" type="date">
                <input name="endDateInput" type="date">

            </div>

            <div class="filter">
                <p>Hashtags</p>
                <input name="hashTagsInput" type="text" placeholder="Tags">
            </div>

            <input type="submit" class="apply-filters" value="apply">
        </form>

        <div class="news-seed">
            <button class="add-button">Add post</button>

            <div class="posts">
                <script src="js/PostsList.js"></script>
            </div>
            
            <button class="more-button">Load more</button>

            <script src="js/controller.js"></script>
        </div>
        `

        document.querySelector('.header').after(content);
    }

    
    _showAddPostPage(visibility) {
        if (visibility == hidden) {
            return ;
        }
    }

    
    _showEditPostPage(visibility) {
        
    }

    
    _showAuthPage(visibility) {
        
    }
}

let view = new View();
view.refreshPage();

function addPost(post) {
    if (view._postsList.add(post)) {
        view.refreshPage();
        return true;
    }

    return false;
}



function removePost(id) {
    if (view._postsList.remove(id)) {
        view.refreshPage();
        return true;
    }

    return false;
}

function editPost(id, post) {
    if (view._postsList.edit(id, post)) {
        refreshPage();
        return true;
    }

    return false;
}