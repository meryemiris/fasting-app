import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	Button,
	StyleSheet,
	FlatList,
	SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "./ThemedText";
import LoopingTimer from "./LoopingTimer";

type FastingPeriod = {
	start: string;
	end: string;
};

type FastingTrackerProps = {
	eatTime: number;
	fastTime: number;
};

const FastingTracker: React.FC<FastingTrackerProps> = ({
	eatTime,
	fastTime,
}) => {
	const [isFasting, setIsFasting] = useState<boolean>(false);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [fastingPeriods, setFastingPeriods] = useState<FastingPeriod[]>([]);

	useEffect(() => {
		const loadFastingPeriods = async () => {
			const storedPeriods = await AsyncStorage.getItem("fastingPeriods");
			if (storedPeriods) {
				setFastingPeriods(JSON.parse(storedPeriods));
			}
		};
		loadFastingPeriods();
	}, []);

	const startFasting = () => {
		setIsFasting(true);
		setStartTime(new Date());
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
			await AsyncStorage.setItem(
				"fastingPeriods",
				JSON.stringify(updatedPeriods)
			);
		}
	};

	const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
	const countDownFrom = isFasting ? fastTime : eatTime;

	const handlePress = () => {
		if (isFasting) {
			stopFasting();
			setIsTimerRunning(false);
			return;
		}
		startFasting();
		setIsTimerRunning(true);
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<LoopingTimer startTime={countDownFrom} isRunning={isTimerRunning} />
			<Button
				onPress={handlePress}
				title={isFasting ? "Stop Fasting" : "Start Fasting"}
			/>
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
								{" "}
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
	period: {
		padding: 10,
	},
});

export default FastingTracker;
