import { View, type ViewProps } from 'react-native';

import { cx } from '../lib/cx';

export type CardProps = ViewProps & {
  /** Adds interior padding. Defaults to true. */
  padded?: boolean;
  className?: string;
};

/**
 * Surface container with a hairline border on paper. The minimal, flat
 * foundation for tee-time rows, course cards, and booking summaries.
 */
export function Card({ padded = true, className, children, ...props }: CardProps) {
  return (
    <View
      className={cx(
        'rounded-lg border border-line bg-paper',
        padded && 'p-4',
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}
