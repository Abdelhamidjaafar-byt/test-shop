package com.alten.ecom.controller;

import com.alten.ecom.dto.WishlistDto;
import com.alten.ecom.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<WishlistDto> getUserWishlist() {
        return ResponseEntity.ok(wishlistService.getUserWishlist());
    }

    @PostMapping("/products/{productId}")
    public ResponseEntity<WishlistDto> addProductToWishlist(@PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.addProductToWishlist(productId));
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<WishlistDto> removeProductFromWishlist(@PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.removeProductFromWishlist(productId));
    }
}
