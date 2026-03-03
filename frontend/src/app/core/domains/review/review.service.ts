import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom, Observable } from "rxjs";
import { environment } from "@env/environment";
import { ApiResponse } from "@core/common/models/api-response";
import { buildQueryParams } from "@core/utils/http-params";
import { Review } from "./review.model";

@Injectable({ providedIn: "root" })
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  listShopReviews(
    shopId: string,
    params: Record<string, unknown> = {},
  ): Observable<ApiResponse<Review[]>> {
    return this.http.get<ApiResponse<Review[]>>(`${this.apiUrl}/public/shops/${shopId}/reviews`, {
      params: buildQueryParams(params),
    });
  }

  listShopReviewsQueryOptions(shopId: string, params: Record<string, unknown> = {}) {
    return {
      queryKey: ["shop-reviews", shopId, params] as const,
      queryFn: () => lastValueFrom(this.listShopReviews(shopId, params)),
    };
  }

  getMyReview(shopId: string): Observable<ApiResponse<Review | null>> {
    return this.http.get<ApiResponse<Review | null>>(`${this.apiUrl}/reviews/mine/${shopId}`);
  }

  getMyReviewQueryOptions(shopId: string) {
    return {
      queryKey: ["my-review", shopId] as const,
      queryFn: () => lastValueFrom(this.getMyReview(shopId)),
    };
  }

  createReview(data: {
    shop: string;
    rating: number;
    comment?: string;
  }): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(`${this.apiUrl}/reviews`, data);
  }
}
