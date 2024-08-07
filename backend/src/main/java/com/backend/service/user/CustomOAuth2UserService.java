package com.backend.service.user;

import com.backend.controller.user.CustomOauth2UserDetails;
import com.backend.controller.user.KakaoUserDetails;
import com.backend.domain.user.Customer;
import com.backend.mapper.user.UserMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserMapper userMapper;
    private final UserService userService;
    private final JwtEncoder jwtEncoder;
    private final HttpServletResponse httpServletResponse;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        KakaoUserDetails response = new KakaoUserDetails((Map) oAuth2User.getAttributes());

        Customer customer = userMapper.selectCustomerByEmail(response.getEmail());

        if (customer == null) {
            Customer newCustomer = new Customer();
            newCustomer.setEmail(response.getEmail());
            newCustomer.setNickName(response.getNickName());
            newCustomer.setPassword(userRequest.getAccessToken().getTokenValue());
            userService.addCustomer(newCustomer);

            String redirectUri = STR."http://localhost:5173/auth";
            try {
                httpServletResponse.sendRedirect(redirectUri);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } else {
            JwtClaimsSet claims = JwtClaimsSet.builder()
                    .issuer("self")
                    .issuedAt(Instant.now())
                    .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 7))
                    .subject(customer.getId().toString()) // 사용자를 나타내는 정보
                    .claim("scope", "customer") // 권한
                    .claim("nickName", customer.getNickName())
                    .claim("email", customer.getEmail())
                    .build();

            String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

            System.out.println("token = " + token);

            String redirectUri = STR."http://localhost:5173/auth?token=\{token}";
            try {
                httpServletResponse.sendRedirect(redirectUri);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        return new CustomOauth2UserDetails(customer, (Map) oAuth2User.getAttributes());
    }
}
