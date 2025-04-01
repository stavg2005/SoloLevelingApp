// StatusScreen.js
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../context/AuthContext';
const {width} = Dimensions.get('window');

const StatusScreen = () => {
  // State declarations
  const [systemMessage, setSystemMessage] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const {user, refreshUserData, isLoading} = useAuth();
  // Quests data
  const [quests, setQuests] = useState([
    {id: 1, name: 'Morning Cardio (15 minutes)', completed: false},
    {id: 2, name: 'Push-ups (3 × 10 reps)', completed: true},
    {id: 3, name: 'Evening Stretching (10 minutes)', completed: false},
  ]);

  // Stats data
  const [stats, setStats] = useState([
    {name: 'STRENGTH', value: 30},
    {name: 'ENDURANCE', value: 40},
    {name: 'AGILITY', value: 50},
    {name: 'DISCIPLINE', value: 20},
  ]);

  // Memoize the showSystemMessage function with useCallback
  const showSystemMessage = useCallback(
    message => {
      setSystemMessage(message);

      // Animate in
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setSystemMessage(null));
    },
    [fadeAnim],
  );

  // Function to toggle quest completion
  const toggleQuestCompletion = useCallback(
    id => {
      setQuests(currentQuests =>
        currentQuests.map(quest => {
          if (quest.id === id) {
            const newStatus = !quest.completed;

            // Show system message when completing a quest
            if (newStatus) {
              showSystemMessage('Quest completed! Experience +50');
            }

            return {...quest, completed: newStatus};
          }
          return quest;
        }),
      );
    },
    [showSystemMessage],
  );

  // Show welcome message when screen loads
  useEffect(() => {
    refreshUserData();
    const timer = setTimeout(() => {
      showSystemMessage('Welcome back, Hunter!');
    }, 1000);

    return () => clearTimeout(timer);
  }, [showSystemMessage, refreshUserData]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* System Message */}
          {systemMessage && (
            <Animated.View style={[styles.systemMessage, {opacity: fadeAnim}]}>
              <Text style={styles.systemMessageText}>{systemMessage}</Text>
            </Animated.View>
          )}

          {/* Status Header */}
          <View style={styles.statusHeader}>
            <Text style={styles.statusHeaderTitle}>HUNTER STATUS</Text>
            <Text style={styles.rankText}>{user.rank_name}</Text>
          </View>

          {/* Character Info */}
          <View style={styles.characterInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>JS</Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>John Smith</Text>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#161B22',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 80, // Extra padding for navbar
  },
  systemMessage: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#38BDF8',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  systemMessageText: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '500',
  },
  statusHeader: {
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  statusHeaderTitle: {
    color: '#38BDF8',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(56, 189, 248, 0.5)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
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
    marginTop: 20,
    paddingVertical: 10,
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
    shadowColor: '#38BDF8',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
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
    textShadowColor: 'rgba(56, 189, 248, 0.4)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 8,
  },
  statsPanel: {
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    shadowColor: '#38BDF8',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  panelTitle: {
    color: '#38BDF8',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(56, 189, 248, 0.4)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 8,
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
    marginTop: 20,
    shadowColor: '#38BDF8',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
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
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#38BDF8',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
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
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#1F2937',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  navItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItemActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderWidth: 2,
    borderColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  navIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  navIconActive: {
    color: '#38BDF8',
  },
});

export default StatusScreen;
