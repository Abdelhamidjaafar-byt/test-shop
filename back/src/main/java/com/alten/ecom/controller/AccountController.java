package com.alten.ecom.controller;

import com.alten.ecom.dto.RegisterRequest;
import com.alten.ecom.dto.UserDto;
import com.alten.ecom.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class AccountController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserDto> createAccount(@Valid @RequestBody RegisterRequest registerRequest) {
        return new ResponseEntity<>(userService.createUser(registerRequest), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<UserDto> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }
}
