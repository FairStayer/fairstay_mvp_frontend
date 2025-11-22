import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { colors, typography, spacing } from '../styles';
import ContractCard from './ContractCard';

// ✅ 타입 정의
type Status = 'In Progress' | 'Confirmed';
type Tab = 'All' | Status;

interface ContractItem {
  title: string;
  desc: string;
  date: string;
  status: Status;
}

// ✅ 탭 목록
const tabs: Tab[] = ['All', 'In Progress', 'Confirmed'];

export default function ContractList() {
  const [selectedTab, setSelectedTab] = useState<Tab>('All');

  const data: ContractItem[] = [
    {
      title: 'Mapo-gu 123 District',
      desc: 'Description',
      date: '2025.10.01',
      status: 'In Progress',
    },
    {
      title: 'Seoul',
      desc: 'Mapogu 123',
      date: '2025.10.01',
      status: 'In Progress',
    },
    {
      title: 'Mapo-gu 123 District',
      desc: 'Description',
      date: '2025.10.01',
      status: 'Confirmed',
    },
  ];

  const filtered =
    selectedTab === 'All'
      ? data
      : data.filter((item) => item.status === selectedTab);

  return (
    <View style={styles.container}>
      {/* 탭 버튼 영역 */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[
              styles.tab,
              selectedTab === tab && { backgroundColor: colors.primary },
            ]}
          >
            <Text
              style={[
                typography.label,
                { color: selectedTab === tab ? colors.surface : '#9CA3AF' },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 섹션 제목 */}
      <Text style={[typography.titleM, styles.sectionTitle]}>Contracts</Text>

      {/* 리스트 */}
      {filtered.length > 0 ? (
        <FlatList
          data={filtered}
          renderItem={({ item }) => <ContractCard {...item} />}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={[typography.bodyL, styles.empty]}>
          You don’t have any contracts.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.m,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: spacing.m,
    marginTop: spacing.s,
  },
  tab: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 20,
    marginRight: spacing.s,
    backgroundColor: colors.surface,
  },
  sectionTitle: {
    marginBottom: spacing.s,
    color: colors.background,
  },
  empty: {
    color: '#9CA3AF',
    marginTop: spacing.l,
  },
});
