package com.nvl.motelbackend.interceptor;

import com.nvl.motelbackend.security.JwtTokenProvider;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import io.github.bucket4j.local.LocalBucket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final Map<String, LocalBucket> buckets = new ConcurrentHashMap<>();

//    @Value("${app.rate.limit}")
//    private long rateLimit;
//
//    @Value("${app.rate.limit.duration}")
//    private long rateLimitDuration;
    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Check if the handler method is annotated with @RateLimit
        if (handler instanceof HandlerMethod) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            if (handlerMethod.hasMethodAnnotation(RateLimit.class)) {
                // Get the rate limit and duration from the annotation
                RateLimit rateLimitAnnotation = handlerMethod.getMethodAnnotation(RateLimit.class);
                int rateLimit = rateLimitAnnotation.value();
                int duration = rateLimitAnnotation.duration();

                // Use the rate limit and duration to create a bucket
                Bandwidth limit = Bandwidth.classic(rateLimit, Refill.intervally(rateLimit, Duration.ofMinutes(duration)));
                // Get the client ID and check the bucket
                String clientId = getClientId(request);
                LocalBucket bucket = buckets.computeIfAbsent(clientId, k->Bucket.builder().addLimit(limit).build());

                if (bucket.tryConsume(1)) {
                    return true;
                } else {
                    response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                    response.getWriter().write("Too many requests");
                    response.getWriter().flush();
                    response.getWriter().close();
                    return false;
                }
            }
        }
        return true;
    }

    private String getClientId(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            // Decode the JWT token to get the client ID
            String clientId = tokenProvider.getUsernameFromJWT(token);
            return clientId;
        } else {
            // Return a default client ID if the Authorization header is missing or invalid
            return "anonymous";
        }
    }

//    private LocalBucket getBucket(String clientId) {
//        return buckets.computeIfAbsent(clientId, k -> createNewBucket());
//    }

//    private LocalBucket createNewBucket() {
//
//        Bandwidth limit = Bandwidth.classic(rateLimit, Refill.intervally(rateLimit, Duration.ofMinutes(rateLimitDuration)));
//        return Bucket.builder().addLimit(limit).build();
//    }
}
