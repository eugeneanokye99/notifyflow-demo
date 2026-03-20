import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useRootNavigationState } from 'expo-router';
import { Audio } from 'expo-av';
import { fetchInAppNotifications } from '../api/presenceApi';
import { InAppNotification } from '../types';
import { useInAppNotificationsStore } from './inAppNotificationsStore';

type InAppToastHostProps = {
  userId?: number | null;
};

const TOAST_VISIBLE_MS = 2800;
const POLL_INTERVAL_MS = 3000;
const SWIPE_DISMISS_THRESHOLD = -32;
const IN_APP_TOAST_SOUND_URL = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

function getOrderId(notification: InAppNotification): string | null {
  const orderId = (notification.data as { orderId?: number | string })?.orderId;
  if (orderId === undefined || orderId === null || orderId === '') {
    return null;
  }

  return String(orderId);
}

export function InAppToastHost({ userId }: InAppToastHostProps) {
  const rootNavigationState = useRootNavigationState();
  const setNotifications = useInAppNotificationsStore((state) => state.setNotifications);

  const [queue, setQueue] = useState<InAppNotification[]>([]);
  const [currentToast, setCurrentToast] = useState<InAppNotification | null>(null);

  const hasBootstrapped = useRef(false);
  const lastSeenId = useRef<number>(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDismissing = useRef(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const translateY = useRef(new Animated.Value(-140)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(1)).current;

  const canNavigate = useMemo(() => Boolean(rootNavigationState?.key), [rootNavigationState?.key]);

  const playSoftToastSound = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: IN_APP_TOAST_SOUND_URL },
        { volume: 0.16, shouldPlay: true, isLooping: false }
      );

      soundRef.current = sound;
    } catch {
      // Keep toast flow smooth even if sound fails due to connectivity/device constraints.
    }
  }, []);

  const dismissCurrentToast = useCallback(() => {
    if (isDismissing.current) {
      return;
    }

    isDismissing.current = true;

    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }

    progress.stopAnimation();

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -140,
        duration: 180,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true
      }),
      Animated.timing(dragY, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true
      })
    ]).start(() => {
      setCurrentToast(null);
      isDismissing.current = false;
    });
  }, [dragY, opacity, progress, translateY]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dy) > 6 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderMove: (_, gesture) => {
          // Limit drag direction to subtle upward swipe dismissal.
          dragY.setValue(Math.min(0, gesture.dy));
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy <= SWIPE_DISMISS_THRESHOLD) {
            dismissCurrentToast();
            return;
          }

          Animated.spring(dragY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 18,
            stiffness: 180
          }).start();
        }
      }),
    [dismissCurrentToast, dragY]
  );

  const pollNotifications = useCallback(async () => {
    if (!userId) return;

    const items = await fetchInAppNotifications(userId);
    setNotifications(items);

    const latestId = items[0]?.id ?? 0;

    if (!hasBootstrapped.current) {
      lastSeenId.current = latestId;
      hasBootstrapped.current = true;
      return;
    }

    if (latestId <= lastSeenId.current) {
      return;
    }

    const freshItems = items
      .filter((notification) => notification.id > lastSeenId.current)
      .sort((a, b) => a.id - b.id);

    if (freshItems.length > 0) {
      setQueue((existing) => [...existing, ...freshItems]);
      lastSeenId.current = latestId;
    }
  }, [setNotifications, userId]);

  useEffect(() => {
    if (!userId) {
      hasBootstrapped.current = false;
      lastSeenId.current = 0;
      setQueue([]);
      setCurrentToast(null);
      return;
    }

    pollNotifications().catch(() => null);

    const intervalId = setInterval(() => {
      pollNotifications().catch(() => null);
    }, POLL_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [pollNotifications, userId]);

  useEffect(() => {
    if (currentToast || queue.length === 0) {
      return;
    }

    const [nextToast, ...rest] = queue;
    setQueue(rest);
    setCurrentToast(nextToast);
  }, [currentToast, queue]);

  useEffect(() => {
    if (!currentToast) {
      return;
    }

    translateY.setValue(-140);
    dragY.setValue(0);
    opacity.setValue(0);
    progress.setValue(1);
    isDismissing.current = false;
    playSoftToastSound().catch(() => null);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 16,
        stiffness: 160
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true
      }),
      Animated.timing(progress, {
        toValue: 0,
        duration: TOAST_VISIBLE_MS,
        useNativeDriver: true
      })
    ]).start();

    hideTimer.current = setTimeout(() => {
      dismissCurrentToast();
    }, TOAST_VISIBLE_MS);

    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
      progress.stopAnimation();
    };
  }, [currentToast, dismissCurrentToast, dragY, opacity, playSoftToastSound, progress, translateY]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => null);
      }
    };
  }, []);

  if (!currentToast) {
    return null;
  }

  const orderId = getOrderId(currentToast);

  return (
    <View pointerEvents="box-none" style={styles.host}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.toastWrapper, { opacity, transform: [{ translateY }, { translateY: dragY }] }]}>
        <Pressable
          style={styles.toastCard}
          onPress={() => {
            if (!orderId || !canNavigate) return;
            router.push({ pathname: '/order-details', params: { orderId } });
          }}>
          <View style={styles.accentBar} />
          <View style={styles.content}>
            <Text style={styles.kicker}>New Notification</Text>
            <Text style={styles.title}>{currentToast.title}</Text>
            <Text style={styles.message}>{currentToast.message}</Text>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { transform: [{ scaleX: progress }] }]} />
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    elevation: 20,
    alignItems: 'center'
  },
  toastWrapper: {
    width: '100%',
    paddingHorizontal: 14,
    paddingTop: 10
  },
  toastCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
    shadowColor: '#020617',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    flexDirection: 'row'
  },
  accentBar: {
    width: 5,
    backgroundColor: '#22d3ee'
  },
  content: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12
  },
  kicker: {
    color: '#67e8f9',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2
  },
  title: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2
  },
  message: {
    color: '#cbd5e1',
    fontSize: 13
  },
  progressTrack: {
    marginTop: 9,
    height: 3,
    borderRadius: 999,
    backgroundColor: '#1e293b',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#67e8f9'
  }
});
