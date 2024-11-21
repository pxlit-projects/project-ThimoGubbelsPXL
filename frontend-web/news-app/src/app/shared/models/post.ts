export class Post {
    title: string;
    content: string;
    author: string;
    date: Date;


    constructor(title: string, content: string, author: string, date: Date) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.date = date;
    }
 
  }