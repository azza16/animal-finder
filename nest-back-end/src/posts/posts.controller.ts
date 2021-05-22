const path = require('path');
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UploadedFile, UseInterceptors, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreatePostDto } from './dto/create.post.dto';
import { PostsService } from './posts.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) { }

    @Post('new')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                if (file) {
                    const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                    const extension: string = path.parse(file.originalname).ext;

                    cb(null, `${filename}${extension}`)
                }
            }
        })
    }))
    async create(@UploadedFile() file: Express.Multer.File, @Body() createPostDto: CreatePostDto) {
        file ? createPostDto.image = file.filename : createPostDto.image = '302eb834-04b4-402d-80b9-b528bebe2fe4.png';

        const post = await this.postsService.createPost(createPostDto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Post added successfully!',
            data: post
        }
    }

    @Post()
    async findAll(@Body() params) {
        const posts = await this.postsService.findAllPosts(params.filters, params.nskip);
        return posts;
    }

    @Delete(':id')
    async deleteOne(@Param('id') id: string) {
        await this.postsService.deletePostById(id);
        return {
            statusCode: HttpStatus.NO_CONTENT,
            message: 'Post removed successfully!'
        }
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                if (file) {
                    const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                    const extension: string = path.parse(file.originalname).ext;

                    cb(null, `${filename}${extension}`)
                }
            }
        })
    }))
    async updateOne(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() postData) {
        if (file) postData['image'] = file.filename;
        const updatedPost = await this.postsService.updatePostById(id, postData);
        return {
            statusCode: HttpStatus.OK,
            message: 'Post updated successfully!',
            data: updatedPost
        }
    }

    @Patch(':id')
    async patchOne(@Param('id') id: string, @Body() post) {
        await this.postsService.approvePost(id)
        return {
            statusCode: HttpStatus.OK,
            message: 'Post approved successfully!',
        }
    }

}
