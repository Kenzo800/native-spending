import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../app/context/ThemeContext';

const { width } = Dimensions.get('window');

interface PieChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  showLegend?: boolean;
  centerText?: string;
  centerSubtext?: string;
}

export function PieChart({ 
  data, 
  size = width * 0.6, 
  showLegend = true,
  centerText,
  centerSubtext 
}: PieChartProps) {
  const { colors } = useTheme();

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height: size }]}>
        <View style={[styles.emptyState, { width: size, height: size }]}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            暫無資料
          </Text>
        </View>
      </View>
    );
  }

  const radius = (size - 40) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  let cumulativeAngle = 0;

  const slices = data.map((item, index) => {
    const angle = (item.percentage / 100) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    
    cumulativeAngle += angle;

    // Calculate arc path
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return {
      ...item,
      pathData,
      startAngle,
      endAngle,
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { width: size, height: size }]}>
        {/* 使用簡化的圓形圖表示法 */}
        <View style={[styles.pieContainer, { width: size, height: size }]}>
          {slices.map((slice, index) => {
            const angle = (slice.percentage / 100) * 360;
            const rotation = slices.slice(0, index).reduce((sum, s) => sum + (s.percentage / 100) * 360, 0);
            
            return (
              <View
                key={index}
                style={[
                  styles.slice,
                  {
                    width: size,
                    height: size,
                    transform: [{ rotate: `${rotation}deg` }],
                  }
                ]}
              >
                <View
                  style={[
                    styles.sliceContent,
                    {
                      backgroundColor: slice.color,
                      width: radius,
                      height: radius,
                      borderRadius: radius,
                      transform: [
                        { translateX: radius / 2 },
                        { rotate: `${angle}deg` }
                      ],
                    }
                  ]}
                />
              </View>
            );
          })}
        </View>
        
        {/* Center content */}
        {(centerText || centerSubtext) && (
          <View style={styles.centerContent}>
            {centerText && (
              <Text style={[styles.centerText, { color: colors.text }]}>
                {centerText}
              </Text>
            )}
            {centerSubtext && (
              <Text style={[styles.centerSubtext, { color: colors.textSecondary }]}>
                {centerSubtext}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Legend */}
      {showLegend && (
        <View style={styles.legend}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: item.color }
                ]}
              />
              <Text style={[styles.legendText, { color: colors.text }]}>
                {item.name} ({item.percentage.toFixed(1)}%)
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieContainer: {
    position: 'relative',
  },
  slice: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  sliceContent: {
    position: 'absolute',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centerSubtext: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  legend: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    flex: 1,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
  },
});
