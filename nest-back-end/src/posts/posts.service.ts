const fs = require('fs');
import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create.post.dto';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) { }

    async createPost(createPostDto: CreatePostDto): Promise<Post> {
        let post;
        post = new this.postModel(createPostDto);

        try {
            await post.save();
        } catch (error) {
            throw new BadRequestException('Post fields missing')
        }

        return post;

    }

    async findAllPosts(filters, nskip): Promise<Post[]> {
        const posts = await this.postModel.find(filters).skip(nskip).limit(10).sort({ date: -1 });
        if (process.env.NODE_ENV !== 'production') posts.map(p => p.image = `http://localhost:3000/${p.image}`);
        return posts;
    }

    async findPostById(id): Promise<Post> {
        let post;
        try {
            post = await this.postModel.findById(id);
        } catch (error) {
            throw new InternalServerErrorException('Server error');
        }

        if (!post)
            throw new NotFoundException('Post not found');

        return post;
    }


    async deletePostById(id) {
        let post;
        try {
            post = await this.postModel.findById(id);
        } catch (error) {
            throw new InternalServerErrorException('Server error');
        }

        if (!post)
            throw new NotFoundException('Post not found');

        if (post.image !== '302eb834-04b4-402d-80b9-b528bebe2fe4.png')
            try {
                fs.unlinkSync(`./uploads/${post.image}`)
                //file removed
            } catch (err) {
                console.error(err)
            }

        await post.remove();
    }

    async updatePostById(id, p): Promise<Post> {        
        let post;
        try {
            post = await this.postModel.findById(id);
        } catch (error) {
            throw new InternalServerErrorException('Server error');
        }

        if (!post)
            throw new NotFoundException('Post not found');

        if (post.passphrase !== p.passphrase)
            throw new BadRequestException('Passphrase does not match')

        if (p.image) {
            if (post.image !== '302eb834-04b4-402d-80b9-b528bebe2fe4.png') {
                try {
                    fs.unlinkSync(`./uploads/${post.image}`)
                    //file removed
                } catch (err) {
                    console.error(err)
                }
            }

            post.image = p.image;
        }

        for (const property in p)
            post[property] = p[property];

        post.approved = false;

        await post.save();
        return post;
    }

    async approvePost(id): Promise<Post> {
        let post;
        try {
            post = await this.postModel.findById(id);
        } catch (error) {
            throw new InternalServerErrorException('Server error');
        }

        if (!post)
            throw new NotFoundException('Post not found');


        post.approved = true;
        return post.save();
    }
}
