package com.backend.controller.user;

import com.backend.domain.user.Customer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public class CustomOauth2UserDetails implements OAuth2User {
    private Map<String, Object> attributes;
    private Customer customer;

    public CustomOauth2UserDetails(Customer customer, Map<String, Object> attributes) {
        this.customer = customer;
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getName() {
        return "고객";
    }
}
