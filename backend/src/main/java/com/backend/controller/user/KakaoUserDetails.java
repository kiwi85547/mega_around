package com.backend.controller.user;

import java.util.Map;

public class KakaoUserDetails {
    private Map<String, Object> attributes;
    private Map<String, Object> profileAttributes;

    public KakaoUserDetails(Map<String, Object> attributes) {
        this.attributes = (Map<String, Object>) attributes.get("kakao_account");
        this.profileAttributes = (Map<String, Object>) this.attributes.get("profile");
    }

    public String getEmail() {
        return (String) attributes.get("email");
    }

    public String getProvider() {
        return "kakao";
    }

    public String getProviderId() {
        return (String) attributes.get("id");
    }

    public String getNickName() {
        return (String) profileAttributes.get("nickname");
    }

}
