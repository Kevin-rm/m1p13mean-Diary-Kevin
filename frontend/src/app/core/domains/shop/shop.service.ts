import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "@core/common/models/api-response";
import { ResourceService } from "@core/common/resource.service";
import { Shop } from "./shop.model";

@Injectable({ providedIn: "root" })
export class ShopService extends ResourceService<Shop> {
  readonly resourcePath = "shops";

  getMe(): Observable<ApiResponse<Shop>> {
    return this.http.get<ApiResponse<Shop>>(`${this.baseUrl}/me`);
  }

  updateMe(data: object): Observable<ApiResponse<Shop>> {
    return this.http.patch<ApiResponse<Shop>>(`${this.baseUrl}/me`, data);
  }

  uploadLogo(file: File): Observable<ApiResponse<Shop>> {
    const formData = new FormData();
    formData.append("logo", file);
    return this.http.post<ApiResponse<Shop>>(`${this.baseUrl}/me/logo`, formData);
  }

  addImages(files: File[]): Observable<ApiResponse<Shop>> {
    const formData = new FormData();
    for (const file of files) {
      formData.append("images", file);
    }
    return this.http.post<ApiResponse<Shop>>(`${this.baseUrl}/me/images`, formData);
  }

  removeImage(imageUrl: string): Observable<ApiResponse<Shop>> {
    return this.http.delete<ApiResponse<Shop>>(`${this.baseUrl}/me/images`, {
      body: { imageUrl },
    });
  }

  validate(id: string): Observable<ApiResponse<Shop>> {
    return this.http.patch<ApiResponse<Shop>>(`${this.baseUrl}/${id}/validate`, {});
  }

  suspend(id: string): Observable<ApiResponse<Shop>> {
    return this.http.patch<ApiResponse<Shop>>(`${this.baseUrl}/${id}/suspend`, {});
  }
}
