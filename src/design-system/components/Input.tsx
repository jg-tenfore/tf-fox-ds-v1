import { useState } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';

import { cx } from '../lib/cx';
import { Text } from './Text';

export type InputProps = TextInputProps & {
  label?: string;
  /** Helper or error text shown below the field. */
  hint?: string;
  error?: boolean;
  className?: string;
  containerClassName?: string;
};

/**
 * Single-line text field — name, email, promo code at checkout. Minimal:
 * hairline border that darkens to ink on focus, no fill.
 */
export function Input({
  label,
  hint,
  error = false,
  className,
  containerClassName,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className={cx('gap-1.5', containerClassName)}>
      {label ? <Text variant="label">{label}</Text> : null}
      <TextInput
        placeholderTextColor="#989898"
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        className={cx(
          'h-11 rounded-md border bg-paper px-3 text-base text-ink',
          error ? 'border-ink' : focused ? 'border-ink' : 'border-line-strong',
          className,
        )}
        {...props}
      />
      {hint ? (
        <Text variant="caption" className={cx(error && 'text-ink')}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
