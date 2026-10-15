package com.example.travel;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // Public GET APIs
                        .requestMatchers(
                                HttpMethod.GET,

                                // States
                                "/api/states",
                                "/api/states/*",
                                "/api/states/*/cities",

                                // Cities
                                "/api/cities",
                                "/api/cities/*",
                                "/api/cities/*/tourist-places",

                                // Categories
                                "/api/categories",
                                "/api/categories/*",
                                "/api/categories/*/tourist-places",

                                // Tourist Places
                                "/api/tourist-places",
                                "/api/tourist-places/*",
                                "/api/tourist-places/featured",
                                "/api/tourist-places/popular",
                                "/api/tourist-places/search",
                                "/api/tourist-places/filter",

                                // Reviews
                                "/api/reviews/place/*",

                                // Images
                                "/api/images/place/*",

                                // Nearby Places
                                "/api/nearby-places/place/*",

                                // Home Page APIs
                                "/api/home",
                                "/api/home/featured-places",
                                "/api/home/popular-destinations",

                                // Search APIs
                                "/api/search",
                                "/api/search/states",
                                "/api/search/cities",
                                "/api/search/places"
                        ).permitAll()

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:4200",
                "http://localhost:5500",
                "http://127.0.0.1:5500"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}