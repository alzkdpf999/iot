package com.example.iotprjandroid.ui.notifications;

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
import com.example.iotprjandroid.databinding.FragmentNotificationsBinding;
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

public class NotificationsFragment extends Fragment {

    private FragmentNotificationsBinding binding;
    private final String URL = "https://f4e89rg4gl.execute-api.ap-northeast-2.amazonaws.com/";
    private Retrofit retrofit;
    private TextView dust;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        NotificationsViewModel notificationsViewModel =
                new ViewModelProvider(this).get(NotificationsViewModel.class);

        binding = FragmentNotificationsBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        View v;
        v =  inflater.inflate(R.layout.fragment_notifications, container, false);
        LineChart lineChart;
        lineChart = (LineChart) v.findViewById(R.id.chart3);
        dust = v.findViewById(R.id.dust);

        retrofit = new Retrofit.Builder()
                .baseUrl(URL)
                .addConverterFactory(GsonConverterFactory.create()) //json ???????????? ?????? ??????
                .build();
        EnvironmentGetInfo service = retrofit.create(EnvironmentGetInfo.class);

        service.getEnvironment().enqueue(new Callback<List<EnvironmentResponse>>() {
            @Override
            public void onResponse(Call<List<EnvironmentResponse>> call, Response<List<EnvironmentResponse>> response) {
                List<EnvironmentResponse> environmentResponseList = response.body();

                float average = 0;

                List<Entry> entries = new ArrayList<Entry>();

                for(int i=environmentResponseList.size()-1; i>= 0; i--) {
                    EnvironmentResponse environmentResponse = environmentResponseList.get(i);
                    average += environmentResponse.getDust();
                    Log.e("environmentResponse", ""
                            + environmentResponse.getDust() + ", "
                    );
                    entries.add(new Entry(environmentResponseList.size()-i,environmentResponse.getDust()));
                }

                LineDataSet dataSet = new LineDataSet(entries, "Label");
                dataSet.setLineWidth(4); //?????? ??????
                dataSet.setCircleRadius(6); // ??? ??????
                dataSet.setCircleColor(Color.parseColor("#FFA8AFAF")); // ??? ??????
                dataSet.setDrawCircleHole(true); // ?????? ??? ?????? ??????????
                dataSet.setColor(Color.parseColor("#FFA8AFAF")); // ?????? ??????

                LineData lineData = new LineData(dataSet);
                lineChart.setData(lineData);
                lineChart.invalidate();

                dust.setText("?????? "+ average/12 + "???");
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