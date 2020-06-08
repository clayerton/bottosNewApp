package fun.module.RadarChart;

/**
 * Created by jeanboy on 2016/10/31.
 */

public class RadarData {

    private String name;
    private double value;

    public RadarData(String name, double value) {
        this.name = name;
        this.value = value;
    }

    public String getTitle() {
        return name;
    }

    public double getPercentage() {
        return value;
    }
}
