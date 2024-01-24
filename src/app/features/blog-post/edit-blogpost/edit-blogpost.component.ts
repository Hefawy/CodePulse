import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { UpdateBlogPost } from '../models/update-blog-post.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrls: ['./edit-blogpost.component.css']
})
export class EditBlogpostComponent implements OnInit, OnDestroy {


  id: string | null = null;
  model?: BlogPost;
  categories$? : Observable<Category[]>;
  selectedcategories?: string[];
  isImageSelectorVisible : boolean = false;

 /* /|\ ***** Subscription ***** /|\ */
  routeSubscription ?: Subscription;
  updateBlogPostSubscription ?: Subscription;
  getBlogPostSubscription ?: Subscription;
  deleteBlogPostSubscription ?: Subscription;
  imageSelectSubsription ?: Subscription;

  constructor(private route: ActivatedRoute,
    private blogPostService: BlogPostService,
    private categoryService: CategoryService,
    private router: Router,
    private imageService: ImageService){
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

    this.route.paramMap.subscribe({
      next: (params)=>{
        this.id = params.get('id');


        //get BlogPost From Api
        if(this.id){
          this.getBlogPostSubscription = this.blogPostService.getBlogPostById(this.id).subscribe({
            next: (response)=>{
              this.model = response;
              console.log(this.model);
              this.selectedcategories = response.categories.map(x => x.id);
            }
          });
        }

        this.imageSelectSubsription = this.imageService.onSelectImage()
        .subscribe({
          next:(response) =>{
            if(this.model){
              this.model.featuredImageUrl = response.url;
              this.isImageSelectorVisible = false;
            }
          }
        });
      }
    });
  }


  onFormSubmit(): void{
    // Convert This Model To Request Object
    if(this.model && this.id){
      var updateBlogPost: UpdateBlogPost = {
          author: this.model.author,
          content: this.model.content,
          featuredImageUrl: this.model.featuredImageUrl,
          publishedDate: this.model.publishedDate,
          shortDescription: this.model.shortDescription,
          isVisible: this.model.isVisible,
          urlHandle: this.model.urlHandle,
          title: this.model.title,
          categories: this.selectedcategories ?? []
      };

      this.updateBlogPostSubscription =  this.blogPostService.updateBlogPost(this.id, updateBlogPost)
      .subscribe({
        next: (response) =>{
          this.router.navigateByUrl('/admin/blogposts');
        }
      });
    }
  }

  onDelete(): void{
    if(this.id){
      this.blogPostService.deleteBlogPost(this.id)
      .subscribe({
        next: (response) =>{
          this.router.navigateByUrl('/admin/blogposts');
        }
      });
    }
  }

  openImageSelector():void{
      this.isImageSelectorVisible = true;
    }

  closeImageSelector() {
      this.isImageSelectorVisible = false;
    }
  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.updateBlogPostSubscription?.unsubscribe();
    this.getBlogPostSubscription?.unsubscribe();
    this.imageSelectSubsription?.unsubscribe();
  }

}
