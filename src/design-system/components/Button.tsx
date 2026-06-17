import { ActivityIndicator, Pressable, type PressableProps, View } from 'react-native';

import { cx } from '../lib/cx';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const CONTAINER_BASE =
  'flex-row items-center justify-center rounded-md active:opacity-80';

const CONTAINER_VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-ink',
  secondary: 'bg-mono-100',
  outline: 'bg-paper border border-line-strong',
  ghost: 'bg-transparent',
};

const CONTAINER_SIZE: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 gap-1.5',
  md: 'h-11 px-4 gap-2',
  lg: 'h-14 px-6 gap-2',
};

const LABEL_VARIANT: Record<ButtonVariant, string> = {
  primary: 'text-primary-foreground',
  secondary: 'text-ink',
  outline: 'text-ink',
  ghost: 'text-ink',
};

const LABEL_SIZE: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-base',
};

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  /** Optional leading element (e.g. an icon). */
  leading?: React.ReactNode;
  className?: string;
};

/**
 * Primary call-to-action for the Sagamore design system — "Book tee time",
 * "Reserve", "Cancel". Monochromatic: the only filled style is near-black ink.
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leading,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={cx(
        CONTAINER_BASE,
        CONTAINER_VARIANT[variant],
        CONTAINER_SIZE[size],
        isDisabled && 'opacity-40',
        className,
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#ffffff' : '#161616'} />
      ) : (
        <>
          {leading ? <View>{leading}</View> : null}
          <Text
            className={cx('font-medium', LABEL_VARIANT[variant], LABEL_SIZE[size])}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
