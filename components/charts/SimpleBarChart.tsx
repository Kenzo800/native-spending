import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../app/context/ThemeContext';

const { width } = Dimensions.get('window');

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: BarChartData[];
  maxValue?: number;
  height?: number;
  showValues?: boolean;
}

export function SimpleBarChart({ 
  data, 
  maxValue,
  height = 200,
  showValues = true 
}: SimpleBarChartProps) {
  const { colors } = useTheme();
  
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          暫無資料
        </Text>
      </View>
    );
  }

  const max = maxValue || Math.max(...data.map(item => item.value));
  const barWidth = (width - 80) / data.length - 8;

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.chartArea}>
        {data.map((item, index) => {
          const barHeight = max > 0 ? (item.value / max) * (height - 60) : 0;
          
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.valueContainer}>
                {showValues && (
                  <Text style={[styles.valueText, { color: colors.text }]}>
                    {item.value.toFixed(0)}
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    width: barWidth,
                    backgroundColor: item.color || colors.primary,
                  }
                ]}
              />
              <Text style={[styles.labelText, { color: colors.textSecondary }]}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: '100%',
    gap: 8,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  valueContainer: {
    height: 20,
    justifyContent: 'center',
    marginBottom: 4,
  },
  valueText: {
    fontSize: 10,
    textAlign: 'center',
  },
  bar: {
    borderRadius: 4,
    minHeight: 2,
  },
  labelText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
