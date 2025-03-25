package com.alten.ecom.controller;

import com.alten.ecom.dto.CartDto;
import com.alten.ecom.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDto> getUserCart() {
        return ResponseEntity.ok(cartService.getUserCart());
    }

    @PostMapping("/products/{productId}")
    public ResponseEntity<CartDto> addProductToCart(@PathVariable Long productId,
                                                    @RequestParam(defaultValue = "1") Integer quantity) {
        return ResponseEntity.ok(cartService.addProductToCart(productId, quantity));
    }

    @PutMapping("/products/{productId}")
    public ResponseEntity<CartDto> updateCartItemQuantity(@PathVariable Long productId,
                                                          @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateCartItemQuantity(productId, quantity));
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<CartDto> removeProductFromCart(@PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeProductFromCart(productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok().build();
    }
}
