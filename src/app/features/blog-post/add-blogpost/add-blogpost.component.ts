import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { Observable, Subscription } from 'rxjs';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit,OnDestroy {

  isImageSelectorVisible : boolean = false;
  model: AddBlogPost;
  categories$?: Observable<Category[]>;


  imageSelectSubsription ?: Subscription;

  constructor(private blogPostService: BlogPostService
    ,private router: Router, private categoryService: CategoryService,
    private imageService: ImageService){
    this.model = {
      title: '',
      urlHandle: '',
      shortDescription: '',
      publishedDate: new Date(),
      isVisible: true,
      featuredImageUrl: '',
      content: '',
      author: '',
      categories:[]
    }
  }

  

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

    this.imageSelectSubsription = this.imageService.onSelectImage()
    .subscribe({
      next:(response) =>{
        if(this.model){
          this.model.featuredImageUrl = response.url;
          this.closeImageSelector();
        }
      }
    });
  }

  onFormSubmit(): void {
      console.log(this.model);
      this.blogPostService.createBlogPost(this.model)
      .subscribe({
        next:(response)=>{
          this.router.navigateByUrl('/admin/blogposts');
        }
      });
    }

    openImageSelector():void{
      this.isImageSelectorVisible = true;
    }

  closeImageSelector() {
      this.isImageSelectorVisible = false;
    }

    ngOnDestroy(): void {
      this.imageSelectSubsription?.unsubscribe();
    }

}
