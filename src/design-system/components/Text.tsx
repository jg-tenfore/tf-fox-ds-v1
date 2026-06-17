import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cx } from '../lib/cx';

export type TextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'label'
  | 'caption'
  | 'mono';

const VARIANT_STYLES: Record<TextVariant, string> = {
  display: 'text-4xl font-semibold text-ink tracking-tight',
  title: 'text-3xl font-semibold text-ink tracking-tight',
  heading: 'text-xl font-semibold text-ink',
  subheading: 'text-lg font-medium text-ink',
  body: 'text-base text-ink',
  label: 'text-sm font-medium text-ink',
  caption: 'text-xs text-ink-muted',
  mono: 'text-sm font-mono text-ink-muted uppercase tracking-widest',
};

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  /** Render muted (secondary) ink colour regardless of variant. */
  muted?: boolean;
  className?: string;
};

/**
 * Typographic primitive for the Sagamore design system. Monochromatic by
 * default — colour comes only from the ink scale.
 */
export function Text({ variant = 'body', muted, className, ...props }: TextProps) {
  return (
    <RNText
      className={cx(VARIANT_STYLES[variant], muted && 'text-ink-muted', className)}
      {...props}
    />
  );
}
