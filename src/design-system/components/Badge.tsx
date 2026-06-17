import { View, type ViewProps } from 'react-native';

import { cx } from '../lib/cx';
import { Text } from './Text';

export type BadgeVariant = 'solid' | 'soft' | 'outline';

const CONTAINER_BASE = 'self-start flex-row items-center rounded-full px-2.5 py-1';

const CONTAINER_VARIANT: Record<BadgeVariant, string> = {
  solid: 'bg-ink',
  soft: 'bg-mono-100',
  outline: 'bg-paper border border-line-strong',
};

const LABEL_VARIANT: Record<BadgeVariant, string> = {
  solid: 'text-primary-foreground',
  soft: 'text-ink',
  outline: 'text-ink-muted',
};

export type BadgeProps = ViewProps & {
  label: string;
  variant?: BadgeVariant;
  className?: string;
};

/**
 * Compact status / metadata pill — e.g. "9 holes", "Twilight rate",
 * "Members only", "2 spots left". Monochromatic, no semantic colour.
 */
export function Badge({ label, variant = 'soft', className, ...props }: BadgeProps) {
  return (
    <View className={cx(CONTAINER_BASE, CONTAINER_VARIANT[variant], className)} {...props}>
      <Text className={cx('text-xs font-medium tracking-wide', LABEL_VARIANT[variant])}>
        {label}
      </Text>
    </View>
  );
}
