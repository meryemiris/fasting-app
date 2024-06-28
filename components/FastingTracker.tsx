import React, { useState, useEffect } from "react";
import {
	View,
	Button,
	StyleSheet,
	FlatList,
	SafeAreaView,
	Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "./ThemedText";

type FastingPeriod = {
	start: string;
	end: string;
};

type FastingTrackerProps = {
	eatTime: number;
	fastTime: number;
};

const FastingTracker: React.FC<FastingTrackerProps> = ({
	fastTime,
	eatTime,
}) => {
	const [isFasting, setIsFasting] = useState<boolean>(false);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [fastingPeriods, setFastingPeriods] = useState<FastingPeriod[]>([]);
	const [timeLeft, setTimeLeft] = useState<number>(fastTime * 3600);
	const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
	const [isEating, setIsEating] = useState<boolean>(false);

	useEffect(() => {
		const loadFastingPeriods = async () => {
			const storedPeriods = await AsyncStorage.getItem("fastingPeriods");
			if (storedPeriods) {
				setFastingPeriods(JSON.parse(storedPeriods));
			}
		};
		loadFastingPeriods();
	}, []);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isTimerRunning) {
			interval = setInterval(() => {
				setTimeLeft((prevTimeLeft) => {
					if (prevTimeLeft <= 1) {
						if (isFasting) {
							Alert.alert("Eating time");
							setIsFasting(false);
							setTimeLeft(eatTime * 3600);
						} else {
							Alert.alert("Fasting time");
							setIsFasting(true);
							setTimeLeft(fastTime * 3600);
						}
					}
					return prevTimeLeft > 0 ? prevTimeLeft - 1 : 0;
				});
			}, 1000);
		} else if (interval) {
			clearInterval(interval);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isTimerRunning, isFasting, fastTime, eatTime]);

	const startFasting = () => {
		setIsFasting(true);
		setStartTime(new Date());
		setTimeLeft(fastTime * 3600);
		setIsTimerRunning(true);
	};

	const stopFasting = async () => {
		if (startTime) {
			const endTime = new Date();
			const newPeriod: FastingPeriod = {
				start: startTime.toISOString(),
				end: endTime.toISOString(),
			};
			const updatedPeriods = [...fastingPeriods, newPeriod];
			setFastingPeriods(updatedPeriods);
			setIsFasting(false);
			setStartTime(null);
			setIsTimerRunning(false);
			setTimeLeft(fastTime * 3600);
			await AsyncStorage.setItem(
				"fastingPeriods",
				JSON.stringify(updatedPeriods)
			);
		}
	};

	const handlePress = () => {
		if (isFasting) {
			stopFasting();
		} else {
			startFasting();
		}
	};

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		return `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
				{isTimerRunning ? (
					<ThemedText type="title">{formatTime(timeLeft)}</ThemedText>
				) : (
					<ThemedText type="title">{`${fastTime}:00:00`}</ThemedText>
				)}
				<Button
					onPress={handlePress}
					title={isFasting ? "Stop Fasting" : "Start Fasting"}
				/>
			</View>
			<FlatList
				data={fastingPeriods}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => (
					<View style={styles.period}>
						<ThemedText type="subtitle">
							Start:{" "}
							<ThemedText type="default">
								{new Date(item.start).toLocaleString()}
							</ThemedText>
						</ThemedText>
						<ThemedText type="subtitle">
							End:{" "}
							<ThemedText type="default">
								{new Date(item.end).toLocaleString()}
							</ThemedText>
						</ThemedText>
					</View>
				)}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		margin: 20,
	},
	period: {
		padding: 10,
	},
});

export default FastingTracker;
