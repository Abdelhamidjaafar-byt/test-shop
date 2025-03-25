package com.alten.ecom.service;

import com.alten.ecom.dto.CartDto;
import com.alten.ecom.dto.ProductDto;
import com.alten.ecom.exception.ResourceNotFoundException;
import com.alten.ecom.model.Cart;
import com.alten.ecom.model.CartItem;
import com.alten.ecom.model.Product;
import com.alten.ecom.model.User;
import com.alten.ecom.repository.CartItemRepository;
import com.alten.ecom.repository.CartRepository;
import com.alten.ecom.repository.ProductRepository;
import com.alten.ecom.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartDto getUserCart() {
        Cart cart = getCurrentUserCart();
        return mapToDto(cart);
    }

    @Transactional
    public CartDto addProductToCart(Long productId, Integer quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        Cart cart = getCurrentUserCart();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(new CartItem());

        if (cartItem.getId() == null) {
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cart.getItems().add(cartItem);
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        }

        cartItemRepository.save(cartItem);
        return mapToDto(cart);
    }

    @Transactional
    public CartDto updateCartItemQuantity(Long productId, Integer quantity) {
        if (quantity <= 0) {
            return removeProductFromCart(productId);
        }

        Cart cart = getCurrentUserCart();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in cart"));

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        return mapToDto(cart);
    }

    @Transactional
    public CartDto removeProductFromCart(Long productId) {
        Cart cart = getCurrentUserCart();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in cart"));

        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);
        return mapToDto(cart);
    }

    @Transactional
    public void clearCart() {
        Cart cart = getCurrentUserCart();
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart getCurrentUserCart() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    private CartDto mapToDto(Cart cart) {
        List<CartDto.CartItemDto> cartItemDtos = cart.getItems().stream()
                .map(this::mapToCartItemDto)
                .collect(Collectors.toList());

        double total = cart.getItems().stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        return CartDto.builder()
                .id(cart.getId())
                .items(cartItemDtos)
                .total(total)
                .build();
    }

    private CartDto.CartItemDto mapToCartItemDto(CartItem cartItem) {
        ProductDto productDto = ProductDto.builder()
                .id(cartItem.getProduct().getId())
                .code(cartItem.getProduct().getCode())
                .name(cartItem.getProduct().getName())
                .description(cartItem.getProduct().getDescription())
                .image(cartItem.getProduct().getImage())
                .category(cartItem.getProduct().getCategory())
                .price(cartItem.getProduct().getPrice())
                .quantity(cartItem.getProduct().getQuantity())
                .inventoryStatus(cartItem.getProduct().getInventoryStatus())
                .rating(cartItem.getProduct().getRating())
                .build();

        return CartDto.CartItemDto.builder()
                .id(cartItem.getId())
                .product(productDto)
                .quantity(cartItem.getQuantity())
                .build();
    }
}

