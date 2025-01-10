export class Comment{
    id: Number;
    postId: Number;
    content: string;
    author: string;
    date: Date;

    constructor(id: Number, postId: Number, content: string, author: string, date: Date){
        this.id = id;
        this.postId = postId;
        this.content = content;
        this.author = author;
        this.date = date;
    }

}