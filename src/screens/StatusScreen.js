// StatusScreen.js - Adding daily dungeons
import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../context/AuthContext';

const StatusScreen = () => {
  const {user} = useAuth();

  // Stats data
  const [stats] = useState([
    {name: 'STRENGTH', value: 30},
    {name: 'ENDURANCE', value: 40},
    {name: 'AGILITY', value: 50},
    {name: 'DISCIPLINE', value: 20},
  ]);

  // Quests data
  const [quests, setQuests] = useState([
    {id: 1, name: 'Morning Cardio (15 minutes)', completed: false},
    {id: 2, name: 'Push-ups (3 × 10 reps)', completed: true},
    {id: 3, name: 'Evening Stretching (10 minutes)', completed: false},
  ]);

  // Function to toggle quest completion
  const toggleQuestCompletion = useCallback(id => {
    setQuests(currentQuests =>
      currentQuests.map(quest => {
        if (quest.id === id) {
          return {...quest, completed: !quest.completed};
        }
        return quest;
      }),
    );
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}>
          {/* Status Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>HUNTER STATUS</Text>
            <Text style={styles.rankText}>
              {user?.hunterStatus.rank_name + '-Rank' || 'E-Rank'}
            </Text>
          </View>

          {/* Character Info */}
          <View style={styles.characterInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>JS</Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.username || 'null'}</Text>
              <Text style={styles.userLevel}>Level 3 Hunter</Text>
            </View>
          </View>

          {/* Stats Panel */}
          <View style={styles.statsPanel}>
            <Text style={styles.panelTitle}>STATS</Text>

            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statName}>{stat.name}</Text>
                <View style={styles.statBarContainer}>
                  <View style={[styles.statBar, {width: `${stat.value}%`}]} />
                </View>
                <Text style={styles.statValue}>{stat.value}%</Text>
              </View>
            ))}
          </View>

          {/* XP Progress */}
          <View style={styles.xpProgress}>
            <Text style={styles.xpTitle}>EXPERIENCE POINTS</Text>
            <View style={styles.xpBarContainer}>
              <View style={[styles.xpBar, {width: '30%'}]} />
            </View>
            <Text style={styles.xpValue}>450/1500</Text>
          </View>

          {/* Daily Dungeons */}
          <View style={styles.dailyDungeons}>
            <Text style={styles.panelTitle}>DAILY DUNGEONS</Text>

            {quests.map(quest => (
              <TouchableOpacity
                key={quest.id}
                style={styles.dungeonItem}
                onPress={() => toggleQuestCompletion(quest.id)}
                activeOpacity={0.7}>
                <Text style={styles.dungeonName}>{quest.name}</Text>
                <View
                  style={[
                    styles.checkbox,
                    quest.completed && styles.checkboxChecked,
                  ]}>
                  {quest.completed && <View style={styles.checkmark} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161B22',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80, // For bottom tab navigation
  },
  headerContainer: {
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 8,
    padding: 15,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#38BDF8',
    fontSize: 24,
    fontWeight: 'bold',
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  characterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 2,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userLevel: {
    fontSize: 18,
    color: '#38BDF8',
  },
  statsPanel: {
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  panelTitle: {
    color: '#38BDF8',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(56, 189, 248, 0.3)',
    paddingBottom: 5,
  },
  statItem: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    width: '30%',
  },
  statBarContainer: {
    width: '50%',
    height: 20,
    backgroundColor: '#192130',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 4,
  },
  statValue: {
    width: '15%',
    textAlign: 'right',
    fontSize: 16,
    color: '#38BDF8',
    fontWeight: '500',
  },
  xpProgress: {
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  xpTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 10,
  },
  xpBarContainer: {
    height: 15,
    backgroundColor: '#192130',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBar: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 4,
  },
  xpValue: {
    textAlign: 'right',
    fontSize: 14,
    color: '#38BDF8',
    marginTop: 5,
  },
  dailyDungeons: {
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 8,
    padding: 20,
    marginBottom: 30,
  },
  dungeonItem: {
    backgroundColor: '#192130',
    borderRadius: 4,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dungeonName: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: 'rgba(38, 50, 68, 0.8)',
    borderWidth: 2,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  checkmark: {
    width: 15,
    height: 8,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#38BDF8',
    transform: [{rotate: '-45deg'}],
  },
});

export default StatusScreen;
