// src/screens/DungeonScreen.js
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const DungeonScreen = ({ navigation }) => {
  // State declarations
  const [activeTab, setActiveTab] = useState('daily');
  const [systemMessage, setSystemMessage] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // Dungeon data for each tab
  const [dungeons, setDungeons] = useState({
    daily: [
      { 
        id: 1,
        title: 'Cardio Gate',
        type: 'E-Rank',
        duration: '15-30 min',
        description: 'Complete 20 min of any cardio exercise to clear this dungeon.',
        iconType: 'cardio',
        status: 'available'
      },
      {
        id: 2,
        title: 'Stretching Vault',
        type: 'E-Rank',
        duration: '10 min',
        description: 'Morning stretches to improve flexibility and prepare for the day.',
        iconType: 'stretch',
        status: 'cleared'
      },
      {
        id: 3,
        title: 'Strength Temple',
        type: 'D-Rank',
        duration: '20 min',
        description: 'Requires Hunter Rank D to unlock this advanced strength training.',
        iconType: 'strength',
        status: 'locked'
      },
    ],
    weekly: [
      {
        id: 4,
        title: 'Endurance Trial',
        type: 'D-Rank',
        duration: '45 min',
        description: 'A challenging weekly dungeon with high endurance requirements.',
        iconType: 'endurance',
        status: 'available'
      },
    ],
    special: [
      {
        id: 5, 
        title: 'Double Dungeon',
        type: 'C-Rank',
        duration: '60 min',
        description: 'A rare special dungeon that requires partner assistance. High rewards!',
        iconType: 'double',
        status: 'locked',
      },
    ],
  });

  // Memoize the showSystemMessage function
  const showSystemMessage = useCallback((message) => {
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
  }, [fadeAnim]);

  // Function to enter a dungeon
  const enterDungeon = useCallback((dungeon) => {
    if (dungeon.status === 'locked') {
      showSystemMessage(`You need to reach ${dungeon.type} to unlock this dungeon.`);
      return;
    } else if (dungeon.status === 'cleared') {
      showSystemMessage('You\'ve already cleared this dungeon today.');
      return;
    }
    
    showSystemMessage(`Entering ${dungeon.title}...`);
    // In a real app, you would navigate to the workout screen here
    // navigation.navigate('WorkoutSession', { dungeon });
  }, [showSystemMessage]);

  // Switch between tabs (daily, weekly, special)
  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  // Welcome message when screen loads
  useEffect(() => {
    const timer = setTimeout(() => {
      showSystemMessage('Available dungeons detected!');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [showSystemMessage]);

  // Icon component based on dungeon type
  const DungeonIcon = ({ type, status }) => {
    // Default styles
    const containerStyle = [
      styles.dungeonIconContainer,
      status === 'locked' && styles.dungeonIconContainerLocked,
    ];

    const iconColor = status === 'locked' ? '#4B5563' : '#38BDF8';

    // Render different icons based on type
    let iconContent;
    switch (type) {
      case 'cardio':
        iconContent = (
          <View style={containerStyle}>
            <View style={styles.cardioIcon}>
              <View style={[styles.cardioIconLine, { borderColor: iconColor }]} />
              <View style={[styles.cardioIconDot, { backgroundColor: iconColor }]} />
            </View>
          </View>
        );
        break;
      case 'stretch':
        iconContent = (
          <View style={containerStyle}>
            <View style={styles.stretchIcon}>
              <View style={[styles.stretchIconLine, { backgroundColor: iconColor }]} />
              <View style={[styles.stretchIconLine, { backgroundColor: iconColor, transform: [{ rotate: '90deg' }] }]} />
            </View>
          </View>
        );
        break;
      case 'strength':
        iconContent = (
          <View style={containerStyle}>
            {status === 'locked' ? (
              <View style={styles.lockIcon}>
                <View style={[styles.lockIconBody, { borderColor: iconColor }]} />
                <View style={[styles.lockIconShackle, { backgroundColor: iconColor }]} />
              </View>
            ) : (
              <Text style={[styles.strengthIcon, { color: iconColor }]}>💪</Text>
            )}
          </View>
        );
        break;
      case 'endurance':
        iconContent = (
          <View style={containerStyle}>
            <View style={styles.enduranceIcon}>
              <View style={[styles.enduranceIconCircle, { borderColor: iconColor }]} />
              <View style={[styles.enduranceIconArrow, { borderColor: iconColor }]} />
            </View>
          </View>
        );
        break;
      case 'double':
        iconContent = (
          <View style={containerStyle}>
            <Text style={[styles.doubleIcon, { color: iconColor }]}>👥</Text>
          </View>
        );
        break;
      default:
        iconContent = (
          <View style={containerStyle}>
            <Text style={[styles.defaultIcon, { color: iconColor }]}>⚔️</Text>
          </View>
        );
    }

    return iconContent;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* System Message */}
          {systemMessage && (
            <Animated.View style={[styles.systemMessage, { opacity: fadeAnim }]}>
              <Text style={styles.systemMessageText}>{systemMessage}</Text>
            </Animated.View>
          )}

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>DUNGEONS</Text>

            {/* User Level & Portal Key Info */}
            <View style={styles.userInfoContainer}>
              <View style={styles.userInfoContent}>
                <Text style={styles.levelText}>Lv. 3</Text>
                <Text style={styles.keysText}>2 Keys</Text>
              </View>
              <View style={styles.keyIconContainer}>
                <View style={styles.keyIcon} />
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
              onPress={() => switchTab('daily')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}>DAILY</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
              onPress={() => switchTab('weekly')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>WEEKLY</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tab, activeTab === 'special' && styles.activeTab]}
              onPress={() => switchTab('special')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'special' && styles.activeTabText]}>SPECIAL</Text>
            </TouchableOpacity>
          </View>

          {/* Dungeon Cards */}
          {dungeons[activeTab] && dungeons[activeTab].map((dungeon) => (
            <View 
              key={dungeon.id} 
              style={[
                styles.dungeonCard,
                dungeon.status === 'locked' && styles.dungeonCardLocked
              ]}
            >
              {/* Dungeon Icon Section */}
              <View style={styles.dungeonIconSection}>
                <DungeonIcon type={dungeon.iconType} status={dungeon.status} />
              </View>

              {/* Dungeon Info Section */}
              <View style={styles.dungeonInfoSection}>
                <Text style={[
                  styles.dungeonTitle,
                  dungeon.status === 'locked' && styles.dungeonTitleLocked
                ]}>
                  {dungeon.title}
                </Text>

                <Text style={[
                  styles.dungeonMeta,
                  dungeon.status === 'locked' && styles.dungeonMetaLocked
                ]}>
                  {dungeon.duration} • {dungeon.type}
                </Text>

                <View style={styles.dungeonDivider} />

                <Text style={[
                  styles.dungeonDescription,
                  dungeon.status === 'locked' && styles.dungeonDescriptionLocked
                ]}>
                  {dungeon.description}
                </Text>

                {/* Action button */}
                <TouchableOpacity 
                  style={[
                    styles.dungeonButton,
                    dungeon.status === 'cleared' && styles.dungeonButtonCleared,
                    dungeon.status === 'locked' && styles.dungeonButtonLocked,
                  ]}
                  onPress={() => enterDungeon(dungeon)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dungeonButtonText,
                    dungeon.status === 'locked' && styles.dungeonButtonTextLocked
                  ]}>
                    {dungeon.status === 'available' ? 'ENTER' : 
                     dungeon.status === 'cleared' ? 'CLEARED' : 'LOCKED'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  systemMessageText: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#1F2937',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: -20,
    marginTop: -20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(56, 189, 248, 0.3)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    backgroundColor: '#192130',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 8,
    width: 100,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 10,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  userInfoContent: {
    flex: 1,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  keysText: {
    color: '#38BDF8',
    fontSize: 12,
  },
  keyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyIcon: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#38BDF8',
    transform: [{ rotate: '90deg' }],
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tab: {
    backgroundColor: '#192130',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: (width - 60) / 3,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#38BDF8',
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#192130',
  },
  dungeonCard: {
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    height: 150,
  },
  dungeonCardLocked: {
    borderColor: '#4B5563',
    shadowColor: '#4B5563',
  },
  dungeonIconSection: {
    width: 120,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dungeonInfoSection: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  dungeonTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dungeonTitleLocked: {
    color: '#6B7280',
  },
  dungeonMeta: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 5,
  },
  dungeonMetaLocked: {
    color: '#6B7280',
  },
  dungeonDivider: {
    height: 2,
    backgroundColor: 'rgba(56, 189, 248, 0.3)',
    marginVertical: 10,
  },
  dungeonDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 15,
    flex: 1,
  },
  dungeonDescriptionLocked: {
    color: '#6B7280',
  },
  dungeonButton: {
    backgroundColor: '#38BDF8',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    minWidth: 60,
    alignItems: 'center',
  },
  dungeonButtonCleared: {
    backgroundColor: 'rgba(56, 189, 248, 0.5)',
  },
  dungeonButtonLocked: {
    backgroundColor: '#4B5563',
  },
  dungeonButtonText: {
    color: '#192130',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dungeonButtonTextLocked: {
    color: '#D1D5DB',
  },
  dungeonIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderWidth: 2,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dungeonIconContainerLocked: {
    backgroundColor: 'rgba(75, 85, 99, 0.2)',
    borderColor: '#4B5563',
  },
  cardioIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardioIconLine: {
    width: 25,
    height: 20,
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 15,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  cardioIconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
    position: 'absolute',
  },
  stretchIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stretchIconLine: {
    width: 20,
    height: 2,
    backgroundColor: '#38BDF8',
  },
  lockIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIconBody: {
    width: 20,
    height: 15,
    borderWidth: 2,
    borderColor: '#4B5563',
    borderRadius: 2,
  },
  lockIconShackle: {
    width: 10,
    height: 10,
    backgroundColor: '#4B5563',
    borderRadius: 5,
    position: 'absolute',
    top: 5,
  },
  strengthIcon: {
    fontSize: 24,
    color: '#38BDF8',
  },
  enduranceIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enduranceIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  enduranceIconArrow: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: '#38BDF8',
    position: 'absolute',
    right: 8,
    transform: [{ rotate: '45deg' }],
  },
  doubleIcon: {
    fontSize: 20,
    color: '#38BDF8',
  },
  defaultIcon: {
    fontSize: 20,
    color: '#38BDF8',
  },
});

export default DungeonScreen;