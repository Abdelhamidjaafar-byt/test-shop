package com.alten.ecom.service;

import com.alten.ecom.dto.ContactDto;
import com.alten.ecom.model.Contact;
import com.alten.ecom.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    public void saveContactMessage(ContactDto contactDto) {
        Contact contact = Contact.builder()
                .email(contactDto.getEmail())
                .message(contactDto.getMessage())
                .build();

        contactRepository.save(contact);
    }
}
