package com.nvl.motelbackend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nvl.motelbackend.repository.PostRepository;
import com.nvl.motelbackend.repository.UserRepository;
import org.aspectj.lang.annotation.Before;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JacksonJsonParser;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = MotelBackendApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class MotelBackendApplicationTests {
//    @Autowired
//    private WebApplicationContext wac;

//    @Autowired
//    private FilterChainProxy springSecurityFilterChain;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String obtainAccessToken(String username, String password) throws Exception {

//        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
//        params.add("username", username);
//        params.add("password", password);

        MvcResult result
                = mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\": \""+ username +"\", \"password\": \"" + password + "\"}")
                        .accept("application/json;charset=UTF-8"))
                .andExpect(status().isOk()).andReturn();
//                .andExpect(content().contentType("application/json;charset=UTF-8"));

        String response = result.getResponse().getContentAsString();
        JSONObject jsonObject = new JSONObject(response);
        String accessToken = jsonObject.getString("accessToken");
        return accessToken;
    }

    @Test
    public void contextLoads() {

    }

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testGetAction() throws Exception {
        String accessToken = obtainAccessToken("nvlam@xyz.com", "lam123456");

        mockMvc.perform(get("/api/actions?page=0")
                        .header("Authorization", "Bearer " + accessToken)
                        .header("content-type", "application/json")
                        .accept("application/json;charset=UTF-8"))
                .andExpect(status().isOk()) // giong assert
                .andExpect(jsonPath("$.content").exists())
                .andDo(print());
    }
}
