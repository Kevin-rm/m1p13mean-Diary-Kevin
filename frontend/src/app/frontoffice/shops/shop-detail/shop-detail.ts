import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import {
  injectMutation,
  injectQuery,
  keepPreviousData,
  QueryClient,
} from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";
import { Divider } from "primeng/divider";
import { GalleriaModule } from "primeng/galleria";
import { Paginator, PaginatorState } from "primeng/paginator";
import { Rating } from "primeng/rating";
import { Textarea } from "primeng/textarea";
import { Button } from "primeng/button";
import { AuthService } from "@auth/auth.service";
import { PublicService } from "@core/domains/public/public.service";
import { ReviewService } from "@core/domains/review/review.service";
import { buildScheduleSummary } from "@core/domains/shop/schedule.utils";
import { Toast } from "@core/utils/toast";
import { extractErrorMessage } from "@core/utils/error";
import { Empty } from "@frontoffice/components/empty";
import { ProductCard } from "@frontoffice/components/product-card/product-card";
import { Loader } from "@shared/components/loader";

@Component({
  selector: "app-shop-detail",
  templateUrl: "./shop-detail.html",
  imports: [
    FormsModule,
    DatePipe,
    Button,
    Divider,
    GalleriaModule,
    Paginator,
    Rating,
    Textarea,
    Empty,
    Loader,
    ProductCard,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly publicService = inject(PublicService);
  private readonly reviewService = inject(ReviewService);
  private readonly queryClient = inject(QueryClient);
  private readonly toast = inject(Toast);
  protected readonly authService = inject(AuthService);
  private readonly shopId = this.route.snapshot.params["id"];

  protected readonly page = signal(1);
  protected readonly limit = signal(12);
  protected readonly reviewPage = signal(1);
  protected readonly reviewLimit = signal(5);
  protected readonly newRating = signal(0);
  protected readonly newComment = signal("");

  private readonly shopQuery = injectQuery(() =>
    this.publicService.getShopQueryOptions(this.shopId),
  );

  private readonly productsQuery = injectQuery(() => ({
    ...this.publicService.listShopProductsQueryOptions(this.shopId, {
      page: this.page(),
      limit: this.limit(),
    }),
    placeholderData: keepPreviousData,
  }));

  private readonly reviewsQuery = injectQuery(() => ({
    ...this.reviewService.listShopReviewsQueryOptions(this.shopId, {
      page: this.reviewPage(),
      limit: this.reviewLimit(),
    }),
    placeholderData: keepPreviousData,
  }));

  private readonly myReviewQuery = injectQuery(() => ({
    ...this.reviewService.getMyReviewQueryOptions(this.shopId),
    enabled: this.authService.isAuthenticated(),
  }));

  protected readonly submitReviewMutation = injectMutation(() => ({
    mutationFn: (data: { shop: string; rating: number; comment?: string }) =>
      lastValueFrom(this.reviewService.createReview(data)),
    onSuccess: () => {
      this.toast.success("Avis envoyé");
      this.newRating.set(0);
      this.newComment.set("");
      this.queryClient.invalidateQueries({ queryKey: ["shop-reviews", this.shopId] });
      this.queryClient.invalidateQueries({ queryKey: ["my-review", this.shopId] });
      this.queryClient.invalidateQueries({ queryKey: ["public-shops", this.shopId] });
    },
    onError: (error: unknown) => this.toast.error(extractErrorMessage(error)),
  }));

  protected readonly shop = computed(() => this.shopQuery.data()?.data);
  protected readonly loading = computed(() => this.shopQuery.isPending());

  protected readonly products = computed(() => this.productsQuery.data()?.data ?? []);
  protected readonly productsTotalRecords = computed(
    () => (this.productsQuery.data()?.meta?.["total"] as number) ?? 0,
  );
  protected readonly productsLoading = computed(() => this.productsQuery.isPending());
  protected readonly scheduleSummary = computed(() =>
    buildScheduleSummary(this.shop()?.schedule ?? []),
  );

  protected readonly reviews = computed(() => this.reviewsQuery.data()?.data ?? []);
  protected readonly reviewsTotalRecords = computed(
    () => (this.reviewsQuery.data()?.meta?.["total"] as number) ?? 0,
  );
  protected readonly reviewsLoading = computed(() => this.reviewsQuery.isPending());
  protected readonly myReview = computed(() => this.myReviewQuery.data()?.data);
  protected readonly canReview = computed(
    () => this.authService.isAuthenticated() && !this.myReview(),
  );

  protected onPageChange(event: PaginatorState): void {
    this.page.set(Math.floor((event.first ?? 0) / (event.rows ?? this.limit())) + 1);
  }

  protected onReviewPageChange(event: PaginatorState): void {
    this.reviewPage.set(Math.floor((event.first ?? 0) / (event.rows ?? this.reviewLimit())) + 1);
  }

  protected submitReview(): void {
    if (!this.newRating()) return;
    this.submitReviewMutation.mutate({
      shop: this.shopId,
      rating: this.newRating(),
      comment: this.newComment() || undefined,
    });
  }

  protected getInitials(user: { firstName: string; lastName: string }): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
}
