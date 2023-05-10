package com.nvl.motelbackend.config;

import com.nvl.motelbackend.security.CustomAccessDeniedHandler;
import com.nvl.motelbackend.security.JwtAuthenticationEntryPoint;
import com.nvl.motelbackend.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint authenticationEntryPoint;

    @Bean
    public AccessDeniedHandler customAccessDeniedHandler() {
        return new CustomAccessDeniedHandler();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
   protected SecurityFilterChain securityFilterChain(HttpSecurity http) throws  Exception {
       http
               .csrf().disable()
               .exceptionHandling()
               .authenticationEntryPoint(authenticationEntryPoint)
               .and()
               .sessionManagement()
               .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
               .and()
               .authorizeRequests()
               .antMatchers("/ws/**").permitAll()
               .antMatchers(HttpMethod.GET, "/api/**").permitAll()
               .antMatchers("/api/auth/**").permitAll()
               .antMatchers(HttpMethod.POST, "/api/report-posts/**").permitAll()
               .antMatchers("/v2/api-docs/**").permitAll()
               .antMatchers("/swagger-ui/**").permitAll()
               .antMatchers("/swagger-resources/**").permitAll()
               .antMatchers("/swagger-ui.html").permitAll()
               .antMatchers("/webjars/**").permitAll()
               .anyRequest()
               .authenticated();

       http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
       return http.build();
   }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
//   @Bean
//    protected UserDetailsService userDetailsService() {
//        UserDetails client = User.builder().username("client").password(passwordEncoder().encode("123")).roles("USER").build();
//        UserDetails admin = User.builder().username("admin").password(passwordEncoder().encode("123")).roles("ADMIN").build();
//        return new InMemoryUserDetailsManager(client, admin);
//  }
}
