package pxl.be.post.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pxl.be.post.api.data.CreatePostRequest;
import pxl.be.post.api.data.EmployeeResponse;
import pxl.be.post.domain.Employee;
import pxl.be.post.domain.Post;
import pxl.be.post.repository.PostRepository;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService{
    private final PostRepository postRepository;

    public void createPost(CreatePostRequest createPostRequest){
        Post post = Post.builder()
                .title(createPostRequest.getTitle())
                .content(createPostRequest.getContent())
                .author(createPostRequest.getAuthor())
                .date(createPostRequest.getDate()).build();
        postRepository.save(post);
    }


}
