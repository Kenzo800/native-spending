import React, { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { useTheme } from '../../app/context/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  style,
  containerStyle,
  icon,
  fullWidth = true,
  ...props
}, ref) => {
  const { colors } = useTheme();

  const inputContainerStyle = [
    styles.inputContainer,
    {
      borderColor: error ? colors.error : colors.border,
      backgroundColor: colors.surface,
    },
    fullWidth && styles.fullWidth,
    containerStyle,
  ];

  const inputStyle = [
    styles.input,
    {
      color: colors.text,
    },
    icon && styles.inputWithIcon,
    style,
  ] as any;

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}
      <View style={inputContainerStyle}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          ref={ref}
          style={inputStyle}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 44,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  iconContainer: {
    paddingLeft: 12,
    paddingRight: 8,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
