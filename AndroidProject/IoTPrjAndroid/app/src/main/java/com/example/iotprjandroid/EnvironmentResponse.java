package com.example.iotprjandroid;

import com.google.gson.annotations.SerializedName;

public class EnvironmentResponse {

    @SerializedName("id")
    private int id;

    @SerializedName("temperature")
    private int temperature;

    @SerializedName("humidity")
    private int humidity;

    @SerializedName("dust")
    private int dust;

    public int getId() {
        return id;
    }

    public int getTemperature() {
        return temperature;
    }

    public int getHumidity() {
        return humidity;
    }

    public int getDust() {
        return dust;
    }
}
