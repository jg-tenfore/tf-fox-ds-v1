import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/design-system/components/Badge';
import { TeeTimeCard } from '@/design-system/components/TeeTimeCard';
import { Text } from '@/design-system/components/Text';
import { SAGAMORE, TEE_TIMES } from '@/design-system/data/sagamore';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-canvas">
      <SafeAreaView className="flex-1">
        <FlatList
          data={TEE_TIMES}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-5 pb-12 gap-3"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="gap-1 pb-4 pt-2">
              <Text variant="mono">Tee sheet · Today</Text>
              <Text variant="title">{SAGAMORE.name}</Text>
              <View className="mt-1 flex-row items-center gap-2">
                <Badge label={SAGAMORE.location} variant="outline" />
                <Text variant="caption">{SAGAMORE.tagline}</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => <TeeTimeCard teeTime={item} />}
        />
      </SafeAreaView>
    </View>
  );
}
