import { View } from 'react-native';

import {
  courseById,
  formatPrice,
  RATE_LABELS,
  type TeeTime,
} from '../data/sagamore';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import { Text } from './Text';

export type TeeTimeCardProps = {
  teeTime: TeeTime;
  onBook?: (teeTime: TeeTime) => void;
};

function spotsLabel(spotsLeft: number): string {
  if (spotsLeft === 0) return 'No spots';
  if (spotsLeft === 1) return '1 spot left';
  return `${spotsLeft} spots`;
}

/**
 * The core booking row for Sagamore — a single tee time a golfer can reserve.
 * Demonstrates how the primitives (Card, Text, Badge, Button) compose, and
 * handles the booking edge cases: full, members-only, twilight, maintenance.
 */
export function TeeTimeCard({ teeTime, onBook }: TeeTimeCardProps) {
  const course = courseById(teeTime.courseId);
  const bookable = teeTime.status === 'available' || teeTime.status === 'limited';

  return (
    <Card>
      <View className="flex-row items-start justify-between">
        <View className="gap-0.5">
          <Text variant="heading">{teeTime.label}</Text>
          <Text variant="caption">
            {course?.name} · {teeTime.holes} holes
          </Text>
        </View>
        <View className="items-end gap-0.5">
          <Text variant="subheading">{formatPrice(teeTime.price)}</Text>
          <Text variant="caption">per player</Text>
        </View>
      </View>

      <View className="mt-3 flex-row flex-wrap gap-1.5">
        <Badge label={RATE_LABELS[teeTime.rate]} variant={teeTime.rate === 'member' ? 'solid' : 'soft'} />
        <Badge label={spotsLabel(teeTime.spotsLeft)} variant="outline" />
        {teeTime.cartIncluded ? <Badge label="Cart incl." variant="outline" /> : null}
      </View>

      <View className="mt-4">
        {teeTime.status === 'maintenance' ? (
          <Button label="Course maintenance" variant="secondary" disabled />
        ) : teeTime.status === 'full' ? (
          <Button label="Join waitlist" variant="outline" onPress={() => onBook?.(teeTime)} />
        ) : (
          <Button
            label={teeTime.rate === 'member' ? 'Reserve' : 'Book tee time'}
            variant="primary"
            disabled={!bookable}
            onPress={() => onBook?.(teeTime)}
          />
        )}
      </View>
    </Card>
  );
}
