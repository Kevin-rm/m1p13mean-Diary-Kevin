import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { Button } from "primeng/button";
import { Carousel } from "primeng/carousel";
import { Rating } from "primeng/rating";
import { Skeleton } from "primeng/skeleton";
import { PublicService } from "@core/domains/public/public.service";
import { ProductCard } from "@frontoffice/components/product-card/product-card";

@Component({
  selector: "app-landing",
  imports: [RouterLink, FormsModule, Button, Carousel, Rating, Skeleton, ProductCard],
  templateUrl: "./landing.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing {
  private readonly publicService = inject(PublicService);

  private readonly shopsQuery = injectQuery(() =>
    this.publicService.listShopsQueryOptions({ limit: 4, sort: "-rating" }),
  );

  private readonly productsQuery = injectQuery(() =>
    this.publicService.listProductsQueryOptions({ limit: 8, sort: "newest" }),
  );

  private readonly categoriesQuery = injectQuery(() =>
    this.publicService.listCategoriesQueryOptions(),
  );

  protected readonly shops = computed(() => this.shopsQuery.data()?.data ?? []);
  protected readonly shopsLoading = computed(() => this.shopsQuery.isPending());

  protected readonly products = computed(() => this.productsQuery.data()?.data ?? []);
  protected readonly productsLoading = computed(() => this.productsQuery.isPending());

  protected readonly categories = computed(() => this.categoriesQuery.data()?.data ?? []);

  protected readonly carouselOptions = [
    { breakpoint: "1280px", numVisible: 3, numScroll: 1 },
    { breakpoint: "768px", numVisible: 2, numScroll: 1 },
    { breakpoint: "560px", numVisible: 1, numScroll: 1 },
  ];
}
