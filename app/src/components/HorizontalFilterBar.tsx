import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Colors } from '../constants/colors';

export type HorizontalFilterTone = 'admin' | 'client' | 'category';

export interface HorizontalFilterItem {
  id: string;
  label: string;
  emoji?: string;
}

interface HorizontalFilterBarProps {
  items: HorizontalFilterItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  groupLabel?: string;
  tone?: HorizontalFilterTone;
  containerStyle?: StyleProp<ViewStyle>;
  scrollStyle?: StyleProp<ViewStyle>;
}

const reorderWithSelectedFirst = (
  items: HorizontalFilterItem[],
  selectedId: string,
): HorizontalFilterItem[] => {
  const selectedIndex = items.findIndex(item => item.id === selectedId);

  if (selectedIndex <= 0) {
    return items;
  }

  const selected = items[selectedIndex];
  return [selected, ...items.filter((_, index) => index !== selectedIndex)];
};

export const HorizontalFilterBar: React.FC<HorizontalFilterBarProps> = ({
  items,
  selectedId,
  onSelect,
  groupLabel,
  tone = 'admin',
  containerStyle,
  scrollStyle,
}) => {
  const scrollRef = useRef<ScrollView>(null);

  const orderedItems = useMemo(
    () => reorderWithSelectedFirst(items, selectedId),
    [items, selectedId],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: 0, animated: true });
  }, [selectedId]);

  const pillStyles = PILL_STYLES[tone];
  const textStyles = TEXT_STYLES[tone];

  return (
    <View style={containerStyle}>
      {groupLabel ? <Text style={styles.groupLabel}>{groupLabel}</Text> : null}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          tone === 'category' && styles.categoryContent,
        ]}
        style={scrollStyle}
      >
        {orderedItems.map(item => {
          const isSelected = item.id === selectedId;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              style={[
                pillStyles.base,
                isSelected && pillStyles.selected,
                tone === 'category' && styles.categoryPillLayout,
              ]}
              onPress={() => onSelect(item.id)}
            >
              {item.emoji ? (
                <Text style={[styles.emoji, isSelected && textStyles.selected]}>
                  {item.emoji}
                </Text>
              ) : null}
              <Text
                style={[
                  textStyles.base,
                  isSelected && textStyles.selected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  groupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  content: {
    gap: 8,
    paddingRight: 4,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryPillLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 14,
    marginRight: 6,
    color: Colors.textPrimary,
  },
});

const PILL_STYLES = {
  admin: StyleSheet.create({
    base: {
      backgroundColor: Colors.surface,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderWidth: 1,
      borderColor: Colors.border,
      marginRight: 8,
    },
    selected: {
      backgroundColor: Colors.accent,
      borderColor: Colors.accent,
    },
  }),
  client: StyleSheet.create({
    base: {
      backgroundColor: Colors.surface,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderWidth: 1,
      borderColor: Colors.border,
      marginRight: 8,
    },
    selected: {
      backgroundColor: Colors.accent,
      borderColor: Colors.accent,
    },
  }),
  category: StyleSheet.create({
    base: {
      backgroundColor: Colors.surface,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderWidth: 1,
      borderColor: Colors.border,
      marginRight: 10,
    },
    selected: {
      backgroundColor: Colors.accent,
      borderColor: Colors.accent,
    },
  }),
};

const TEXT_STYLES = {
  admin: StyleSheet.create({
    base: {
      fontSize: 13,
      fontWeight: '600',
      color: Colors.textPrimary,
    },
    selected: {
      color: Colors.accentText,
    },
  }),
  client: StyleSheet.create({
    base: {
      fontSize: 13,
      fontWeight: '600',
      color: Colors.textPrimary,
    },
    selected: {
      color: Colors.accentText,
    },
  }),
  category: StyleSheet.create({
    base: {
      fontSize: 13,
      fontWeight: '600',
      color: Colors.textPrimary,
    },
    selected: {
      color: Colors.accentText,
    },
  }),
};
