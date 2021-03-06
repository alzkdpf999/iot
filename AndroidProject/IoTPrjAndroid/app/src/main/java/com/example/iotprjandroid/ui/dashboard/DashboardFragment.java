package com.example.iotprjandroid.ui.dashboard;

import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.iotprjandroid.EnvironmentGetInfo;
import com.example.iotprjandroid.EnvironmentResponse;
import com.example.iotprjandroid.R;
import com.example.iotprjandroid.databinding.FragmentDashboardBinding;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class DashboardFragment extends Fragment {

    private FragmentDashboardBinding binding;
    private final String URL = "https://f4e89rg4gl.execute-api.ap-northeast-2.amazonaws.com/";
    private Retrofit retrofit;
    private TextView humidity;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        DashboardViewModel dashboardViewModel =
                new ViewModelProvider(this).get(DashboardViewModel.class);

        binding = FragmentDashboardBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        View v;
        v =  inflater.inflate(R.layout.fragment_dashboard, container, false);
        LineChart lineChart;
        lineChart = (LineChart) v.findViewById(R.id.chart2);
        humidity = v.findViewById(R.id.humidity);

        retrofit = new Retrofit.Builder()
                .baseUrl(URL)
                .addConverterFactory(GsonConverterFactory.create()) //json ???????????? ?????? ??????
                .build();
        EnvironmentGetInfo service = retrofit.create(EnvironmentGetInfo.class);

        service.getEnvironment().enqueue(new Callback<List<EnvironmentResponse>>() {
            @Override
            public void onResponse(Call<List<EnvironmentResponse>> call, Response<List<EnvironmentResponse>> response) {
                List<EnvironmentResponse> environmentResponseList = response.body();

                List<Entry> entries = new ArrayList<Entry>();

                float average = 0;

                for(int i=environmentResponseList.size()-1; i>= 0; i--) {
                    EnvironmentResponse environmentResponse = environmentResponseList.get(i);
                    average += environmentResponse.getHumidity();
                    Log.e("environmentResponse", ""
                            + environmentResponse.getHumidity() + ", "
                    );
                    entries.add(new Entry(environmentResponseList.size()-i,environmentResponse.getHumidity()));
                }

                LineDataSet dataSet = new LineDataSet(entries, "Label");
                dataSet.setLineWidth(4); //?????? ??????
                dataSet.setCircleRadius(6); // ??? ??????
                dataSet.setCircleColor(Color.parseColor("#008A9C")); // ??? ??????
                dataSet.setDrawCircleHole(true); // ?????? ??? ?????? ??????????
                dataSet.setColor(Color.parseColor("#008A9C")); // ?????? ??????

                LineData lineData = new LineData(dataSet);
                lineChart.setData(lineData);
                lineChart.invalidate();

                humidity.setText("?????? "+ average/12 + "%");
            }

            @Override
            public void onFailure(Call<List<EnvironmentResponse>> call, Throwable t) {
                Toast.makeText(getContext(), "?????? ??????", Toast.LENGTH_LONG).show();
                Log.e("retrofit ?????? ??????", t.getMessage());
            }
        });


        return v;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}