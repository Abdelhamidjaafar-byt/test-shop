package com.alten.ecom.service;

import com.alten.ecom.dto.ProductDto;
import com.alten.ecom.dto.WishlistDto;
import com.alten.ecom.exception.ResourceNotFoundException;
import com.alten.ecom.model.Product;
import com.alten.ecom.model.User;
import com.alten.ecom.model.Wishlist;
import com.alten.ecom.model.WishlistItem;
import com.alten.ecom.repository.ProductRepository;
import com.alten.ecom.repository.UserRepository;
import com.alten.ecom.repository.WishlistItemRepository;
import com.alten.ecom.repository.WishlistRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public WishlistDto getUserWishlist() {
        Wishlist wishlist = getCurrentUserWishlist();
        return mapToDto(wishlist);
    }

    @Transactional
    public WishlistDto addProductToWishlist(Long productId) {
        Wishlist wishlist = getCurrentUserWishlist();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        boolean exists = wishlistItemRepository.existsByWishlistAndProduct(wishlist, product);
        if (!exists) {
            WishlistItem wishlistItem = new WishlistItem();
            wishlistItem.setWishlist(wishlist);
            wishlistItem.setProduct(product);

            wishlist.getItems().add(wishlistItem);
            wishlistItemRepository.save(wishlistItem);
        }

        return mapToDto(wishlist);
    }

    @Transactional
    public WishlistDto removeProductFromWishlist(Long productId) {
        Wishlist wishlist = getCurrentUserWishlist();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        WishlistItem wishlistItem = wishlistItemRepository.findByWishlistAndProduct(wishlist, product)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in wishlist"));

        wishlist.getItems().remove(wishlistItem);
        wishlistItemRepository.delete(wishlistItem);
        return mapToDto(wishlist);
    }

    private Wishlist getCurrentUserWishlist() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return wishlistRepository.findByUser(user)
                .orElseGet(() -> {
                    Wishlist newWishlist = new Wishlist();
                    newWishlist.setUser(user);
                    return wishlistRepository.save(newWishlist);
                });
    }

    private WishlistDto mapToDto(Wishlist wishlist) {
        List<WishlistDto.WishlistItemDto> wishlistItemDtos = wishlist.getItems().stream()
                .map(this::mapToWishlistItemDto)
                .collect(Collectors.toList());

        return WishlistDto.builder()
                .id(wishlist.getId())
                .items(wishlistItemDtos)
                .build();
    }

    private WishlistDto.WishlistItemDto mapToWishlistItemDto(WishlistItem wishlistItem) {
        ProductDto productDto = ProductDto.builder()
                .id(wishlistItem.getProduct().getId())
                .code(wishlistItem.getProduct().getCode())
                .name(wishlistItem.getProduct().getName())
                .description(wishlistItem.getProduct().getDescription())
                .image(wishlistItem.getProduct().getImage())
                .category(wishlistItem.getProduct().getCategory())
                .price(wishlistItem.getProduct().getPrice())
                .quantity(wishlistItem.getProduct().getQuantity())
                .inventoryStatus(wishlistItem.getProduct().getInventoryStatus())
                .rating(wishlistItem.getProduct().getRating())
                .build();

        return WishlistDto.WishlistItemDto.builder()
                .id(wishlistItem.getId())
                .product(productDto)
                .build();
    }
}
