package pxl.be.post.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pxl.be.post.api.data.CreatePostRequest;
import pxl.be.post.api.data.PostResponse;
import pxl.be.post.api.data.PublicPostResponse;
import pxl.be.post.api.data.ReviewMessage;

import java.util.Date;
import java.util.List;

public interface IPostService {
    void createPost(CreatePostRequest createPostRequest);
    void updatePost(Long postId, CreatePostRequest createPostRequest);
    void publishPost(Long postId);
    List<PostResponse> getAllPosts();
    Page<PublicPostResponse> getAllPublicPosts(Pageable pageable);

    void updatePostReview(ReviewMessage reviewMessage);
}
