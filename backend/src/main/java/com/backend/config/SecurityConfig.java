package com.backend.config;

import com.backend.service.user.CustomAuthenticationHandler;
import com.backend.service.user.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final CustomOAuth2UserService customOAuth2UserService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
//                .authorizeHttpRequests(authorize ->
//                        authorize
//                                .requestMatchers("/", "/login/**", "/css/**", "/js/**", "/images/**").permitAll()
//                                .anyRequest().authenticated()
//                )
                .oauth2Login(oauth2 ->
                                oauth2
                                        .userInfoEndpoint(userInfo ->
                                                userInfo.userService(customOAuth2UserService)
                                        )
//                                .successHandler(authenticationSuccessHandler())
//                                .failureHandler(authenticationFailureHandler())
                )
                .oauth2ResourceServer(oauth2ResourceServer ->
                        oauth2ResourceServer.jwt(Customizer.withDefaults())
                );
        return http.build();
    }

    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {
        return new CustomAuthenticationHandler();
    }

    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler() {
        return new CustomAuthenticationHandler();
    }
}
