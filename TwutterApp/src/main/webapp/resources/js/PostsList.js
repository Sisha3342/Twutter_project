class PostsList {
    constructor(posts) {
        this._posts = posts.concat();
    }

    async getPage(skip=0, top=10, filterConfig=undefined) {
        let filterPosts = await fetch('http://localhost:8080/tweets?skip=' + skip + '&top=' + top, {
            method: 'POST',
            body: filterConfig
        });

        return (await filterPosts).text();
    }

    get(id) {
        return this._posts.find(post => post.id === id);
    }

    async add(post) {
        let addPost = await fetch('http://localhost:8080/tweets', {
            method: 'POST',
            body: post
        });

        return (await addPost).text();
    }

    async remove(id) {
        let removePost = await fetch('http://localhost:8080/tweets?id=' + id, {
            method: 'DELETE'
        });

        return (await removePost).text();
    }

    async edit(id, post) {
        let editPost = await fetch('http://localhost:8080/tweets?id=' + id, {
            method: 'PUT',
            body: JSON.stringify(post)
        });

        return (await editPost).text();
    }

    getLength() {
        return this._posts.length;
    }

    findMaxId() {
        let maxId = Number.MIN_SAFE_INTEGER;

        for (let post of this._posts) {
            if (parseInt(post.id) > maxId) {
                maxId = parseInt(post.id);
            }
        }

        return maxId.toString();
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