import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom, Observable } from "rxjs";
import { environment } from "@env/environment";
import { ApiResponse } from "@core/common/models/api-response";
import { buildQueryParams } from "@core/utils/http-params";
import { Order } from "./order.model";

@Injectable({ providedIn: "root" })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/order`;

  // ── Shop-side (BO) ──────────────────────────────────────────────────────

  list(params: Record<string, unknown> = {}): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(this.baseUrl, { params: buildQueryParams(params) });
  }

  listQueryOptions(params: Record<string, unknown> = {}) {
    return {
      queryKey: ["orders", params] as const,
      queryFn: () => lastValueFrom(this.list(params)),
    };
  }

  confirm(id: string): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.baseUrl}/${id}/confirm`, {});
  }

  refuse(id: string, reason?: string): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.baseUrl}/${id}/refuse`, { reason });
  }

  cancel(id: string, reason?: string): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.baseUrl}/${id}/cancel`, { reason });
  }

  stats(): Observable<ApiResponse<OrderStats>> {
    return this.http.get<ApiResponse<OrderStats>>(`${this.baseUrl}/stats`);
  }

  statsQueryOptions() {
    return {
      queryKey: ["order-stats"] as const,
      queryFn: () => lastValueFrom(this.stats()),
    };
  }

  // ── Customer-side (FO) ──────────────────────────────────────────────────

  listMyOrders(params: Record<string, unknown> = {}): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.baseUrl}/customer`, {
      params: buildQueryParams(params),
    });
  }

  listMyOrdersQueryOptions(params: Record<string, unknown> = {}) {
    return {
      queryKey: ["my-orders", params] as const,
      queryFn: () => lastValueFrom(this.listMyOrders(params)),
    };
  }

  getMyOrder(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.baseUrl}/customer/${id}`);
  }

  getMyOrderQueryOptions(id: string) {
    return {
      queryKey: ["my-orders", id] as const,
      queryFn: () => lastValueFrom(this.getMyOrder(id)),
    };
  }

  checkout(
    items: { product: string; quantity: number }[],
    note?: string,
  ): Observable<ApiResponse<Order[]>> {
    return this.http.post<ApiResponse<Order[]>>(`${this.baseUrl}/customer/checkout`, {
      items,
      note,
    });
  }
}

export interface OrderStats {
  total: number;
  byStatus: Record<string, number>;
  revenue: number;
  recentOrders?: Order[];
}
