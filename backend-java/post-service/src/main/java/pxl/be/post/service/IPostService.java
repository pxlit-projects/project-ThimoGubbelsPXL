package pxl.be.post.service;

import pxl.be.post.api.data.CreatePostRequest;
import pxl.be.post.api.data.PostResponse;

import java.util.List;

public interface IPostService {
    void createPost(CreatePostRequest createPostRequest);
    void updatePost(Long postId, CreatePostRequest createPostRequest);
    List<PostResponse> getAllPosts();


}
