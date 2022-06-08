package com.example.iotprjandroid;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.google.android.material.bottomnavigation.BottomNavigationView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.example.iotprjandroid.databinding.ActivityMainBinding;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    private final String URL = "https://f4e89rg4gl.execute-api.ap-northeast-2.amazonaws.com/";
    private Retrofit retrofit;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        retrofit = new Retrofit.Builder()
                .baseUrl(URL)
                .addConverterFactory(GsonConverterFactory.create()) //json 분석하기 위해 추가
                .build();
        EnvironmentGetInfo service = retrofit.create(EnvironmentGetInfo.class);

        service.getEnvironment().enqueue(new Callback<List<EnvironmentResponse>>() {
            @Override
            public void onResponse(Call<List<EnvironmentResponse>> call, Response<List<EnvironmentResponse>> response) {
                List<EnvironmentResponse> environmentResponseList = response.body();


                for(int i=0; i< 10; i++) {
                    EnvironmentResponse environmentResponse = environmentResponseList.get(i);
                    Log.e("environmentResponse", ""
                            + environmentResponse.getId() + ", "
                            + environmentResponse.getTemperature() + ", "
                            + environmentResponse.getHumidity() + ", "
                            + environmentResponse.getDust() + ", "
                    );
                }
            }

            @Override
            public void onFailure(Call<List<EnvironmentResponse>> call, Throwable t) {
                Toast.makeText(getApplicationContext(), "오류 발생", Toast.LENGTH_LONG).show();
                Log.e("retrofit 에러 발생", t.getMessage());
            }
        });




        BottomNavigationView navView = findViewById(R.id.nav_view);
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        AppBarConfiguration appBarConfiguration = new AppBarConfiguration.Builder(
                R.id.navigation_home, R.id.navigation_dashboard, R.id.navigation_notifications)
                .build();
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_activity_main);
        NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);
        NavigationUI.setupWithNavController(binding.navView, navController);
    }

}