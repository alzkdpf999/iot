package com.example.iotprjandroid;


import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface EnvironmentGetInfo {
    @GET("/IoT-Toy-prj/iot-info")
    Call<List<EnvironmentResponse>> getEnvironment();
}
