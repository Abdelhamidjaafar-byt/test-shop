package com.alten.ecom.controller;

import com.alten.ecom.dto.ContactDto;
import com.alten.ecom.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<String> submitContactForm(@Valid @RequestBody ContactDto contactDto) {
        contactService.saveContactMessage(contactDto);
        return ResponseEntity.ok("Demande de contact envoyée avec succès");
    }
}