package com.backend.controller.user;

public interface OAuth2UserInfo {
    String getEmail();

    String getProvider();

    String getProviderId();

    String getNickName();

    String getPhoneNumber();
}

