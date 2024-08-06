package com.backend.controller.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

public class KakaoUserDetails implements OAuth2User {

    private final Map<String, Object> attributes;

    public KakaoUserDetails(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getName() {
        return attributes.get("id").toString();
    }

    public String getProvider() {
        return "kakao";
    }

    public String getProviderId() {
        return attributes.get("id").toString();
    }

    public String getEmail() {
        return (String) ((Map<?, ?>) attributes.get("kakao_account")).get("email");
    }

    public String getNickName() {
        return (String) ((Map<?, ?>) attributes.get("properties")).get("nickname");
    }
}
